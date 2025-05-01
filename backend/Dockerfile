# backend/Dockerfile

# 1. Base image
FROM node:20.6.0

# 2. Create app directory and copy files
WORKDIR /app

# 3. Copy the application code
COPY package*.json ./

# 4. Install dependencies for testing
RUN apt-get update && apt-get install -y netcat-openbsd && npm install -g newman

# 5. Install app dependencies
RUN npm install

# 6. Copy the rest of the application code
COPY . .

# 7. Build the application
RUN chmod +x entrypoint.sh
# CMD ["./entrypoint.sh"]
ENTRYPOINT ["bash", "./entrypoint.sh"]