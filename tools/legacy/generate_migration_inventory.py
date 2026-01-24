import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Set, Tuple


REPO_ROOT = Path(__file__).resolve().parents[2]
APP_API_ROOT = REPO_ROOT / "app" / "api"
PRISMA_SCHEMA = REPO_ROOT / "prisma" / "schema.prisma"
OUT_DIR = REPO_ROOT / "backend" / "migration"


@dataclass
class RouteInfo:
    file: Path
    url_path: str
    methods: List[str]
    auth: str
    prisma_models: List[str]


HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]


SCALAR_PRISMA_TYPES: Set[str] = {
    "String",
    "Boolean",
    "Int",
    "BigInt",
    "Float",
    "Decimal",
    "DateTime",
    "Json",
    "Bytes",
}


def normalize_prisma_type(ftype: str) -> str:
    return ftype.replace("[]", "").replace("?", "").strip()


def route_file_to_url(path: Path) -> str:
    # path is .../app/api/**/route.ts
    rel = path.relative_to(APP_API_ROOT)
    parts = list(rel.parts)
    # drop trailing route.ts
    parts = parts[:-1]

    # Next.js app router segments:
    # - [id] becomes :id (we'll keep [] to preserve exact path semantics)
    # - [...slug] keep as [...slug]
    url = "/api" + ("/" + "/".join(parts) if parts else "")
    url = url.replace("\\", "/")
    return url


def extract_exported_methods(ts_source: str) -> List[str]:
    methods: List[str] = []
    for m in HTTP_METHODS:
        # export async function GET( or export function GET(
        if re.search(rf"export\s+(?:async\s+)?function\s+{m}\s*\(", ts_source):
            methods.append(m)
    return methods


def infer_route_auth(url_path: str, ts_source: str) -> str:
    # Heuristic classification:
    # - admin: explicit admin path or role enforcement
    # - auth: requires a signed-in user/session
    # - public: no obvious auth
    if url_path.startswith("/api/admin"):
        return "admin"

    admin_markers = [
        "requireAdmin",
        "isAdmin",
        "RoleKey.ADMIN",
        "defaultRole ===",
        "role ===",
        "ADMIN",
    ]
    if any(m in ts_source for m in admin_markers):
        return "admin"

    auth_markers = [
        "getServerSession",
        "getToken(",
        "auth()",
        "requireAuth",
        "requireUser",
        "NextAuth",
        "next-auth",
        "session",
        "Authorization",
    ]
    if any(m in ts_source for m in auth_markers):
        return "auth"

    return "public"


def extract_prisma_models_touched(ts_source: str) -> List[str]:
    # Captures prisma.<model>.<operation>(...) and similar
    candidates: Set[str] = set()
    for match in re.finditer(r"\bprisma\.(\w+)", ts_source):
        candidates.add(match.group(1))
    # Some files may import prisma as db
    for match in re.finditer(r"\bdb\.(\w+)", ts_source):
        candidates.add(match.group(1))
    # Filter out common non-model properties
    blacklist = {"$connect", "$disconnect", "$transaction", "$queryRaw", "$executeRaw"}
    filtered = [c for c in candidates if c not in blacklist]
    return sorted(filtered)


def list_route_files() -> List[Path]:
    if not APP_API_ROOT.exists():
        return []
    files: List[Path] = []
    for root, _dirs, filenames in os.walk(APP_API_ROOT):
        for name in filenames:
            if name == "route.ts" or name == "route.js":
                files.append(Path(root) / name)
    return sorted(files)


@dataclass
class PrismaBlock:
    kind: str  # model|enum
    name: str
    body: str


def parse_prisma_blocks(schema_text: str) -> List[PrismaBlock]:
    blocks: List[PrismaBlock] = []
    # crude but robust enough: match "model X { ... }" and "enum X { ... }"
    pattern = re.compile(r"\b(model|enum)\s+(\w+)\s*\{", re.MULTILINE)

    idx = 0
    while True:
        match = pattern.search(schema_text, idx)
        if not match:
            break
        kind, name = match.group(1), match.group(2)
        start = match.end()
        depth = 1
        i = start
        while i < len(schema_text) and depth > 0:
            if schema_text[i] == "{":
                depth += 1
            elif schema_text[i] == "}":
                depth -= 1
            i += 1
        body = schema_text[start : i - 1].strip("\n")
        blocks.append(PrismaBlock(kind=kind, name=name, body=body))
        idx = i

    return blocks


def prisma_model_summary(body: str) -> Tuple[List[Tuple[str, str]], List[str]]:
    fields: List[Tuple[str, str]] = []
    relations: List[str] = []

    for raw in body.splitlines():
        line = raw.strip()
        if not line or line.startswith("//"):
            continue
        if line.startswith("@@"):
            continue
        # field lines look like: name Type? @attr ...
        # enum values are handled separately.
        if line.startswith("@"):  # ignore attributes-only lines
            continue

        # skip block comments or weird lines
        if "{" in line or "}" in line:
            continue

        # fields are "<name> <type> ..."
        parts = line.split()
        if len(parts) < 2:
            continue
        fname, ftype = parts[0], parts[1]
        # detect relations by type being another model (capitalized) and/or @relation
        if "@relation" in line:
            relations.append(f"{fname}: {ftype}")
        else:
            fields.append((fname, ftype))

    return fields, relations


