# Deploying Extension as a Docker Image on Google Cloud Platform

Google Cloud Run is a fully managed serverless platform that enables developers to run containerized applications without managing infrastructure. Using Cloud Run, the Cybersource-Commercetools Extension can be deployed easily with automatic scaling. For this deployment, the docker image of the extension needs to be built and pushed to Google Artifact Registry.

## Pre-Requisites

1. Download and install the latest version of Docker Desktop.

2. Ensure you have an active Google Cloud Platform (GCP) account.

3. Download and install the latest version of Google Cloud SDK (gcloud CLI)

4. Active GCP project with billing enabled

5. Enable required APIs in your GCP project

## Enable Required APIs

Before deploying, ensure the following APIs are enabled in your GCP project:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Steps for running the docker image of extension in Google Cloud Run

### Step 1. Authentication and Project Setup

- Authenticate with your Google Cloud account:

   ```bash
   gcloud auth login
   ```

- Set your GCP project ID:

   ```bash
   gcloud config set project <PROJECT_ID>
   ```

   Replace `<PROJECT_ID>` with your actual GCP project ID.

- Configure Docker to use gcloud as a credential helper:

   ```bash
   gcloud auth configure-docker

### Step 2. Build the docker image using the following command

Leave the docker desktop as open/connected and navigate to the root directory of extension and run the following command to create docker image

        docker build -t <imageName> .

### Step 3. Push the image to GCP Artifact Registry

- Create an Artifact Registry repository:

   ```bash
   gcloud artifacts repositories create <REPOSITORY_NAME> --repository-format=docker --location=<REGION> --description="Cybersource Commercetools Extension Repository"
   ```

- Configure Docker authentication for Artifact Registry:

   ```bash
   gcloud auth configure-docker <REGION>-docker.pkg.dev
   ```

- Tag your image for Artifact Registry:

   ```bash
   docker tag <imageName> <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPOSITORY_NAME>/<imageName>
   ```

- Push the image to Artifact Registry:

   ```bash
   docker push <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPOSITORY_NAME>/<imageName>
   ```

### Step 4. Creation of Cloud Run Service

Cloud Run services are used to run and maintain your desired number of container instances simultaneously. A service automatically scales your containerized application based on incoming requests and provides a public HTTPS URL.

To create it, navigate to **Cloud Run** → **Create Service**

- Navigate to **Cloud Run** in Google Cloud Console

- Click **Create Service**(Deploy Container)

- Configure the service:

   - **Service name**: `<your-app-name>` (e.g., ctextension)

   - **Region**: Select your preferred region

   - **CPU allocation and pricing**: CPU is only allocated during request processing

   - **Ingress**: Allow all traffic

   - **Authentication**: Allow unauthenticated invocations

### Step 5: Container Configuration

Container configuration defines how your application runs, including the image source, resource allocation, and environment variables.

- Configure the container:

   - **Container image URL**: Enter your image URL from Artifact Registry

     -  `<REGION>-docker.pkg.dev/<PROJECT_ID>/<REPOSITORY_NAME>/<imageName>`

   - **Container port**: 8080

- Click **Container, Connections, Security** to expand advanced settings:

   - **Memory**: 512 MiB

   - **CPU**: 1

   - **Request timeout**: 300 seconds

   - **Maximum instances**: 100

   - **Minimum instances**: 0

### Step 6: Environment Variables Configuration

Environment variables are used to configure your application with the necessary Commercetools and Cybersource credentials.

- Click **Variables & Secrets** tab

- Click **Add Variable** for each environment variable:

   - Add all required environment variables (CT_PROJECT_KEY, CT_CLIENT_ID, etc.)
   - Set `CONFIG_PORT` to `8080`

**_NOTE:_** Make sure that the container port (8080) matches the port on which extension is running (as specified in `CONFIG_PORT` environment variable). Cloud Run automatically provides HTTPS and handles SSL termination.

- Click **Create** to deploy your service

### Step 6: Access Your Application

Once the deployment is complete, Cloud Run will provide a public HTTPS URL in the format:
`https://<service-name>-<hash>-<region>.a.run.app`

- Navigate to **Cloud Run** in Google Cloud Console

- Click on your service name

- Note the **URL** shown at the top of the service details page

- Your application will be available at this HTTPS URL


## Modification of Environment Variable

- Navigate to **Cloud Run** → Your service

- Click **Edit & Deploy New Revision**

- Go to **Variables & Secrets** tab

- Add, modify, or remove environment variables as needed

- Click **Deploy** to apply changes

**_NOTE:_** Updating environment variables will create a new revision and gradually shift traffic to it.

## Loggers

- In order to see the extension logs, console.log statement can be added inside the `logData` function in PaymentUtils.ts file for general logs, and inside the `logError` function in ErrorHandler.ts file for Error logs before you could create the image. Logs generated by extension can be found under **Operations** → **Logging** → **Logs Explorer**. Filter logs by resource type "Cloud Run Revision" and your service name

**_NOTE:_** For GCP Cloud Run deployments, always use port 8080 as the container port and ensure your container listens on this port. Make sure to set `CONFIG_PORT=8080` in your environment variables. Cloud Run automatically provides HTTPS URLs without additional configuration.