# Stage 1: Build the Angular application
FROM node:16 as build
WORKDIR /app
COPY campfire-ui/package*.json ./
RUN npm install
COPY campfire-ui/ .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/campfire-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
