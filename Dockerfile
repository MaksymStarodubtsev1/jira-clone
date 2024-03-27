# Stage 1: Build the React app (assuming a 'client' directory)
FROM node:lts-slim AS frontend
WORKDIR /app
COPY ui/package*.json ./
RUN npm install
COPY ui/ .
RUN npm run build  # Replace with your build command for React app
CMD [ "npm", "run", "preview" ]

# Stage 2: Build the Node.js server (assuming a 'server' directory)
FROM node:lts-slim AS backend
WORKDIR /app
COPY server/package*.json ./
ENV PORT=${8001}
RUN npm install
COPY server/ .
RUN npm run build  # Replace with your build command for React app


# Stage 3: Combine frontend and backend into final image
FROM nginx:alpine
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY server/dist/src/index.js /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
