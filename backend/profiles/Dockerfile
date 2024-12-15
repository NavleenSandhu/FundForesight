FROM openjdk:17.0.1-slim-buster

WORKDIR /app

COPY target/*.jar /app/

EXPOSE 7500

ENTRYPOINT ["java", "-jar", "/app/profiles-0.0.1-SNAPSHOT.jar"]