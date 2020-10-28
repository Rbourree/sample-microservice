# Sample Microservice


## 1 - Description
This is a sample nodejs API.



## 2 - Requirements
- Nodejs
- NPM
- docker
- docker-compose



## 3 - Installation
### Create .env file and edit it
 ```sh
 $ cp env.template .env
```

### Up postgres and redis container
 ```sh
 $ docker-compose up -d
```

### Install package
```sh
$ npm install
```

### Run API
 ```sh
$ npm run docker
```