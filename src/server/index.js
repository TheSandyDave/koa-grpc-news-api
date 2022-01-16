const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(Mongoose);
const Swagger = require('../middleware/swagger');
const SwaggerUi = require('koa2-swagger-ui');
const NewsRoutes = require('../routes/news');

Mongoose.connect(`mongodb://${process.env.MONGO_NAME}:${process.env.MONGO_PORT}/news-mongo`);

const app = new Koa();
const router = new Router();
NewsRoutes(router);

const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'sample news API',
            version: '1.0.0',
            description: 'sample news API',
        },
    },
    apis: [
        //relative paths with .. don't behave nicely with the swagger, dirname as a workaround
        `${__dirname}/../controllers/news.js`,
    ],
    path: '/swagger.json',
}

const swagger = Swagger(swaggerOptions);

const swaggerUi = SwaggerUi.koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
        url: swaggerOptions.path,
    }
});

app
    .use(swagger)
    .use(swaggerUi)
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(`${process.env.API_PORT}`);
console.log(`listening on ${process.env.API_PORT}`)