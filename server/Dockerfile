FROM node:10.15.3-alpine as source
WORKDIR /src/tech-radar
COPY package.json ./
RUN yarn install
COPY ./src ./src
CMD ["yarn", "start"]