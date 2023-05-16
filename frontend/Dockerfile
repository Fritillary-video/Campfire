# Stage 1: Build the application
FROM node:14.17.0 AS build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve the application with the Angular development server
FROM node:14.17.0 AS production-stage
WORKDIR /app
COPY --from=build-stage /app/dist/campfire-ui .
EXPOSE 4200
CMD ["npm", "start"]
