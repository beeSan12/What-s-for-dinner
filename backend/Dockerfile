# backend/Dockerfile

FROM node:20-bullseye-slim
ENV NODE_ENV=production
WORKDIR /app

# Installera bara det som behövs
# COPY backend/package*.json ./
# RUN npm install --omit=dev

# Kopiera in källkod (efter npm ci för cache)
COPY . .

RUN npm install --omit=dev

RUN chmod +x entrypoint.sh

ENTRYPOINT ["bash", "./entrypoint.sh"]

# Lyssna på porten som Koyeb skickar in via env (fallback 8083)
ENV PORT=8083
EXPOSE 8083

CMD ["./entrypoint.sh"]

# # 1. Base image
# FROM node:20-bullseye-slim

# # 2. Create app directory and copy files
# WORKDIR /app

# # 3. Copy the application code
# COPY . .

# # 4. Install dependencies for testing
# # RUN apt-get update && apt-get install -y netcat-openbsd && npm install -g newman

# # 5. Install app dependencies
# RUN npm install

# # 6. Build the application
# RUN chmod +x entrypoint.sh
# CMD ["./entrypoint.sh"]
# # ENTRYPOINT ["bash", "./entrypoint.sh"]