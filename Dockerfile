FROM node

WORKDIR app
COPY package*.json ./
RUN npm install
RUN npm install amqplib
COPY . .
CMD ["node","jsRabbitServer"]
