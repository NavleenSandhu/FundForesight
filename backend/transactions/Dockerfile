FROM openjdk:17.0.1-slim-buster

WORKDIR /app

COPY target/*.jar /app/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/transactions-service-0.0.1-SNAPSHOT.jar"]