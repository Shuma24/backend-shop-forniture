## Installation

Docker to run.

```sh
version: '3'
services:
  frontend:
    build: ./furniture-store-front-react
    container_name: front
    restart: always
    ports:
      - 5421:5421
    volumes:
      - /app/node_modules
      - ./furniture-store-front-react:/app
  api:
    build: ./server
    container_name: backend
    restart: always
    ports:
      - 5222:5222
    volumes:
      - /app/node_modules
      - ./server:/app
    environment:
      MONGO_USER: test
      MONGO_PASSWORD: test
      MONGO_HOST: mongo
      MONGO_PORT: 27017
      MONGO_DB: shop
      PORT: 5222
  mongo:
    image: mongo
    container_name: mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: test
      MONGO_INITDB_ROOT_PASSWORD: test
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongo mongo:27017/test --quiet
      interval: 10s
      timeout: 0s
      retries: 3
      start_period: 20s
    volumes:
      - mongo_data:/data/db
  mongo-express:
    image: mongo-express
    container_name: adminer
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: test
      ME_CONFIG_MONGODB_ADMINPASSWORD: test
      ME_CONFIG_MONGODB_URL: mongodb://test:test@mongo:test/

volumes:
  mongo_data:
```
