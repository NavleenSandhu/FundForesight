FROM openjdk:17.0.1-slim-buster

WORKDIR /app

COPY target/*.jar /app/

EXPOSE 7000

ENTRYPOINT ["java", "-jar", "/app/savings-0.0.1-SNAPSHOT.jar"]