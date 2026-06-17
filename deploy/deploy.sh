#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Clear screen
clear

echo "=================================================================="
echo "      Agentic Web App - One-Click Cloud Deployer"
echo "=================================================================="
echo "This script automates building and deploying the consolidated"
echo "single-container image to Google Cloud Run or AWS Fargate (ECS)."
echo "=================================================================="
echo ""

# Choose Cloud Provider
echo "Choose your target cloud provider:"
echo "  1) Google Cloud Run (Recommended)"
echo "  2) AWS Fargate (ECS)"
echo ""
read -p "Enter choice [1-2]: " PROVIDER_CHOICE

if [ "$PROVIDER_CHOICE" == "1" ]; then
    echo ""
    echo "--- Configuring Google Cloud Run Deployment ---"
    
    # Try to auto-detect current project
    DEFAULT_PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")
    if [ -n "$DEFAULT_PROJECT_ID" ]; then
        read -p "Enter Google Cloud Project ID [$DEFAULT_PROJECT_ID]: " PROJECT_ID
        PROJECT_ID=${PROJECT_ID:-$DEFAULT_PROJECT_ID}
    else
        read -p "Enter Google Cloud Project ID: " PROJECT_ID
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        echo "Error: Google Cloud Project ID is required."
        exit 1
    fi
    
    DEFAULT_SERVICE="agentic-web-app-antigravity"
    read -p "Enter Service Name [$DEFAULT_SERVICE]: " SERVICE_NAME
    SERVICE_NAME=${SERVICE_NAME:-$DEFAULT_SERVICE}
    
    DEFAULT_REGION="us-central1"
    read -p "Enter Region [$DEFAULT_REGION]: " REGION
    REGION=${REGION:-$DEFAULT_REGION}
    
    IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"
    
    echo ""
    echo "Configuration summary:"
    echo "  Project ID:   $PROJECT_ID"
    echo "  Service Name: $SERVICE_NAME"
    echo "  Region:       $REGION"
    echo "  Image Tag:    $IMAGE_TAG"
    echo ""
    read -p "Proceed with build and deploy? [y/N]: " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[yY]([eE][sS])?$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    echo ""
    echo "Step 1: Building image and pushing to Google Container Registry..."
    # Ensure we run this from root folder, we use -f to specify path to Dockerfile.single
    gcloud builds submit --tag "$IMAGE_TAG" --file deploy/Dockerfile.single .
    
    echo ""
    echo "Step 2: Deploying to Google Cloud Run..."
    gcloud run deploy "$SERVICE_NAME" \
      --image "$IMAGE_TAG" \
      --platform managed \
      --region "$REGION" \
      --allow-unauthenticated \
      --port 8080 \
      --set-env-vars SPRING_PROFILES_ACTIVE=prod
      
    echo ""
    echo "SUCCESS: Your service has been deployed to Google Cloud Run!"
    
elif [ "$PROVIDER_CHOICE" == "2" ]; then
    echo ""
    echo "--- Configuring AWS Fargate (ECS) Deployment ---"
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        echo "Error: AWS CLI is not installed. Please install it to deploy to AWS."
        exit 1
    fi
    
    # Try to auto-detect AWS Account ID
    echo "Retrieving AWS account details..."
    DEFAULT_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
    if [ -n "$DEFAULT_ACCOUNT_ID" ]; then
        read -p "Enter AWS Account ID [$DEFAULT_ACCOUNT_ID]: " ACCOUNT_ID
        ACCOUNT_ID=${ACCOUNT_ID:-$DEFAULT_ACCOUNT_ID}
    else
        read -p "Enter AWS Account ID: " ACCOUNT_ID
    fi
    
    if [ -z "$ACCOUNT_ID" ]; then
        echo "Error: AWS Account ID is required."
        exit 1
    fi
    
    DEFAULT_REGION=$(aws configure get region 2>/dev/null || echo "us-east-1")
    read -p "Enter AWS Region [$DEFAULT_REGION]: " REGION
    REGION=${REGION:-$DEFAULT_REGION}
    
    DEFAULT_REPO="agentic-web-app-antigravity"
    read -p "Enter ECR Repository Name [$DEFAULT_REPO]: " REPO_NAME
    REPO_NAME=${REPO_NAME:-$DEFAULT_REPO}
    
    ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
    IMAGE_TAG="$ECR_URL/$REPO_NAME:latest"
    
    echo ""
    echo "Configuration summary:"
    echo "  Account ID:   $ACCOUNT_ID"
    echo "  Region:       $REGION"
    echo "  ECR Repo:     $REPO_NAME"
    echo "  Image Tag:    $IMAGE_TAG"
    echo ""
    read -p "Proceed with build and deploy? [y/N]: " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[yY]([eE][sS])?$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    echo ""
    echo "Step 1: Creating ECR repository if it does not exist..."
    aws ecr create-repository --repository-name "$REPO_NAME" --region "$REGION" || echo "ECR Repository already exists."
    
    echo ""
    echo "Step 2: Authenticating Docker with ECR..."
    aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ECR_URL"
    
    echo ""
    echo "Step 3: Building docker image locally using Dockerfile.single..."
    docker build -f deploy/Dockerfile.single -t "$REPO_NAME" .
    
    echo ""
    echo "Step 4: Tagging and pushing image to ECR..."
    docker tag "$REPO_NAME:latest" "$IMAGE_TAG"
    docker push "$IMAGE_TAG"
    
    echo ""
    echo "Step 5: AWS ECR push complete!"
    echo "You can now reference the image '$IMAGE_TAG' in your ECS Task Definition."
    echo "For Fargate deployment steps via ECS CLI or AWS Console, refer to deploy/DEPLOYMENT.md."
    echo ""
    
else
    echo "Invalid choice. Exiting."
    exit 1
fi
