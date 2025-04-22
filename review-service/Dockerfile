# Use official Node image
FROM node:18

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port
EXPOSE 3000

# Start the app
CMD [ "npm", "run", "dev" ]
