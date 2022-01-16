# koa-grpc-news-api
sample nodeJS app with both a koa api and a grpc server/client for consuming news
# usage
running ```docker-compose up``` will bring up a mongoDb image as well a koa RESTful api as well as GRPC server that mimics the functionality of the API on ports 8089 and 40002 respectively, ports can be changes in the .env file which is not gitignored due to the sample nature of this project.
swagger docs for the API can be found under ```/swagger```

a sample client that comsumes the GRPC server can be run using ```npm run grpc_client```.

the mongoDb is not persisted through docker volumes due to the sample nature of the project
