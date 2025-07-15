# 1단계: Build stage
FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build # .next 폴더생성

# 2단계: Production stage
FROM node:lts-alpine
WORKDIR /app

COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "run", "dev"]
