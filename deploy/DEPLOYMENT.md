# Cloud Deployment Guide: Google Cloud Run & AWS Fargate

This guide outlines how to deploy the React + Spring Boot application to **Google Cloud Run** and **AWS Fargate** using the configurations in the `deploy/` directory.

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

## Guide 1: Google Cloud Run (Recommended & Simplest)

Google Cloud Run is a fully-managed serverless platform that runs containers directly.

### Step-by-Step (Single Container Deployment)

1.  **Prerequisites**:
    *   Install the [Google Cloud CLI](https://cloud.google.com/sdk/gcloud).
    *   Authenticate and set your active project:
        ```bash
        gcloud auth login
        gcloud config set project [YOUR_PROJECT_ID]
        ```

2.  **Submit & Build the Container in Cloud Build**:
    Run this command from the **root directory** of the project to build the single-container image using Google Cloud Build and store it in Artifact Registry:
    ```bash
    gcloud builds submit --config=deploy/cloudbuild.yaml --tag gcr.io/[YOUR_PROJECT_ID]/agentic-app:latest .
    ```
    *(Alternatively, if you haven't set up cloudbuild.yaml, you can build directly with Docker: `gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/agentic-app:latest --file deploy/Dockerfile.single .`)*

3.  **Deploy to Cloud Run**:
    Deploy the image:
    ```bash
    gcloud run deploy agentic-app \
      --image gcr.io/[YOUR_PROJECT_ID]/agentic-app:latest \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --port 8080 \
      --set-env-vars SPRING_PROFILES_ACTIVE=prod
    ```

4.  **Verification**:
    Cloud Run will output a service URL (e.g., `https://agentic-app-xyz.a.run.app`). Open this link in your browser.
    *   The frontend will render immediately.
    *   Frontend API calls to `/api/...` are processed by the same container. No CORS setup is needed.

---

## Guide 2: AWS Fargate (ECS)

AWS Fargate runs containers on Amazon ECS without managing servers.

### Step-by-Step (Single Container Deployment)

1.  **Prerequisites**:
    *   Install the [AWS CLI](https://aws.amazon.com/cli/) and configure credentials (`aws configure`).
    *   Create an ECR (Elastic Container Registry) Repository to store your image:
        ```bash
        aws ecr create-repository --repository-name agentic-app
        ```

2.  **Build and Push the Image**:
    Retrieve an authentication token and authenticate Docker:
    ```bash
    aws ecr get-login-password --region [YOUR_REGION] | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.[YOUR_REGION].amazonaws.com
    ```
    Build the single container image from the root directory:
    ```bash
    docker build -f deploy/Dockerfile.single -t agentic-app .
    ```
    Tag and push the image:
    ```bash
    docker tag agentic-app:latest [AWS_ACCOUNT_ID].dkr.ecr.[YOUR_REGION].amazonaws.com/agentic-app:latest
    docker push [AWS_ACCOUNT_ID].dkr.ecr.[YOUR_REGION].amazonaws.com/agentic-app:latest
    ```

3.  **Configure ECS Task Definition**:
    *   Create a Task Definition in the ECS Console.
    *   Set launch type to **FARGATE**.
    *   Add a container with image URL `[AWS_ACCOUNT_ID].dkr.ecr.[YOUR_REGION].amazonaws.com/agentic-app:latest`.
    *   Map Port **8080** (TCP).
    *   Add Environment Variable: `SPRING_PROFILES_ACTIVE=prod`.

4.  **Create ECS Service**:
    *   Deploy the Task Definition as a Service.
    *   Configure security groups to open port **8080** (or port **80** on an Application Load Balancer routed to container port **8080**).
    *   Once launched, access the task public IP or the ALB DNS name.

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
