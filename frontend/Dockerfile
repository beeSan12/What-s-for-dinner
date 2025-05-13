# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY . .

RUN npm install && npm run build && npm install -g serve --no-audit --progress=false
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]