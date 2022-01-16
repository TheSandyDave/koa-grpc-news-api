const GRPC = require('@grpc/grpc-js');
const PROTO_PATH = `${__dirname}/../protos/news.proto`;
const ProtoLoader = require('@grpc/proto-loader');
const promisifiedNewsClient = require('./news-client');
var packageDefinition = ProtoLoader.loadSync(PROTO_PATH);

const NewsService = GRPC.loadPackageDefinition(packageDefinition).NewsService;

const client = new NewsService(
    `localhost:${process.env.GRPC_PORT}`,
    GRPC.credentials.createInsecure());

const NewsClient = new promisifiedNewsClient(client);



test = async () => {
    //Create sample
    let createNewsPayload = {
        title: "grpc client inserted news",
        date: "2019-12-02",
        description: "sample news item",
        text: "Lorem ipsum dolor sit amet, munere salutandi vel te, ne essent laoreet sed. Case voluptua et eum. Ea eum reque elitr senserit. Choro consulatu voluptaria pri cu, clita recusabo qui at. Pri in quas tollit propriae, no duo menandri sapientem."
    };

    console.log("creating news with payload: ", JSON.stringify(createNewsPayload, null, 2));
    let id;
    let news = await NewsClient.create(createNewsPayload);

    console.log("create news result: ", JSON.stringify(news, null, 2));
    id = news.id;

    //Update sample
    let updateNewsPayload = {
        id: id,
        description: "this has been updated through grpc",
        text: "yep updated"
    };

    console.log("updating previous news item with payload: ", JSON.stringify(updateNewsPayload, null, 2));
    let updatedNews = await NewsClient.update(updateNewsPayload);
    console.log("Update news result: ", JSON.stringify(updatedNews, null, 2));

    //Get sample
    console.log("getting news with id: ", id);
    let gottenNews = await NewsClient.get(id);
    console.log("Get news result: ", JSON.stringify(gottenNews, null, 2));

    // second create to show off sorting and filtering
    createNewsPayload = {
        title: "grpc client inserted news",
        date: "2018-12-02",
        description: "sample news item",
        text: "Lorem ipsum dolor sit amet, munere salutandi vel te, ne essent laoreet sed. Case voluptua et eum. Ea eum reque elitr senserit. Choro consulatu voluptaria pri cu, clita recusabo qui at. Pri in quas tollit propriae, no duo menandri sapientem."
    };

    console.log("creating second news with payload: ", JSON.stringify(createNewsPayload, null, 2));
    news = await NewsClient.create(createNewsPayload);

    console.log("create news result: ", JSON.stringify(news, null, 2));


    let queryNewsPayload = {
        sortFields: ["-date", "title"],
        title: "grpc",
    };

    console.log("querying all news with payload: ", JSON.stringify(queryNewsPayload, null, 2));
    let newsList = await NewsClient.query(queryNewsPayload);

    console.log("query news result: ", JSON.stringify(newsList, null, 2));

    // second query with year filter

    queryNewsPayload.dateValue = "2019",
        queryNewsPayload.dateOperator = "gte";

    console.log("querying all news with payload: ", JSON.stringify(queryNewsPayload, null, 2));
    newsList = await NewsClient.query(queryNewsPayload);

    console.log("query news result: ", JSON.stringify(newsList, null, 2));

    // delete some news and attempt to get it
    console.log("deleting news with Id:", id);
    await NewsClient.delete(id);
    console.log("success, attempting to get news with same id");
    try {
        let deletedNews = await NewsClient.get(id);
    } catch (err) {
        console.log("got error: ", err);
    }

}

test();