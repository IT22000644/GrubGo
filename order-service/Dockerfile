# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy .env into the image
COPY .env . 

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose the port your app listens on
EXPOSE 5000

# Run the app
CMD ["npm", "run", "start-all"]
