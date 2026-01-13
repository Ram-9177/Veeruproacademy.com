# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment of Veeru's Pro Academy.

## 📋 Workflows Overview

### 1. CI Workflow (`ci.yml`)

**Triggers:** Pull requests and pushes to main/master/develop branches

**Jobs:**
- **Lint** - Runs ESLint to check code quality and style
- **Type Check** - Validates TypeScript types across the codebase
- **Test** - Runs unit tests with Jest
- **Build** - Verifies the application builds successfully

**Purpose:** Ensures code quality and catches issues before merging

---

### 2. Security Workflow (`security.yml`)

**Triggers:** 
- Pull requests and pushes to main/master/develop branches
- Scheduled weekly (Mondays at 9 AM UTC)

**Jobs:**
- **Dependency Audit** - Scans npm dependencies for known vulnerabilities
- **CodeQL Analysis** - Performs static code analysis for security issues
- **Secret Scanning** - Detects accidentally committed secrets using TruffleHog

**Purpose:** Maintains security and identifies vulnerabilities early

---

### 3. E2E Tests Workflow (`e2e.yml`)

**Triggers:** Pull requests and pushes to main/master/develop branches

**Jobs:**
- **E2E Smoke Tests** - Runs critical end-to-end tests with Playwright
  - Sets up PostgreSQL database
  - Runs database migrations
  - Builds and starts the application
  - Executes smoke tests
  - Uploads test artifacts

**Purpose:** Validates critical user flows work correctly

---

### 4. Deploy Workflow (`deploy.yml`)

**Triggers:**
- Pushes to main/master branches
- Manual workflow dispatch

**Jobs:**
- **Pre-deployment Checks** - Runs all CI checks before deployment
- **Deploy** - Notifies about Vercel deployment (Vercel handles actual deployment)
- **Post-deployment Health Check** - Verifies site is accessible after deployment

**Purpose:** Ensures safe deployments with automated checks

---

## 🚀 Workflow Execution

### Automatic Triggers

1. **On Pull Request:**
   - CI workflow runs all checks
   - Security workflow scans for vulnerabilities
   - E2E workflow runs smoke tests
   - Results appear as PR checks

2. **On Push to Main:**
   - All CI checks run
   - Deploy workflow triggers
   - Vercel automatically deploys
   - Health checks verify deployment

3. **Weekly Schedule:**
   - Security scan runs every Monday
   - Checks for new vulnerabilities

### Manual Triggers

You can manually trigger the deploy workflow:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Production**
3. Click **Run workflow**
4. Choose environment (production/staging)
5. Click **Run workflow**

---

## ⚙️ Configuration

### Required Secrets

None required currently - Vercel handles deployment automatically via their GitHub integration.

### Environment Variables

Workflows use test/dummy values for CI:

```yaml
DATABASE_URL: postgresql://user:password@localhost:5432/test
DIRECT_URL: postgresql://user:password@localhost:5432/test
NEXTAUTH_SECRET: test-secret-key-for-ci-only-min-32-chars
NEXTAUTH_URL: http://localhost:3000
NEXT_PUBLIC_SITE_URL: http://localhost:3000
```

**Note:** These are only for CI testing. Production values are set in Vercel.

---

## 📊 Monitoring Workflow Results

### View Workflow Status

1. Go to repository **Actions** tab
2. See all workflow runs and their status
3. Click any run to see detailed logs

### PR Checks

All workflows appear as checks on pull requests:
- ✅ Green check = passed
- ❌ Red X = failed
- 🟡 Yellow dot = running

### Notifications

GitHub sends notifications for:
- Failed workflow runs
- Security vulnerabilities detected
- Deployment completions (if configured)

---

## 🔧 Customization

### Modify Workflow Triggers

Edit the `on:` section in workflow files:

```yaml
on:
  pull_request:
    branches: [main, develop]  # Add/remove branches
  push:
    branches: [main]           # Add/remove branches
  schedule:
    - cron: '0 9 * * 1'       # Change schedule
```

### Add More Jobs

Add new jobs to workflows:

```yaml
jobs:
  new-job:
    name: New Job Name
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      # Add more steps...
```

### Adjust Timeouts

Change timeout for long-running jobs:

```yaml
jobs:
  e2e-smoke:
    name: E2E Smoke Tests
    timeout-minutes: 30  # Adjust as needed
```

---

## 🐛 Troubleshooting

### Workflow Fails on Dependency Installation

**Issue:** `npm ci` fails

**Solution:**
1. Check `package-lock.json` is committed
2. Ensure dependencies are compatible
3. Clear cache and retry

### Build Fails in CI but Works Locally

**Issue:** Build passes locally but fails in CI

**Solution:**
1. Check environment variables are set correctly
2. Verify Node.js version matches (v18)
3. Check for platform-specific code

### E2E Tests Fail

**Issue:** Playwright tests fail

**Solution:**
1. Check test database is set up correctly
2. Verify application starts properly
3. Increase timeout if tests are slow
4. Check test artifacts in workflow

### Security Scan Reports Issues

**Issue:** Security workflow finds vulnerabilities

**Solution:**
1. Run `npm audit` locally
2. Update vulnerable packages: `npm audit fix`
3. For unfixable issues, assess risk and document

---

## 📈 Best Practices

### 1. Keep Workflows Fast
- Use caching for dependencies
- Run expensive tests (E2E) only when needed
- Parallelize independent jobs

### 2. Fail Fast
- Run quick checks (lint, type-check) first
- Run expensive checks (E2E) after quick checks pass

### 3. Monitor Regularly
- Check workflow runs weekly
- Address failures promptly
- Keep dependencies updated

### 4. Security First
- Review security scan results
- Update dependencies regularly
- Never commit secrets

### 5. Test Before Merge
- Ensure all checks pass before merging PR
- Review test results in PR checks
- Fix failures before approval

---

## 🔗 Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](../VERCEL_DEPLOYMENT_GUIDE.md)
- [Production Troubleshooting](../PRODUCTION_TROUBLESHOOTING.md)
- [Security Best Practices](https://docs.github.com/en/code-security)

---

## 📝 Workflow Files

| File | Purpose | Trigger |
|------|---------|---------|
| `ci.yml` | Code quality checks | PR, Push |
| `security.yml` | Security scanning | PR, Push, Weekly |
| `e2e.yml` | End-to-end tests | PR, Push |
| `deploy.yml` | Deployment automation | Push to main, Manual |

---

## ✨ Status Badges

Add these to your README.md to show workflow status:

```markdown
[![CI](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/workflows/CI/badge.svg)](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/actions/workflows/ci.yml)
[![Security](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/workflows/Security%20Scan/badge.svg)](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/actions/workflows/security.yml)
[![Deploy](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/workflows/Deploy%20to%20Production/badge.svg)](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/actions/workflows/deploy.yml)
```

---

**Last Updated:** January 11, 2026  
**Maintained by:** GitHub Copilot
