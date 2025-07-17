# 1단계: Build
FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN if[ ! -d node_modules ]; then npm install; fi

COPY . .
COPY .env.local .env.local
RUN npm run build

# 2단계: Serve
FROM node:lts-alpine
WORKDIR /app

COPY --from=build /app ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]
