const SwaggerJSDoc = require('swagger-jsdoc');

let swaggerDoc;

const Swagger = function (opts){

    swaggerDoc = SwaggerJSDoc(opts);

    return function swaggerDocEndpoint(ctx, next){
        if(ctx.path !== opts.path) return next();
        ctx.body = swaggerDoc;
    };
};

module.exports = Swagger;