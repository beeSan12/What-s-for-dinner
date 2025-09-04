# frontend/Dockerfile

# 1. Base image
FROM node:20

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY . .

# 4. Install dependencies, build the app, and install serve globally
RUN npm install && npm run build && npm install -g serve --no-audit --progress=false
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]