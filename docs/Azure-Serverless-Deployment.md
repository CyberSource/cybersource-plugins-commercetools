# Serverless Deployment

Serverless deployment is one of the latest trends in cloud technologies. It is a development model built for creating and running applications without need for server management. They are provisioned, maintained and scaled by a third-party cloud provider, while the developers just write and deploy the code.

## Azure Function

Azure Function is a serverless solution that allows you to write less code, maintain less infrastructure and save on costs. Instead of worrying about deploying and maintaining servers, Azure provides all the up-to-date resources needed to keep your applications running.

## Pre-Requisites

Here is a list of everything you need to have before proceeding with deployment:

- Active Azure account
- Active Azure subscription
- Azure CLI version 2.4 or later
- Node and npm

## Azure Deployment Steps

1.  Navigate to the root directory and run the following command to include the npm dependencies

         npm install

> **_NOTE:_** This is not necessary if the dependencies are already available in <b>node_modules</b> repository

2.  Populate .env file with the required data by referring to the values from [API-Extension-Setup](API-Extension-Setup.md#configuration)

3.  Run the following command

         npm run zip-function

    Once the above command is successfully executed, it will create a zip file name as `ctExtension.zip`. This file will be used for zip deployment.

4.  To deploy a service, run below commands in the root directory of extension

    1.  Run the below command and login with your Azure account credential.

             az login

    2.  Create Resource Group by entering below command.

             az group create --name <Resource_Group_Name> --location <Location_Name>

        `Resource_Group_Name` is the name of the resource group and `Location_Name` is the Azure region.

    3.  Create Storage Account by entering below command. Provide `Resource_Group_Name` and `Location_Name` used in above step.

             az storage account create --name <Globally_Unique_Storage_Account_Name> --location "<Location_Name>" --resource-group <Resource_Group_Name>

    4.  Create Storage Container by entering below command. This container will be useful for storing log files. Use `Globally_Unique_Storage_Account_Name` created in above step.

             az storage container create -n <Storage_Container_Name> --account-name <Globally_Unique_Storage_Account_Name>

    5.  Create a function app by entering below command. Use `Resource_Group_Name`, `Location_Name` & `Globally_Unique_Storage_Account_Name` created in above steps.

             az functionapp create --resource-group <Resource_Group_Name> --consumption-plan-location <Location_Name> --runtime node --functions-version 4 --name <Globally_Unique_Function_App_Name> --storage-account <Globally_Unique_Storage_Account_Name>

    6.  Deploy your zip file to the function app, by entering below command. Use `Resource_Group_Name` and `Globally_Unique_Function_App_Name` created in above commands.

             az functionapp deployment source config-zip -g <Resource_Group_Name> -n <Globally_Unique_Function_App_Name> --src ctPlugin.zip

Your application is now available at `https://<Globally_Unique_Function_App_Name>.azurewebsites.net`

## Loggers in Azure

- Login to the Azure Portal
- Navigate to the Created `Storage Account` -> `Containers` and choose the container which was created earlier.
- To provide permission for storing log file, navigate to `Settings` -> `Shared Access Tokens`, choose `Read`, `Add`, `Create` and `Write` from the `Permissions` drop down and choose Date and Time for `Start` and `Expiry` and click on `Generate SAS token and URL`.

  **_NOTE:_** Generated token will be valid for the specific interval as mentioned in `Start` and `Expiry` field.

- Provide the above generated URL for `AZURE_CONTAINER_URL` environment variable.
- Log files will be stored under `Storage Account` -> `Containers`. To see content of log files, click on the file name and `Download` button.

## Modifying Environment Variables

- To add an environment variable, navigate to your Function app.
- Go to `Settings`-> `Configuration`, click on `New application setting` and enter Name and Value of the environment value and enable `Deployment slot setting`.
- Click on `OK` and `Save` button.
- You can edit your environment variable by following same path and click on the variable name and modify the value, click on `OK` and `Save` button to save your changes.
