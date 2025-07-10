# Stage 1: Build Angular app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Build the app
RUN npx ng build --configuration=production
# Using `npx` avoids needing global Angular CLI install

# Stage 2: Serve with NGINX
FROM nginx:alpine

COPY --from=builder /app/dist/kyc/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
