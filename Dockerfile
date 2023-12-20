FROM node:18-alpine
WORKDIR /emr_ui/
COPY public/ /emr_ui/public
COPY src/ /emr_ui/src
COPY package.json /emr_ui/

RUN npm install
CMD ["npm", "start"]

