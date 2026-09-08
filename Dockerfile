FROM node:20-alpine as BUILD_IMAGE
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:20-alpine as PRODUCTION_IMAGE
WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist /app/dist
EXPOSE 3000
COPY package.json .
COPY vite.config.ts .

RUN npm install typescript

CMD ["npm", "run", "preview"]
