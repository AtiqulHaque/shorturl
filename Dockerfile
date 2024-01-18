FROM node:alpine

WORKDIR app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Install dependencies.
RUN ["npm", "ci"]

# Add the rest of the files needed
COPY index.js /app/index.js
COPY src /app/src/
