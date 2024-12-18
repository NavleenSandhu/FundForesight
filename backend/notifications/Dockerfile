FROM openjdk:17.0.1-slim-buster

WORKDIR /app

COPY target/*.jar /app/

EXPOSE 7200

ENTRYPOINT ["java", "-jar", "/app/notifications-0.0.1-SNAPSHOT.jar"]