# Use official Node.js image
FROM node:alpine3.21

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Run the app
CMD [ "npm", "start" ]
