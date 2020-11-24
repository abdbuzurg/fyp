FROM node:12.18.2

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4000
CMD ["npm", "run", "migration:create"]
CMD ["node", "dist/index.js"]
USER node