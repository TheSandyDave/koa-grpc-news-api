const NewsService = require('../services/news-service');
const Errors = require('../errors/errors')
const GRPC = require('@grpc/grpc-js')
let NewsGrpcService = {
    Get: async (ctx, callback) => {
        if (!ctx.request.id) return callback({
            code: GRPC.status.INVALID_ARGUMENT,
            message: "Id of news is required"
        });
        try {
            let news = await NewsService.getById(ctx.request.id);
            return callback(null, news);
        } catch (err) {
            return callback({
                code: GRPC.status.NOT_FOUND,
                message: "news not found"
            });
        }

    },

    Create: async (ctx, callback) => {
        try {
            let news = {
                title: ctx.request.title,
                date: ctx.request.date,
                description: ctx.request.description,
                text: ctx.request.text,
            }
            var created = await NewsService.create(news)
            return callback(null, created);
        } catch (err) {
            if (err instanceof Errors.ValidationError) {
                return callback({
                    code: GRPC.status.INVALID_ARGUMENT,
                    message: err.toString(),
                });
            }
            return callback({
                code: GRPC.status.UNKNOWN,
                message: err.toString(),
            })
        }
    },

    Update: async (ctx, callback) => {
        if (!ctx.request.id) return callback({
            code: GRPC.status.INVALID_ARGUMENT,
            message: "Id of news is required"
        });
        try {
            //TODO: this is ugly, find a way to do this cleaner
            let id = ctx.request.id
            ctx.request.id = null
            let update = {}
            Object.keys(ctx.request).forEach(e => { if (ctx.request[e]) update[e] = ctx.request[e] })
            let news = await NewsService.update(id, ctx.request);
            return callback(null, news);
        } catch (err) {
            return callback({
                code: GRPC.status.NOT_FOUND,
                message: "news not found"
            });
        }
    },

    Delete: async (ctx, callback) => {
        if (!ctx.request.id) return callback({
            code: GRPC.status.INVALID_ARGUMENT,
            message: "Id of news is required"
        });
        try {
            await NewsService.delete(ctx.request.id);
            return callback(null, {});
        } catch (err) {
            return callback({
                code: GRPC.status.NOT_FOUND,
                message: "news not found"
            });
        }
    },

    Query: async (ctx, callback) => {
        let sortBy = "-date";
        if (ctx.request.sortFields) {
            sortBy = ctx.request.sortFields.join(' ');
        }
        let filterBy = {};
        if (ctx.request.title) filterBy.title = new RegExp(ctx.request.title, "i");
        if (ctx.request.dateValue) {
            // convert a filter with an operator to a format mongoose accepts
            if (ctx.request.dateOperator) {
                operator = `$${ctx.request.dateOperator}`
                filterBy.date = { [operator]: ctx.request.dateValue }
            } else filterBy.date = ctx.request.dateValue
        }
        try {
            let news = {news: await NewsService.query(filterBy, sortBy)};
            return callback(null, news);
        } catch (err) {
            return callback({
                code: GRPC.status.UNKNOWN,
                message: err.toString(),
            })
        }

    }
}
module.exports = NewsGrpcService;