FROM node:15-alpine

WORKDIR /usr/app
EXPOSE 3000

COPY . .
RUN yarn install

CMD ["yarn", "start" ]