const GRPC = require('@grpc/grpc-js');
const PROTO_PATH = `${__dirname}/../protos/news.proto`;
const ProtoLoader = require('@grpc/proto-loader');
const NewsGrpcService = require("./news-grpc-service");
const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(Mongoose);

Mongoose.connect(`mongodb://${process.env.MONGO_NAME}:${process.env.MONGO_PORT}/news-mongo`);

var packageDefinition = ProtoLoader.loadSync(PROTO_PATH);
const proto = GRPC.loadPackageDefinition(packageDefinition);

const server = new GRPC.Server();

server.addService(proto.NewsService.service, NewsGrpcService);

server.bindAsync(
    `0.0.0.0:${process.env.GRPC_PORT}`,
    GRPC.ServerCredentials.createInsecure(),
    (err, p) => {
        console.log("Server running on port:", p);
        server.start();
    }
)