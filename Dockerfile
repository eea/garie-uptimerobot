FROM node:8.10.0

RUN mkdir -p /usr/src/garie-uptimerobot
RUN mkdir -p /usr/src/garie-uptimerobot/reports

WORKDIR /usr/src/garie-uptimerobot

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

VOLUME ["/usr/src/garie-uptimerobot/reports"]

ENTRYPOINT ["/usr/src/garie-uptimerobot/docker-entrypoint.sh"]

CMD ["npm", "start"]
