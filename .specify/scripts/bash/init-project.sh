#!/bin/bash

# ============================================================================
# init-project.sh - Project Initialization Helper
# ============================================================================
# This script provides information about the current project setup or helps
# detect which framework is being used.
#
# Usage:
#   ./init-project.sh --detect          # Detect current framework
#   ./init-project.sh --json            # Output detection as JSON
#   ./init-project.sh --validate        # Validate project setup
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Find repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

# Parse arguments
JSON_OUTPUT=false
DETECT_MODE=false
VALIDATE_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --detect)
            DETECT_MODE=true
            shift
            ;;
        --validate)
            VALIDATE_MODE=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Function to detect framework from package.json
detect_framework() {
    local pkg_json="$REPO_ROOT/package.json"
    
    if [[ ! -f "$pkg_json" ]]; then
        echo "none"
        return
    fi
    
    # Check for Astro
    if grep -q '"astro"' "$pkg_json" 2>/dev/null; then
        echo "astro"
        return
    fi
    
    # Check for Vite + React
    if grep -q '"vite"' "$pkg_json" 2>/dev/null && grep -q '"react"' "$pkg_json" 2>/dev/null; then
        echo "vite-react"
        return
    fi
    
    # Check for just Vite
    if grep -q '"vite"' "$pkg_json" 2>/dev/null; then
        echo "vite"
        return
    fi
    
    echo "unknown"
}

# Function to check if a tool is configured
check_tool() {
    local tool=$1
    local config_file=$2
    
    if [[ -f "$REPO_ROOT/$config_file" ]]; then
        echo "true"
    else
        echo "false"
    fi
}

# Function to get project name
get_project_name() {
    local pkg_json="$REPO_ROOT/package.json"
    
    if [[ -f "$pkg_json" ]]; then
        grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' "$pkg_json" | sed 's/"name"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//' || echo "unknown"
    else
        basename "$REPO_ROOT"
    fi
}

# Function to validate project setup
validate_setup() {
    local framework=$(detect_framework)
    local issues=()
    local warnings=()
    
    # Check package.json exists
    if [[ ! -f "$REPO_ROOT/package.json" ]]; then
        issues+=("Missing package.json")
    fi
    
    # Check for PNPM
    if [[ ! -f "$REPO_ROOT/pnpm-lock.yaml" ]]; then
        if [[ -f "$REPO_ROOT/package-lock.json" ]]; then
            issues+=("Using npm instead of pnpm - migrate to pnpm")
        elif [[ -f "$REPO_ROOT/yarn.lock" ]]; then
            issues+=("Using yarn instead of pnpm - migrate to pnpm")
        else
            warnings+=("No lock file found - run 'pnpm install'")
        fi
    fi
    
    # Check for Biome
    if [[ ! -f "$REPO_ROOT/biome.json" ]]; then
        warnings+=("Missing biome.json - run 'pnpm biome init'")
    fi
    
    # Check for Vitest config
    if [[ ! -f "$REPO_ROOT/vitest.config.ts" ]] && [[ ! -f "$REPO_ROOT/vitest.config.js" ]]; then
        warnings+=("Missing vitest.config.ts")
    fi
    
    # Check for TypeScript
    if [[ ! -f "$REPO_ROOT/tsconfig.json" ]]; then
        issues+=("Missing tsconfig.json - TypeScript is required")
    fi
    
    # Check for Tailwind (globals.css or similar)
    local has_tailwind=false
    for css_file in "$REPO_ROOT/src/styles/globals.css" "$REPO_ROOT/src/globals.css" "$REPO_ROOT/src/index.css"; do
        if [[ -f "$css_file" ]] && grep -q "@import.*tailwindcss" "$css_file" 2>/dev/null; then
            has_tailwind=true
            break
        fi
    done
    
    if [[ "$has_tailwind" == "false" ]]; then
        warnings+=("Tailwind CSS v4 import not found in CSS files")
    fi
    
    # Output results
    if [[ "$JSON_OUTPUT" == "true" ]]; then
        local issues_json=$(printf '%s\n' "${issues[@]}" | jq -R . | jq -s .)
        local warnings_json=$(printf '%s\n' "${warnings[@]}" | jq -R . | jq -s .)
        
        echo "{"
        echo "  \"valid\": $([ ${#issues[@]} -eq 0 ] && echo 'true' || echo 'false'),"
        echo "  \"issues\": $issues_json,"
        echo "  \"warnings\": $warnings_json"
        echo "}"
    else
        echo ""
        if [[ ${#issues[@]} -eq 0 ]] && [[ ${#warnings[@]} -eq 0 ]]; then
            echo -e "${GREEN}✅ Project setup is valid!${NC}"
        else
            if [[ ${#issues[@]} -gt 0 ]]; then
                echo -e "${RED}❌ Issues found:${NC}"
                for issue in "${issues[@]}"; do
                    echo -e "   ${RED}•${NC} $issue"
                done
            fi
            
            if [[ ${#warnings[@]} -gt 0 ]]; then
                echo -e "${YELLOW}⚠️  Warnings:${NC}"
                for warning in "${warnings[@]}"; do
                    echo -e "   ${YELLOW}•${NC} $warning"
                done
            fi
        fi
        echo ""
    fi
}

# Main execution
if [[ "$VALIDATE_MODE" == "true" ]]; then
    validate_setup
    exit 0
fi

FRAMEWORK=$(detect_framework)
PROJECT_NAME=$(get_project_name)
HAS_BIOME=$(check_tool "biome" "biome.json")
HAS_VITEST=$(check_tool "vitest" "vitest.config.ts")
HAS_TAILWIND=$(check_tool "tailwind" "tailwind.config.js")

if [[ "$JSON_OUTPUT" == "true" ]]; then
    cat << EOF
{
  "REPO_ROOT": "$REPO_ROOT",
  "PROJECT_NAME": "$PROJECT_NAME",
  "FRAMEWORK": "$FRAMEWORK",
  "HAS_BIOME": $HAS_BIOME,
  "HAS_VITEST": $HAS_VITEST,
  "HAS_TAILWIND_CONFIG": $HAS_TAILWIND
}
EOF
else
    echo ""
    echo -e "${BLUE}Project Detection${NC}"
    echo "─────────────────────────────────────"
    echo -e "Root:       ${GREEN}$REPO_ROOT${NC}"
    echo -e "Name:       ${GREEN}$PROJECT_NAME${NC}"
    echo -e "Framework:  ${GREEN}$FRAMEWORK${NC}"
    echo ""
    echo -e "${BLUE}Tooling${NC}"
    echo "─────────────────────────────────────"
    echo -e "Biome:      $([ "$HAS_BIOME" == "true" ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}")"
    echo -e "Vitest:     $([ "$HAS_VITEST" == "true" ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}")"
    echo ""
fi

