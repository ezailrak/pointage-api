## Description

J'ai utilié node.js, express.js avec TS, et prisma pour gérer la BDD PostgreSQL.
J'ai également implémenter quelques tests dans ./tests
Port par défaut de l'app:3000
Port public de postgres sur docker: 54320
Postman collection de tous les endpoint: ./pointage-api.postman_collection.json

## Installation
```bash

# intall module
npm install

```

## Running the App

```bash

# start with prisma migration
$ npm run start:migrate:prod

# start with docker 
docker-compose up -d

```


## Test

```bash

# unit and integration tests
$ npm run test

```
