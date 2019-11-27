FROM node:dubnium-alpine AS base
WORKDIR /opt/app
COPY package.json package-lock.json /tmp/

FROM base AS dependencies
RUN cd /tmp && npm install --no-optional && npm cache clean --force

FROM base AS development
COPY package.json package-lock.json ./
COPY src ./src
COPY --from=dependencies /tmp/node_modules ./node_modules

CMD [ "npm", "start" ]