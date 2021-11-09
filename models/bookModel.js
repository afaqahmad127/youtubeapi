const mongoose = require('mongoose');

const BookModel = class Book {
    constructor() {
        //Structure or Schema of document
        this.bookSchema = new mongoose.Schema({
            bookname: {
                type: String,
                required: true,
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
                required: true,
            },
            page: {
                type: Number,
                required: true,
            },
        });
        //this will enable us to paged or for searching
        this.bookSchema.index({'$**': 'text'});
        //Create collection in mongodb
        this.book = new mongoose.model('Books', this.bookSchema);
    }

    async createBook({ bookname, author, page }) {
        try {
            const book = new this.book({
                bookname: bookname,
                author: author,
                page: page,
            });
            await book.save();
        }
        catch (err) {
            console.log('Error while Creating BookModel');
        }
    }
    async getBooksByAuthor({ author }) {
        try {
            const books = await this.book.find({
                author: author,
            }).populate('author').exec();
            console.log(books)
            return books;
        }
        catch (err) {
            console.log('Error while getting Book');
        }
    }
}
module.exports = BookModel;