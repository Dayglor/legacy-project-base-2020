FROM node:14-alpine
# HEALTHCHECK --interval=30s CMD node healthcheck.js
WORKDIR /var/www/crm-consultores-backend
COPY package.json ./
ENV NODE_ENV=production
RUN yarn install
COPY . .
# EXPOSE 3000
CMD [ "yarn", "start:dev" ]