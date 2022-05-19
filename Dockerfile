FROM node:16-alpine

WORKDIR /opt/app
COPY ./package.json .
RUN yarn install

COPY ./ .


RUN yarn build
RUN setup

ENTRYPOINT ["yarn","start:production"]

