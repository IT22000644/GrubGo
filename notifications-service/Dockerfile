FROM node:alpine3.21
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . /app
CMD ["npm", "start"]

