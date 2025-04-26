# Use official Node image
FROM node:alpine3.21

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .


# Start the app
CMD [ "npm", "start" ]
