# Use official Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the proxy code
COPY . .

# Expose the proxy port
EXPOSE 8080

# Start the proxy server
CMD ["node", "index.js"]
