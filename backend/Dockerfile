# Use a Node.js 18+ version as the base image for the backend
FROM node:18.17.1

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Use nodemon to restart the server automatically on file changes
CMD ["npx", "nodemon", "server.js"]
