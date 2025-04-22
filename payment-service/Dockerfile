FROM node:18

# Install Stripe CLI (updated with correct URL and verification)
RUN apt-get update && apt-get install -y wget && \
    wget -q -O stripe.tar.gz https://github.com/stripe/stripe-cli/releases/download/v1.17.1/stripe_1.17.1_linux_x86_64.tar.gz && \
    tar -xzf stripe.tar.gz && \
    mv stripe /usr/local/bin/ && \
    rm stripe.tar.gz && \
    stripe --version

WORKDIR /app

COPY package*.json ./
COPY .env . 
RUN npm install

COPY . .

# Create a startup script
RUN echo '#!/bin/sh\n\
npm start & \n\
stripe listen --forward-to localhost:5010/webhook/stripe --api-key $STRIPE_SECRET_KEY \n\
wait' > /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 5010

# Use the startup script
CMD ["/app/start.sh"]