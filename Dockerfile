## Multi-stage Dockerfile for building and serving a Vite React app
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci --silent; elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --silent; else npm install --silent; fi

# Copy source and build
COPY . .
RUN npm run build

# Production stage: serve static files with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that Cloud Run expects (8080)
EXPOSE 8080

# Use the default nginx entrypoint; Cloud Run will map container port 8080
CMD ["nginx", "-g", "daemon off;"]
