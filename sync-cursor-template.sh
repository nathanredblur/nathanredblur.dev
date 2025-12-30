#!/bin/bash
# sync-cursor-template.sh

TEMPLATE_BRANCH="cursor-template"
FOLDERS=(".cursor" ".specify")
SCRIPT_NAME="sync-cursor-template.sh"
CURRENT_BRANCH=$(git branch --show-current)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to pull changes
pull_from_template() {
    echo -e "${YELLOW}Pulling changes from $TEMPLATE_BRANCH...${NC}"
    
    # First, sync the script itself
    if git ls-tree -r $TEMPLATE_BRANCH --name-only | grep -q "^$SCRIPT_NAME$"; then
        echo -e "${BLUE}Syncing script itself...${NC}"
        
        # Check if script has changes
        git show $TEMPLATE_BRANCH:$SCRIPT_NAME > /tmp/$SCRIPT_NAME.new 2>/dev/null
        
        if [ -f "$SCRIPT_NAME" ] && ! cmp -s "$SCRIPT_NAME" /tmp/$SCRIPT_NAME.new; then
            echo -e "${GREEN}✓ Script has updates, copying new version${NC}"
            git checkout $TEMPLATE_BRANCH -- $SCRIPT_NAME
            chmod +x $SCRIPT_NAME
            echo -e "${YELLOW}⚠ Script was updated! Please run it again.${NC}"
            rm /tmp/$SCRIPT_NAME.new
            exit 0
        else
            echo -e "${GREEN}✓ Script is up to date${NC}"
        fi
        rm -f /tmp/$SCRIPT_NAME.new
    fi
    
    # Then sync the folders
    for folder in "${FOLDERS[@]}"; do
        if git ls-tree -r $TEMPLATE_BRANCH --name-only | grep -q "^$folder/"; then
            echo -e "${GREEN}Copying $folder/${NC}"
            git checkout $TEMPLATE_BRANCH -- $folder/
        else
            echo -e "${YELLOW}$folder does not exist in $TEMPLATE_BRANCH${NC}"
        fi
    done
    
    echo -e "${GREEN}✓ Changes pulled from $TEMPLATE_BRANCH${NC}"
    echo -e "${YELLOW}Review changes and commit if necessary:${NC}"
    echo "  git status"
    echo "  git commit -m 'Update templates from $TEMPLATE_BRANCH'"
}

# Function to push changes
push_to_template() {
    echo -e "${YELLOW}Pushing changes to $TEMPLATE_BRANCH...${NC}"
    
    # Verify files exist
    files_exist=false
    for folder in "${FOLDERS[@]}"; do
        if [ -d "$folder" ]; then
            files_exist=true
            break
        fi
    done
    
    # Also check if script exists
    if [ -f "$SCRIPT_NAME" ]; then
        files_exist=true
    fi
    
    if [ "$files_exist" = false ]; then
        echo -e "${RED}Error: No folders or script found to sync${NC}"
        exit 1
    fi
    
    # Save current changes if there are modifications
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}Stashing current changes...${NC}"
        git stash push -m "Temporary stash for sync with $TEMPLATE_BRANCH"
        STASHED=true
    else
        STASHED=false
    fi
    
    # Switch to template branch
    git checkout $TEMPLATE_BRANCH
    
    # Copy script itself
    if [ -f "../$SCRIPT_NAME" ] || git ls-tree -r $CURRENT_BRANCH --name-only | grep -q "^$SCRIPT_NAME$"; then
        echo -e "${BLUE}Copying $SCRIPT_NAME from $CURRENT_BRANCH${NC}"
        git checkout $CURRENT_BRANCH -- $SCRIPT_NAME
    fi
    
    # Copy folders from original branch
    for folder in "${FOLDERS[@]}"; do
        if git ls-tree -r $CURRENT_BRANCH --name-only | grep -q "^$folder/"; then
            echo -e "${GREEN}Copying $folder/ from $CURRENT_BRANCH${NC}"
            git checkout $CURRENT_BRANCH -- $folder/
        fi
    done
    
    # Check if there are changes
    if git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}No new changes to push${NC}"
    else
        echo -e "${GREEN}Committing changes...${NC}"
        git add "${FOLDERS[@]}" "$SCRIPT_NAME" 2>/dev/null
        git commit -m "Update templates from $CURRENT_BRANCH"
        echo -e "${GREEN}✓ Changes pushed to $TEMPLATE_BRANCH${NC}"
        echo -e "${YELLOW}Don't forget to push:${NC}"
        echo "  git push origin $TEMPLATE_BRANCH"
    fi
    
    # Return to original branch
    git checkout $CURRENT_BRANCH
    
    # Restore stashed changes
    if [ "$STASHED" = true ]; then
        git stash pop
    fi
}

# Verify we're not on the template branch
if [ "$CURRENT_BRANCH" = "$TEMPLATE_BRANCH" ]; then
    echo -e "${RED}Error: Cannot run this script from $TEMPLATE_BRANCH branch${NC}"
    exit 1
fi

# Menu or argument
if [ "$1" = "push" ] || [ "$1" = "p" ]; then
    push_to_template
elif [ "$1" = "pull" ] || [ "$1" = "" ]; then
    pull_from_template
else
    echo -e "${YELLOW}What do you want to do?${NC}"
    echo "1) Pull changes from $TEMPLATE_BRANCH (pull) [default]"
    echo "2) Push changes to $TEMPLATE_BRANCH (push)"
    read -p "Select (1/2): " choice
    
    case $choice in
        2)
            push_to_template
            ;;
        1|"")
            pull_from_template
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            exit 1
            ;;
    esac
fi