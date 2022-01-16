const News = require('../models/news.js')
const Errors = require('../errors/errors.js');
const Mongoose = require('mongoose');
const news = require('../models/news.js');
let NewsService = {
    getById: async (id) => {
        try {
            let news = await News.findById(id).exec();
            return news.toClient();
        } catch (err) {
            throw new Errors.NotFoundError();
        }
    },

    create: async (newsRequest) => {
        try {
            let news = new News({
                date: newsRequest.date,
                title: newsRequest.title,
                description: newsRequest.description,
                text: newsRequest.text,
            })
            news = await news.save();
            return news.toClient();
        } catch (err) {
            if (err instanceof Mongoose.Error.ValidationError) {
                throw new Errors.ValidationError();
            }
            else throw new Errors.UnknownError();
        }
    },

    update: async (id, book) => {
        try {
            let news = await News.findOneAndUpdate({_id: id}, { $set: book }, { new: true, runValidators: true }).exec();
            return news.toClient();
        } catch (err) {
            throw new Errors.NotFoundError();
        }
    },

    delete: async (id) => {
        try {
            await news.findOneAndDelete({ _id: id }).exec();
        } catch (err) {
            throw new Errors.NotFoundError();
        }
    },

    query: async (filterOpts, sortOpts) => {
        try {
            let news = await News.find(filterOpts).sort(sortOpts).exec();
            news.forEach(function (v, i, arr) {
                arr[i] = v.toClient();
            });
            return news;
        } catch (err) {
            throw new Errors.UnknownError();
        }
    }
}

module.exports = NewsService;