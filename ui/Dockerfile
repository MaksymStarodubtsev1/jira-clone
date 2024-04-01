#!/bin/bash

FROM node:lts-alpine AS build

WORKDIR /app

# Copy package and package-lock
COPY package.json ./

# Clean install dependencies based package-lock
# Note: We also install dev deps as typeScript may be needed
RUN npm install

# Copy files
# Use .dockerignore to avoid copying node_modules and others folders and files
COPY . .

RUN npm run build

FROM httpd:latest

COPY --from=build /app/dist /usr/local/apache2/htdocs/