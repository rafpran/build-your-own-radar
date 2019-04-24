FROM node:10.15.3-alpine as source
WORKDIR /src/tech-radar
COPY package.json ./
RUN yarn install
COPY ./src ./src
RUN yarn build

FROM nginx:1.15.12-alpine
WORKDIR /opt/tech-radar
COPY --from=source /src/tech-radar/dist .
COPY default.template /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]