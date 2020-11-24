FROM node:12.18.2

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4000
CMD ["node", "dist/index.js"]
USER node