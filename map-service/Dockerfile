
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Expose the port the app is running on
EXPOSE 5004

# Define the command to run your app
CMD ["npm", "start"]
