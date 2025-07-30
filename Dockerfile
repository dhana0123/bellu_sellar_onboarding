# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./


# Set NODE_ENV environment variable
ENV NODE_ENV=production


# Install dependencies
RUN npm install --production

# Build the app
RUN npm run build

# Copy the rest of the application code
COPY . .

# Expose the port your server runs on (default: 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "start"]
