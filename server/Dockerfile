FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/app.js"]
