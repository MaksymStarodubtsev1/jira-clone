#!/bin/bash
FROM node:lts-alpine AS build

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json .

RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 8001

CMD node dist/src/index.js