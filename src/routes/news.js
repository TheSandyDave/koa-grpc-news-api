const NewsController = require('../controllers/news')

module.exports = (router) => {
    router
        .post('/api/news', NewsController.create)
        .put('/api/news/:id',NewsController.update)
        .delete('/api/news/:id', NewsController.delete)
        .get('/api/news/:id',NewsController.getById)
        .get('/api/news',NewsController.query);
}