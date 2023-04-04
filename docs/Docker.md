# Docker
Docker is an open platform for developing, shipping, and running applications. It enables you to separate your applications from your infrastructure so you can deliver software quickly.

By using Docker, image of Cybersource-Commercetools-Plugin can be created and run in various platforms wherever Docker is supported.

Before using it, make sure to install Docker Desktop in the respective system.

## Building the Docker image
  Navigate to the root directory of plugin and run the following command to build the Docker image
    
  **_Note_**: Make sure to remove `node_modules` folder if it exists before building the image and ensure that Docker is running.

     docker build -t <imagename> .
     Example: docker build -t sample .
  where `imagename` is the name of your choice

  
## Running the Docker image
 Once the Docker image is created successfully, you can run the image by setting env variables and port numbers.
 Use the following command to run the docker image 

     docker run -e <env variables> -p <hostport>:<containerport> -d <imagename>
     
     Example: docker run -e CT_PROJECT_KEY=xxx -e CT_CLIENT_ID=xxx -p 3505:3505 -d sample

    
  - `env variables` are the key value pairs present in env file, Refer
  [API-Extension-Setup](API-Extension-Setup.md#a-name"environmentproperties"aenvironment-properties) to set env variables and make sure that to maintain -e separately for every env variable setting.
  - `hostport` is the port number to use in host machine and `containerport` is the port to be used by the docker container. 
  - `imagename` is the name of the image that you built in the previous step

  **_Note_**: If you build the image along with env variables settings, then no need to specify the env variables while running docker image

## Running the Docker image in AWS
 To run the docker image in AWS, refer the following guide [Docker-Container-in-AWS](Docker-Container-in-AWS.md)


       