def prisma_model_summary_with_model_names(body: str, model_names: Set[str]) -> Tuple[List[Tuple[str, str]], List[str]]:
    fields: List[Tuple[str, str]] = []
    relations: List[str] = []

    for raw in body.splitlines():
        line = raw.strip()
        if not line or line.startswith("//"):
            continue
        if line.startswith("@@"):
            continue
        if line.startswith("@"):  # ignore attributes-only lines
            continue
        if "{" in line or "}" in line:
            continue

        parts = line.split()
        if len(parts) < 2:
            continue
        fname, ftype = parts[0], parts[1]
        base_type = normalize_prisma_type(ftype)

        if "@relation" in line or base_type in model_names:
            relations.append(f"{fname}: {ftype}")
        elif base_type in SCALAR_PRISMA_TYPES:
            fields.append((fname, ftype))
        else:
            # Usually enums (or unsupported scalars). Keep as field, but it may be an enum.
            fields.append((fname, ftype))

    return fields, relations


def suggest_django_app_for_model(model_name: str) -> str:
    # Light heuristic to help file ownership during the port.
    # Keep this conservative; it's only a suggestion.
    if model_name.startswith("Cms") or model_name in {"Media"}:
        return "academy_cms"
    if "Payment" in model_name or model_name in {"Order", "Transaction"}:
        return "academy_payments"
    if "Enrollment" in model_name or "Progress" in model_name or model_name in {"Certificate"}:
        return "academy_learning"
    if model_name in {"Course", "Module", "Lesson", "Project", "Topic", "Subtopic"}:
        return "academy_courses"
    if model_name in {"AuditLog", "ActivityLog", "AnalyticsEvent"}:
        return "academy_audit"
    if model_name in {"User", "Account", "Session", "VerificationToken"}:
        return "academy_users"
    if model_name in {"Role", "UserRole"}:
        return "academy_rbac"
    return "(decide)"


def prisma_enum_values(body: str) -> List[str]:
    values: List[str] = []
    for raw in body.splitlines():
        line = raw.strip()
        if not line or line.startswith("//"):
            continue
        if line.startswith("@@"):
            continue
        # enum values are usually single tokens
        token = line.split()[0]
        if token.isidentifier():
            values.append(token)
    return values


def write_route_inventory(routes: List[RouteInfo]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / "ROUTE_INVENTORY.md"

    lines: List[str] = []
    lines.append("# Route Inventory (Next.js → Django)")
    lines.append("")
    lines.append("This file is auto-generated by `tools/legacy/generate_migration_inventory.py`.")
    lines.append("It enumerates Next.js App Router API endpoints and the exported HTTP methods.")
    lines.append("")
    lines.append(f"Total endpoints: {len(routes)}")
    lines.append("")
    lines.append("| Endpoint | Methods | Auth | Prisma Models | Source |");
    lines.append("|---|---|---|---|---|")

    for r in routes:
        methods = ", ".join(r.methods) if r.methods else "(unknown)"
        src = r.file.relative_to(REPO_ROOT).as_posix()
        prisma_models = ", ".join(f"`{m}`" for m in r.prisma_models) if r.prisma_models else "(none found)"
        lines.append(f"| `{r.url_path}` | {methods} | {r.auth} | {prisma_models} | `{src}` |")

    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_prisma_map(blocks: List[PrismaBlock]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / "PRISMA_MODEL_MAP.md"

    models = [b for b in blocks if b.kind == "model"]
    enums = [b for b in blocks if b.kind == "enum"]
    model_names = {m.name for m in models}

    lines: List[str] = []
    lines.append("# Prisma Schema Map")
    lines.append("")
    lines.append("This file is auto-generated by `tools/legacy/generate_migration_inventory.py`.")
    lines.append("Use it as the source-of-truth checklist while porting to Django models.")
    lines.append("")
    lines.append(f"Models: {len(models)}")
    lines.append(f"Enums: {len(enums)}")

    lines.append("\n## Enums\n")
    for e in enums:
        vals = prisma_enum_values(e.body)
        lines.append(f"### {e.name}")
        lines.append("")
        if vals:
            lines.append("- " + ", ".join(f"`{v}`" for v in vals))
        else:
            lines.append("- (no values parsed)")
        lines.append("")

    lines.append("\n## Models\n")
    for m in models:
        fields, relations = prisma_model_summary_with_model_names(m.body, model_names)
        lines.append(f"### {m.name}")
        lines.append("")
        lines.append(f"**Suggested Django app**\n- `{suggest_django_app_for_model(m.name)}`")
        lines.append("")
        if fields:
            lines.append("**Fields**")
            for fname, ftype in fields[:40]:
                lines.append(f"- `{fname}`: `{ftype}`")
            if len(fields) > 40:
                lines.append(f"- … ({len(fields) - 40} more)")
        else:
            lines.append("**Fields**\n- (none parsed)")

        lines.append("")
        if relations:
            lines.append("**Relations (@relation)**")
            for rel in relations[:40]:
                lines.append(f"- `{rel}`")
            if len(relations) > 40:
                lines.append(f"- … ({len(relations) - 40} more)")
        else:
            lines.append("**Relations (@relation)**\n- (none parsed)")
        lines.append("")

    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    # 1) Route inventory
    route_files = list_route_files()
    routes: List[RouteInfo] = []
    for f in route_files:
        try:
            src = f.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            src = f.read_text(encoding="utf-8", errors="ignore")

        url_path = route_file_to_url(f)
        routes.append(
            RouteInfo(
                file=f,
                url_path=url_path,
                methods=extract_exported_methods(src),
                auth=infer_route_auth(url_path, src),
                prisma_models=extract_prisma_models_touched(src),
            )
        )

    write_route_inventory(routes)

    # 2) Prisma map
    if PRISMA_SCHEMA.exists():
        schema_text = PRISMA_SCHEMA.read_text(encoding="utf-8")
        blocks = parse_prisma_blocks(schema_text)
        write_prisma_map(blocks)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
