# Cloud Deployment Guide: Google Cloud Run & AWS Fargate

This guide outlines how to deploy the React + Spring Boot application to **Google Cloud Run** and **AWS Fargate** using both CLI-based automation and the web-based cloud consoles.

---

## Deployment Architectures

You have two choices for deployability:

### 1. Consolidated Deployment (Single Container) - **[RECOMMENDED]**
*   **How it works**: We package both the React frontend and Spring Boot backend into a single container (`deploy/Dockerfile.single`). The compiled frontend static assets are placed inside Spring Boot's `src/main/resources/static/` folder. When the backend runs, it automatically serves the React SPA at the root URL (`/`) and handles API endpoints at `/api/...`.
*   **Why choose this**:
    *   **Cost**: You only pay for one service running a single container.
    *   **Simplicity**: No need to configure cross-origin resource sharing (CORS), DNS configurations, or API routes. Everything is served from a single host on port `8080`.
    *   **Ideal for**: Google Cloud Run, AWS Fargate, Azure Container Instances.

### 2. Decoupled Deployment (Multi-Container)
*   **How it works**: The React frontend and Spring Boot backend run as two separate containers.
    *   **Frontend Container (`deploy/Dockerfile.frontend`)**: Nginx serves the React SPA and acts as a reverse proxy, forwarding all `/api/...` requests to the backend container.
    *   **Backend Container (`deploy/Dockerfile.backend`)**: Spring Boot serves the API.
*   **Why choose this**: Scalability (scaling frontend and backend independently).
*   **Ideal for**: Kubernetes (EKS, GKE), ECS (with multiple tasks).

---

## CLI-Based One-Click Deployment

We provide an interactive deployment script to automate building and pushing your container.
Run this from the project root:
```bash
make deploy
```
This script will:
1. Ask you to choose **Google Cloud Run** or **AWS Fargate**.
2. Automatically pull configuration defaults (Project ID, AWS Account, region, etc.).
3. Build the single-container image and upload it to your cloud registry.
4. (For Cloud Run) Automatically deploy the service live.

---

## Guide 1: Google Cloud Run

### Option A: Web Console UI (No-Brainer Step-by-Step)
Use this if you prefer clicking through the Google Cloud Web Console.

1.  **Build and Push your Image**:
    First, build and submit the image to Artifact Registry so Cloud Run can access it:
    ```bash
    gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/agentic-app:latest --file deploy/Dockerfile.single .
    ```
