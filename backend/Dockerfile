# backend/Dockerfile

FROM node:20-bullseye-slim
WORKDIR /app

# Installera bara det som behövs
COPY package*.json ./
RUN npm ci --omit=dev

# Kopiera in källkod (efter npm ci för cache)
COPY . .

# Säkert: gör script körbart
RUN chmod +x entrypoint.sh

# Viktigt: ingen EXPOSE krävs men skadar inte
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