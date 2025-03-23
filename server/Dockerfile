# Use Node.js v18 (which satisfies Prisma's requirement)
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port your app listens on (adjust if necessary)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
