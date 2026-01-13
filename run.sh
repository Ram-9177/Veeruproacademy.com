#!/usr/bin/env bash
set -euo pipefail

printf "\n=== Veeru's Pro Academy: Full Pipeline ===\n"

# Allow optional flags:
#   --smoke   Run Playwright smoke tests after build & export
#   --no-start Skip starting the server (useful in CI when only validating build/tests)
SMOKE=0
START_SERVER=1
for arg in "$@"; do
	case "$arg" in
		--smoke) SMOKE=1 ;;
		--no-start) START_SERVER=0 ;;
	esac
done

step() { printf "\n[step] $1\n"; }

step "Generating site settings"
node scripts/generate-site-settings.js

step "Generating search index"
node scripts/generate-search-index.js || echo "Search index generation skipped (non-fatal)"

step "Generating sitemap"
node scripts/generate-sitemap.js || echo "Sitemap generation skipped (non-fatal)"

step "Type-checking"
npm run type-check

step "Linting"
npm run lint || echo "Lint warnings/errors encountered. Continuing."

step "Running unit tests"
npm test

step "Building production bundle"
npm run build

# Ensure static export exists for Playwright (serves ./out). Only run if smoke tests requested.
if [[ $SMOKE -eq 1 ]]; then
	step "Exporting static site for smoke tests"
	npx next export || { echo "next export failed"; exit 1; }
	if [[ ! -d out ]]; then
		echo "Smoke tests requested but ./out not found after export" >&2
		exit 1
	fi
	step "Running Playwright smoke tests"
	npx playwright test tests/smoke.spec.ts || { echo "Smoke tests failed"; exit 1; }
fi

if [[ $START_SERVER -eq 1 ]]; then
	step "Starting server"
	npm start
else
	step "Skipping server start (--no-start)"
fi
