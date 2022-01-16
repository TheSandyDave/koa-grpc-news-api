const NewsService = require('../services/news-service')
const Errors = require('../errors/errors')
/**
 * @swagger
 *
 * components:
 *   schemas:
 *     News: 
 *       properties:
 *         id: 
 *           type: number
 *         date:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         text:
 *           type: string
 *     NewsPartial:
 *       properties:
 *         date:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         text:
 *           type: string
 *       required:
 *         - title
 *         - date
 *         - description
 *         - text
 *     NewsUpdatePartial:
 *       properties:
 *         date:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         text:
 *           type: string
 * 
 */


let NewsController = {
    /**
     * @swagger
     * 
     * /api/news/{id}:
     *   get:
     *     summary: get news by id
     *     tags: 
     *       - news
     *     parameters:
     *       -  name: id
     *          in: path
     *          required: true
     *          description: the id of the news to retrieve
     *          schema: 
     *            type: string
     *     responses:
     *        '200':
     *          description: success
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/News'
     *        '404':
     *          description: entity not found
     *        '500':
     *          description: internal server error
     *  
     */
    getById: async (ctx) => {
        if (!ctx.params.id) {
            ctx.status = 400;
            return;
        }
        try {
            news = await NewsService.getById(ctx.params.id);
            if (!news) return ctx.status = 404;
            ctx.body = news;
        } catch (err) {
            if (err instanceof Errors.UnknownError) {
                ctx.status = 500;
            }
        }
    },

    /**
     * @swagger
     * 
     * /api/news:
     *   post:
     *     summary: create new news
     *     tags: 
     *       - news
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewsPartial'
     *     responses:
     *       '201':
     *          description: created
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/News'
     *       '400':
     *         description: bad request
     *       '500':
     *         description: internal server error
     * 
     */

    create: async (ctx) => {
        try {
            let news = {
                title: ctx.request.body.title,
                date: ctx.request.body.date,
                description: ctx.request.body.description,
                text: ctx.request.body.text
            };

            let created = await NewsService.create(news);
            ctx.body = created;
            ctx.status = 201;
        } catch (err) {
            if (err instanceof Errors.ValidationError) {
                ctx.status = 400;
            } else ctx.status = 500;
        }
    },

    /**
     * @swagger
     * 
     * /api/news/{id}:
     *   put:
     *     summary: update existing news
     *     tags: 
     *       - news
     *     parameters:
     *       -  name: id
     *          in: path
     *          required: true
     *          description: the id of the news to retrieve
     *          schema: 
     *            type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema: 
     *             $ref: '#/components/schemas/NewsUpdatePartial'
     *     responses:
     *       '200':
     *          description: Updated
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/News'
     *       '400':
     *          description: bad request
     *       '500':
     *          description: internal server error
     * 
     */
    update: async (ctx) => {
        if (!ctx.params.id) {
            ctx.status = 400;
            return;
        }
        try {
            let news = await NewsService.update(ctx.params.id, ctx.request.body);
            ctx.status = 200;
            ctx.body = news;
        } catch (err) {
            // TODO: look up what mongoose returns for 404
            if (err instanceof Errors.ValidationError) {
                ctx.status = 400;
            } else ctx.status = 500;
        }
    },

    /**
     * @swagger
     * 
     * /api/news/{id}:
     *   delete:
     *     summary: delete news by id
     *     tags: 
     *       - news
     *     parameters:
     *       -  name: id
     *          in: path
     *          required: true
     *          description: the id of the news to delete
     *          schema: 
     *            type: string
     *     responses:
     *        '204':
     *         description: success
     *        '404':
     *          description: entity not found
     */
    delete: async (ctx) => {
        if (!ctx.params.id) {
            ctx.status = 400;
            return;
        }
        try {
            await NewsService.delete(ctx.params.id);
            ctx.status = 204;
        } catch (err) {
            // TODO: look up what mongoose returns for 404
            ctx.status = 404;
        }
    },
    /**
     * @swagger
     * 
     * /api/news:
     *   get:
     *     summary: get all news
     *     tags: 
     *       - news
     *     parameters:
     *       -  name: sortBy
     *          in: query
     *          required: false
     *          description: comma seperated list of fields to sort by, -{fieldName} for descending, ascending otherwise, default descending date
     *          example: -title,date
     *          schema: 
     *            type: string
     *       -  name: title
     *          in: query
     *          required: false
     *          description: filter for title field
     *          example: lorum%20ipsum
     *          schema: 
     *            type: string
     *       -  name: date
     *          in: query
     *          required: false
     *          description: filter for date field, follows RHS colon filtering system
     *          example: gte:2021-09-10
     *          schema: 
     *            type: string
     *     responses:
     *        '200':
     *          description: success
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                $ref: '#/components/schemas/News'
     *        '500':
     *          description: internal server error
     *  
     */

    query: async (ctx) => {
        let sortBy = "-date";
        if (ctx.request.query.sortBy) {
            sortBy = ctx.query.sortBy.split(',').join(' ');
        }
        console.log("%j", ctx.request.query.sortBy)
        let filterBy = {};
        if (ctx.request.query.title) filterBy.title = new RegExp(decodeURI(ctx.request.query.title), "i");
        if (ctx.request.query.date) {
            // convert a filter with an operator to a format mongoose accepts
            if (ctx.request.query.date.includes(':')) {
                let splitDate = ctx.query.date.split(':');
                let operator = '$'+splitDate[0];
                splitDate.shift();
                filterBy.date = {[operator]: splitDate.join()};
            } else filterBy.date = ctx.request.query.date
        }

        try {
            let news = await NewsService.query(filterBy, sortBy);
            ctx.body = news;
            ctx.status = 200;
        } catch (err) {
            ctx.status = 500;
        }
    }
}

module.exports = NewsController;