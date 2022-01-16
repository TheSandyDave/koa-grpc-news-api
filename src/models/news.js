const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(Mongoose);

const NewsSchema = new Mongoose.Schema(
    {
        _id: {
            Number
        },
        date: {
            type: Date,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true,
        }
    },
    {timestamps: true},
    // required for the autoincrement library so _id autoincrements
    {_id: false}
);

// clean up entities from DB before serving it as a response
NewsSchema.method('toClient', function() {
    var obj = this.toObject();

    //Rename Id
    obj.id = obj._id;

    delete obj._id;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;

    return obj;
});

NewsSchema.plugin(AutoIncrement);
Mongoose.model('News', NewsSchema);

module.exports = Mongoose.model('News');