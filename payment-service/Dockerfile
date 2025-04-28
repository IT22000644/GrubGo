FROM node:alpine3.21

# Install dependencies for Stripe CLI and bash
RUN apk update && apk add --no-cache wget tar bash

# Install Stripe CLI
RUN wget -qO- https://github.com/stripe/stripe-cli/releases/download/v1.17.1/stripe_1.17.1_linux_x86_64.tar.gz | tar xzv -C /usr/local/bin

# Verify Stripe CLI installation
RUN stripe --version

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Create the startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npm start & ' >> /app/start.sh && \
    echo 'stripe listen --forward-to localhost:4005/webhook/stripe --api-key $STRIPE_SECRET_KEY ' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh


# Use the startup script
CMD ["/app/start.sh"]