2.  **Open the Google Cloud Console**:
    Navigate to the [Cloud Run Console](https://console.cloud.google.com/run).
3.  **Create Service**:
    *   Click the **Create Service** button at the top.
4.  **Configure Container Image**:
    *   Select **Deploy one revision from an existing container image**.
    *   Click **Select** and navigate through your Artifact Registry to select `gcr.io/[YOUR_PROJECT_ID]/agentic-app:latest`.
5.  **Configure Deployment settings**:
    *   **Service Name**: Input `agentic-web-app`.
    *   **Region**: Choose your closest region (e.g., `us-central1`).
    *   **CPU allocation**: Select **CPU is only allocated during request processing** (cost-saving).
    *   **Scaling**: Set minimum instances to `0` (scales to zero when inactive to avoid charges) and maximum instances to `5`.
6.  **Configure Connectivity & Authentication**:
    *   **Ingress Control**: Select **All** (allows traffic from the public internet).
    *   **Authentication**: Select **Allow unauthenticated invocations** (so anyone can view your web dashboard).
7.  **Container Port & Environments (Critical)**:
    *   Click to expand **Container, Volumes, Networking, Security**.
    *   Under **Container**, set **Container Port** to `8080` (Spring Boot default).
    *   Scroll down to **Variables & Secrets** and click **Add Variable**:
        *   **Name**: `SPRING_PROFILES_ACTIVE`
        *   **Value**: `prod`
8.  **Deploy**:
    *   Click **Create** at the bottom.
    *   Within 1–2 minutes, Cloud Run will display a green checkmark and provide a public URL (e.g. `https://agentic-web-app-xxx.a.run.app`). Click it to view your live app!

### Option B: CLI Deployment
```bash
gcloud run deploy agentic-web-app \
  --image gcr.io/[YOUR_PROJECT_ID]/agentic-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars SPRING_PROFILES_ACTIVE=prod
```

---

## Guide 2: AWS Fargate (ECS)

### Option A: AWS Web Console UI (No-Brainer Step-by-Step)
Use this to configure Amazon ECS Fargate via the AWS Web Console.

1.  **Build and Push to ECR**:
    Use `make deploy` (Option 2) to build the image and push it to your AWS Elastic Container Registry (ECR). Note down the resulting Image URI (e.g. `[AWS_ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/agentic-web-app-antigravity:latest`).
2.  **Open the ECS Console**:
    Navigate to the [Amazon ECS Console](https://console.aws.amazon.com/ecs).
3.  **Create an ECS Cluster**:
    *   In the sidebar, click **Clusters**, then click **Create cluster**.
    *   **Cluster Name**: `agentic-cluster`.
    *   **Infrastructure**: Select **AWS Fargate** (Serverless).
    *   Click **Create**.
4.  **Create a Task Definition (The Blueprint)**:
    *   In the sidebar, click **Task definitions**, then click **Create new task definition** -> **Create new task definition**.
    *   **Task definition family name**: `agentic-task`.
    *   **Launch type**: Select **AWS Fargate**.
    *   **Operating system/Architecture**: `Linux/X86_64`.
    *   **Task size**:
        *   **CPU**: `0.5 vCPU`
        *   **Memory**: `1 GB`
    *   **Container details**:
        *   **Name**: `agentic-container`
        *   **Image URI**: Paste your ECR Image URI from Step 1.
        *   **Essential container**: Yes.
        *   **Port mappings**: Set **Container port** to `8080`, **Protocol** to `TCP`, **Port name** to `http`.
    *   **Environment variables**:
        *   Scroll to **Environment variables** inside the container definition.
        *   Add Key: `SPRING_PROFILES_ACTIVE`, Value: `prod`.
    *   Click **Create** at the bottom.
5.  **Deploy Task as a Service (Run it)**:
    *   Go back to **Clusters** and click on your `agentic-cluster`.
    *   Under the **Services** tab, click **Deploy**.
    *   **Deployment configuration**:
        *   **Application type**: Service.
        *   **Task definition family**: Select `agentic-task`.
        *   **Revision**: Select `LATEST`.
        *   **Service name**: `agentic-service`.
        *   **Desired tasks**: `1`.
    *   **Networking**:
        *   Select your VPC and Subnets.
        *   **Security group**: Click edit/create new. Make sure it has an Inbound Rule allowing **Custom TCP on Port 8080** from `0.0.0.0/0` (public access).
        *   **Public IP**: Ensure it is turned **ON** (so you can connect to it).
    *   Click **Deploy**.
6.  **Access your application**:
    *   Once the service status turns to `ACTIVE` and the task status is `RUNNING`, click the **Tasks** tab inside your service.
    *   Click on the running task ID.
    *   Copy the **Public IP** under the Configuration section.
    *   Open `http://[TASK_PUBLIC_IP]:8080` in your browser to view your live app.

### Option B: CLI Deployment
Refer to the `deploy/deploy.sh` script output or run ECS CLI commands to update your service:
```bash
aws ecs update-service --cluster agentic-cluster --service agentic-service --force-new-deployment
```

---

## Guide 3: Local Orchestration (Testing Multi-Container)

To run the decoupled (multi-container) setup locally via Docker to verify the reverse proxy and independent service communication:

1.  From the project root, navigate to the `deploy/` directory:
    ```bash
    cd deploy
    ```
2.  Start the containers:
    ```bash
    docker compose up --build
    ```
3.  Access the applications:
    *   **Frontend (with API Proxying via Nginx)**: [http://localhost:3000](http://localhost:3000)
    *   **Backend (Direct REST API access)**: [http://localhost:8080](http://localhost:8080)
