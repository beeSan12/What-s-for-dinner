# backend/Dockerfile

# 1. Base image
FROM node:20-bullseye-slim

# 2. Add environment variables and set working directory
ENV NODE_ENV=production
WORKDIR /app

# 3. Install curl to use in entrypoint.sh
RUN apt-get update && apt-get install -y curl

# 4. Copy only package.json and package-lock.json first to leverage Docker cache
COPY backend/package*.json ./

# 5. Install dependencies
RUN npm ci --omit=dev || npm install --omit=dev

# 6. Copy the rest of the backend code
COPY backend/. .

# 7. Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# 8. Use entrypoint to wait for MongoDB to be ready before starting the app
ENTRYPOINT ["bash", "./entrypoint.sh"]

# 9. Expose the port the app runs on
ENV PORT=8083
EXPOSE 8083

# 10. Start the application
CMD ["./entrypoint.sh"]
