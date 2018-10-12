const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    createdAt: { type: Date, default: Date.now }
});

BlogSchema.virtual('createdAtFormatted').get(function() {
    return this.createdAt.toDateString();
});

module.exports = mongoose.model('blog', BlogSchema);