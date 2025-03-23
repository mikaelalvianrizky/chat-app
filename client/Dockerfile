# Build stage
FROM node:16-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the client code
COPY . .

# Build the React app (assuming you're using Create React App)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output to the Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
