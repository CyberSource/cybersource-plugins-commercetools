# Serverless Deployment

Serverless deployment is one of the latest trends in cloud technologies. It is a development model built for creating and running applications without need for server management. They are provisioned, maintained and scaled by a third-party cloud provider, while the developers just write and deploy the code.

## Google Cloud Functions

Google Cloud Functions is a serverless compute platform provided by Google Cloud Platform (GCP). It allows users to run code in response to events without needing to provision or manage servers. This falls under the "Functions as a Service" (FaaS) model, where the focus is solely on writing and deploying code, with Google handling the underlying infrastructure.

## Pre-Requisites

Here is a list of everything you need to have before proceeding with deployment:

- Active Google Cloud account
- Active Google Cloud Project with Billing enabled.
- Google Cloud SDK 
- Node and npm

## GCP Deployment Steps

1.  Navigate to the root directory and run the following command to include the npm dependencies

         npm install

> **_NOTE:_** This is not necessary if the dependencies are already available in <b>node_modules</b> repository

2.  Populate .env file with the required data by referring to the values from [API-Extension-Setup](API-Extension-Setup.md#configuration)

3.  To deploy a service, run below commands in the root directory of extension

    1.  Run the below command and login with your Google Cloud account credential.

             gcloud auth login

    2.  Set the project ID by running the below command.

             gcloud config set project <your-project-id>

        `your-project-id` is the id of your project created in GCP console.
    
    3.  Enable required APIs for your project
 
             gcloud services enable cloudfunctions.googleapis.com

             gcloud services enable cloudbuild.googleapis.com
    
    4.  Run the below command to deploy your function app,

             gcloud functions deploy <Function_Name> --entry-point=handler --runtime=nodejs20 --trigger-http --region=<Region> --source=. --allow-unauthenticated

        `Function_Name` is the name of your cloud function(e.g., ctExtension).

        `Region` is the GCP region (e.g., us-east1)

        `allow-unauthenticated` flag is required to make your function publicly accessible.
    
    > **_NOTE:_** Populate the `PAYMENT_GATEWAY_GCP_FUNCTION_NAME` environment variable with your Cloud Function name. Since this value is used as a path prefix in the URL, the plugin requires the provided function name for validation.

Your application is now available at `https://<Globally_Unique_Function_App_Name>.cloudfunctions.net/<Function_Name>`

## Loggers in GCP

- In order to see the extension logs , console.log statement can be added inside the `logData` function in PaymentUtils.ts file for general logs, and inside the `logError` function in ErrorHandler.ts file for Error logs. The logs can then be viewed in GCP Cloud Run Functions → Your Function →  `Observability` -> `Logs`.

> **_NOTE:_** Cloud Logging stores logs for 30 days by default. For longer retention, configure log sinks or export to Cloud Storage.

## Modifying Environment Variables

- To add an environment variable, navigate to your Cloud Run Function app.
- Go to `Edit & Deploy new revision`-> `Variables & Secrets`, click on `Add Variable` and enter Name and Value of the environment variable.
- You can also paste a .env file into the name input field to populate environment variables in bulk.
- Click on `Deploy` button.
- You can edit your environment variable by following same path and click on the variable value and modify the value, click on `Deploy` button to save your changes.