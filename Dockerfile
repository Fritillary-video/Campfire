FROM node:14.17.0 AS frontend-build

WORKDIR /app

COPY frontend /app/campfire-ui
WORKDIR /app/campfire-ui

RUN npm install
RUN npm run build

FROM maven:3.8.1-openjdk-17 AS backend-build

WORKDIR /app

COPY . /app

RUN mvn clean install
RUN mvn package

EXPOSE 8080

CMD ["java", "-jar", "/app/backend/target/backend-0.0.1-SNAPSHOT.jar"]