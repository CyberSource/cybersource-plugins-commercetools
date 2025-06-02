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

    4.  Create a function app by entering below command. Use `Resource_Group_Name`, `Location_Name` & `Globally_Unique_Storage_Account_Name` created in above steps.

             az functionapp create --resource-group <Resource_Group_Name> --consumption-plan-location <Location_Name> --runtime node --functions-version 4 --name <Globally_Unique_Function_App_Name> --storage-account <Globally_Unique_Storage_Account_Name>

    5.  Deploy your zip file to the function app, by entering below command. Use `Resource_Group_Name` and `Globally_Unique_Function_App_Name` created in above commands.

             az functionapp deployment source config-zip -g <Resource_Group_Name> -n <Globally_Unique_Function_App_Name> --src ctExtension.zip

Your application is now available at `https://<Globally_Unique_Function_App_Name>.azurewebsites.net`

## Loggers in Azure

- In order to see the extension logs in Cloudwatch, console.log statement can be added inside the `logData` function in PaymentUtils.ts file for general logs, and inside the `logError` method in ErrorHandler.ts file for Error logs. The logs can be found in your Azure Function, under `Monitoring` --> `Log Stream`
> **_NOTE:_** Logs displayed here will not be stored permanently

## Modifying Environment Variables

- To add an environment variable, navigate to your Function app.
- Go to `Settings`-> `Configuration`, click on `New application setting` and enter Name and Value of the environment value and enable `Deployment slot setting`.
- Click on `OK` and `Save` button.
- You can edit your environment variable by following same path and click on the variable name and modify the value, click on `OK` and `Save` button to save your changes.