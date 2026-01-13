# GitHub Actions Workflow Setup Guide

This document provides instructions for setting up and configuring the GitHub Actions workflows for this repository.

## Current Status

### ✅ Working Locally
All CI checks pass successfully when run locally:
- **Linting**: `npm run lint` ✅
- **Type Checking**: `npm run type-check` ✅
- **Unit Tests**: `npm test` ✅ (10/10 test suites passing)
- **Build**: `npm run build` ✅

### ⚠️ Requires Configuration

#### 1. Enable Code Scanning in Repository Settings

The Security Scan workflow requires GitHub Code Scanning to be enabled.

**Steps to Enable:**
1. Go to repository Settings
2. Navigate to "Security" → "Code security and analysis"
3. Find "Code scanning" section
4. Click "Set up" next to "CodeQL analysis"
5. Choose "Default" or "Advanced" setup
6. If choosing Advanced, use the existing `.github/workflows/security.yml` file

**Alternative:** If Code Scanning cannot be enabled (due to plan limitations), you can:
- Remove or disable the CodeQL job in `.github/workflows/security.yml`
- Keep the dependency audit and secret scanning jobs which don't require Code Scanning

#### 2. Workflow Permissions

Ensure workflows have the necessary permissions:

1. Go to repository Settings
2. Navigate to "Actions" → "General"
3. Under "Workflow permissions", select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save changes

#### 3. Required Secrets

No additional secrets are required for the current workflows. All environment variables are configured within the workflow files.

## Workflow Files

### 1. CI Workflow (`.github/workflows/ci.yml`)
**Status**: ✅ Ready to run

Runs on every push and pull request to main/master/develop branches:
- Linting with ESLint
- TypeScript type checking  
- Unit tests with Jest
- Build verification

**No additional configuration needed.**

### 2. Security Scan Workflow (`.github/workflows/security.yml`)
**Status**: ⚠️ Needs Code Scanning enabled

Runs on pull requests, pushes, and weekly schedule:
- npm dependency audit
- CodeQL static analysis (requires Code Scanning)
- TruffleHog secret scanning

**Action needed**: Enable Code Scanning (see above) or disable CodeQL job.

### 3. E2E Tests Workflow (`.github/workflows/e2e.yml`)
**Status**: ✅ Ready to run

Runs Playwright end-to-end tests with a PostgreSQL database:
- Sets up test database
- Runs smoke tests
- Uploads test results as artifacts

**No additional configuration needed.**

### 4. Deploy Workflow (`.github/workflows/deploy.yml`)
**Status**: ✅ Working

Handles Vercel deployment on pushes to main branch.

**No additional configuration needed.**

## Testing Workflows Locally

### Prerequisites
```bash
npm ci
npm run db:generate
```

### Run Individual Checks
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Unit tests
npm test

# Build
npm run build

# E2E tests (requires database)
npm run e2e:smoke
```

## Troubleshooting

### Code Scanning Error
**Error**: "Code scanning is not enabled for this repository"

**Solution**: Follow steps in "Enable Code Scanning" section above, or disable the CodeQL job by commenting it out in `.github/workflows/security.yml`:

```yaml
# Comment out or remove this section if Code Scanning cannot be enabled
# codeql-analysis:
#   name: CodeQL Analysis
#   ...
```

### Workflow Approval Required
**Issue**: Workflows show "action_required" status

**Solution**: This may happen on first run. Approve workflows in the Actions tab:
1. Go to Actions tab
2. Click on the workflow run
3. Click "Approve and run" if prompted

### E2E Test Failures
If E2E tests fail:
1. Ensure Playwright browsers are installed: `npx playwright install --with-deps chromium`
2. Check database connection in workflow logs
3. Review test artifacts uploaded by the workflow

## Maintenance

### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Re-run security audit
npm audit
```

### Workflow Schedule
- **Security Scan**: Runs weekly on Mondays at 9 AM UTC
- **Deploy**: Runs automatically on pushes to main branch
- **CI & E2E**: Run on all pushes and pull requests

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Vercel Deployment](https://vercel.com/docs)
- [Playwright Documentation](https://playwright.dev/)
