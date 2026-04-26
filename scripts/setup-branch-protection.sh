#!/usr/bin/env bash
# =============================================================================
# Branch Protection Setup Script
# =============================================================================
# Sets up GitHub branch protection rules for the `main` branch.
# Requires: gh CLI with appropriate permissions.
#
# Usage:
#   chmod +x scripts/setup-branch-protection.sh
#   ./scripts/setup-branch-protection.sh
# =============================================================================

set -euo pipefail

BRANCH="main"
REPO="${1:-}"

if [ -z "$REPO" ]; then
  REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || "")
fi

if [ -z "$REPO" ]; then
  echo "Error: Could not determine repository. Run from repo directory or pass repo as argument."
  echo "Usage: $0 owner/repo"
  exit 1
fi

echo "Setting up branch protection for '$BRANCH' in '$REPO'..."
echo ""

# Enable branch protection with required status checks
gh api "repos/$REPO/branches/$BRANCH/protection" \
  --method PUT \
  --input - << 'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint, Types & Unit Tests",
      "Build Application",
      "Preview Deploy & Smoke Test",
      "E2E Tests (Playwright)",
      "Report PR Status"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_conversation_resolution": true
}
JSON

echo ""
echo "Branch protection for '$BRANCH' configured successfully!"
echo ""
echo "Summary:"
echo "  - Required status checks: lint, build, preview deploy, E2E tests"
echo "  - Required approving reviews: 1"
echo "  - Stale reviews dismissed on new commits"
echo "  - Conversation resolution required"
echo "  - Admin enforcement enabled"
