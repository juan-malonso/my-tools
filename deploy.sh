#!/bin/bash

# Exit immediately if a command fails
set -e

# --- Color Palette ---
BANNER='\033[1;33m'  # Yellow Bold
HEADER='\033[1;36m'  # Cyan Bold
KEY='\033[0;97m'     # White
VALUE_BLUE='\033[1;34m' # Blue Bold
INPUT_L='\033[0;97m' # White
INPUT_R='\033[0;90m' # Grey
WARN='\033[1;33m'    # Yellow Bold
ERROR='\033[1;31m'   # Red Bold
NC='\033[0m'         # No Color

# Initial variables
WORKER_NAME=""
ENV=""
CHANGE=""

# Function to display usage
usage() {
  echo -e "${WARN}Usage: $0 [-n <name>] [-e <env>] [-c <change>]${NC}"
  echo "  -n: Worker name (Required)"
  echo "  -e: Environment (dev|stg|uat|pro) [default: dev]"
  echo "  -c: Change type (major|minor|patch|skip) [default: patch]"
  exit 1
}

echo -e "${BANNER}==============================================="
echo -e "       WORKER DEPLOYMENT AUTOMATION"
echo -e "===============================================${NC}"

# 1. Parse flags
echo -e "\n${HEADER}>> STEP 1: PARSING ARGUMENTS${NC}"
while getopts "n:e:c:h" opt; do
  case ${opt} in
    n ) WORKER_NAME=$OPTARG; echo -e "${KEY}   Worker Name:${VALUE_BLUE} $WORKER_NAME${NC}" ;;
    e ) ENV=$OPTARG; echo -e "${KEY}   Environment:${VALUE_BLUE} $ENV${NC}" ;;
    c ) CHANGE=$OPTARG; echo -e "${KEY}   Change Type:${VALUE_BLUE} $CHANGE${NC}" ;;
    h ) usage ;;
    \? ) usage ;;
  esac
done

# 2. Validate and prompt for missing inputs
echo -e "\n${HEADER}>> STEP 2: CONFIGURATION & INPUTS${NC}"

# Name (Required)
if [ -z "$WORKER_NAME" ]; then
  echo -ne "${INPUT_L}Enter worker name${NC}: "
  read WORKER_NAME
  if [ -z "$WORKER_NAME" ]; then
    echo -e "${ERROR}Error: Worker name is mandatory.${NC}"
    exit 1
  fi
fi

# Env
if [ -z "$ENV" ]; then
  echo -ne "${INPUT_L}Select environment ${INPUT_R}(dev|stg|uat|pro) [dev]${INPUT_L}:${NC} "
  read ENV_INPUT
  ENV=${ENV_INPUT:-dev}
fi

# Validate Env
if [[ ! "$ENV" =~ ^(dev|stg|uat|pro)$ ]]; then
  echo -e "${ERROR}Error: Invalid environment ($ENV).${NC}"
  exit 1
fi

# Change
if [ -z "$CHANGE" ]; then
  echo -ne "${INPUT_L}Select change type ${INPUT_R}(major|minor|patch|skip) [patch]${INPUT_L}:${NC} "
  read CHANGE_INPUT
  CHANGE=${CHANGE_INPUT:-patch}
fi

# Validate Change
if [[ ! "$CHANGE" =~ ^(major|minor|patch|skip)$ ]]; then
  echo -e "${ERROR}Error: Invalid change type ($CHANGE).${NC}"
  exit 1
fi

echo -e "\n${BANNER}--- DEPLOYMENT SUMMARY ---${NC}"
echo -e "${KEY}Worker:    ${VALUE_BLUE}$WORKER_NAME${NC}"
echo -e "${KEY}Env:       ${VALUE_BLUE}$ENV${NC}"
echo -e "${KEY}Change:    ${VALUE_BLUE}$CHANGE${NC}"
echo -e "${KEY}Location:  ${VALUE_BLUE}$(pwd)${NC}"
echo -e "${BANNER}--------------------------${NC}"

# 3. Versioning and Commit
echo -e "\n${HEADER}>> STEP 3: VERSION CONTROL${NC}"
if [ "$CHANGE" != "skip" ]; then
  echo -e "${WARN}Bumping version... ($CHANGE)${NC}"
  npm --no-git-tag-version version $CHANGE
  
  VERSION=$(node -p "require('./package.json').version")
  
  echo -e "${WARN}Pushing updates to origin...${NC}"
  git add package.json
  [ -f "yarn.lock" ] && git add yarn.lock
  [ -f "package-lock.json" ] && git add package-lock.json
  
  git commit -m "chore($WORKER_NAME): bump version to $VERSION"
  git push origin HEAD
else
  echo -e "${WARN}Skipping version update...${NC}"
  VERSION=$(node -p "require('./package.json').version")
fi

# 4. Tagging
echo -e "\n${HEADER}>> STEP 4: RELEASING TAG${NC}"
TAG_NAME="release/$WORKER_NAME/$ENV/$VERSION"

echo -e "${KEY}Tag Name: ${VALUE_BLUE}$TAG_NAME${NC}"
if git ls-remote --tags origin | grep -q "refs/tags/$TAG_NAME"; then
  echo -e "${ERROR}Error: Tag $TAG_NAME already exists on remote.${NC}"
  exit 1
fi

git tag "$TAG_NAME"
git push origin "$TAG_NAME"

# 5. Deployment
echo -e "\n${HEADER}>> STEP 5: DEPLOYMENT EXECUTION${NC}"
echo -e "${WARN}Initializing deployment for $WORKER_NAME ($ENV)...${NC}"

# --- ACTUAL DEPLOY COMMAND ---
# Replace the echo below with your actual command:
# npx wrangler deploy --env $ENV
echo -e "${VALUE_BLUE}Successfully triggered deployment script!${NC}"
sleep 1.5

echo -e "\n${BANNER}==============================================="
echo -e "     DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo -e "===============================================${NC}\n"