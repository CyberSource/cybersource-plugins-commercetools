<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# Compiling, Testing and Running the Reference Application

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

The purpose of this guidance is to support the development or evaluation of the reference application.

# Compiling

The application can be compiled using the provided Gradle build by executing the following from within the reference directory:

``` console
./gradlew --init-script init-maven-local.gradle clean build
```

# Run Unit Tests

Unit tests will be run with the above command because the build tasks depends on the test task, however they can be explicitly executed by doing the following:

``` console
./gradlew --init-script init-maven-local.gradle test
```

# Run Integration Tests

> ⚠️ **Warning!** The integration test will depend on the correct configuration of commercetools access keys, data and CyberSource environment.

Integration tests can be run using the following Gradle task:

``` console
./gradlew --init-script init-maven-local.gradle integrationTest
```

# Run the Reference Application

The Reference Application can be run using the Spring Boot Gradle plugin as follows:

``` console
./gradlew --init-script init-maven-local.gradle bootRun

```

</div>

</div>

</div>

</div>