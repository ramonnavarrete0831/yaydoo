FROM node:12.13.0-alpine

RUN apk update && apk add build-base git python &&  npm config set scripts-prepend-node-path true && npm install -g @nestjs/cli

WORKDIR /app-api

COPY . /app-api/

RUN yarn install --production
RUN npm run build

EXPOSE 8080
ENV PORT 8080
ENV NODE_ENV production

CMD ["yarn", "start:prod", "tsc"]
