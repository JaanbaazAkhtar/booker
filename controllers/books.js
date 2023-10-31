const Books = require('../models/Books');
const Users = require('../models/Users');

exports.createBook = async (req, res) => {
    try {
        //checkig if a book with same name and author already exist
        const book = await Books.findOne({ title: req.body.title})
        if(book) {
            return res.status(405).json({ message: 'Book already exists' })
        }

        //creating a new book
        const newBook = new Books({
            title: req.body.title,
            summary: req.body.summary,
            author: req.body.author,
            isbn: req.body.isbn
        });
        const result = await newBook.save();
        res.status(200).json({ message: 'Book added', book: result })
    } catch(error) {
        console.log('error in creating book ', error)
        res.status(400).json({ message: 'Error in creating book', error: error })
    }
}

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Books.find()
        if(!books.length) {
            res.status(404).json({ message: 'No books available'})
        }
        res.status(200).json({ books: books })
    } catch(error) {
        console.log('error in getting all books ', error)
        res.status(400).json({ message: 'Error in getting all books', error: error })
    }
}

exports.getBookById = async (req, res) => {
    try {
        const bookId = req.query.id
        const book = await Books.findById({ _id: bookId });
        if(!book) {
            res.status(404).json({ message: 'Wrong book id'});
        }
        res.status(200).json({ book: book })
    } catch(error) {
        console.log('error in getting book by id ', error)
        res.status(400).json({ message: 'Error in getting book by id', error: error })
    }
}

exports.updateBookById = async (req, res) => {
    try {
        //checking if book already exist
        const bookIdToUpdate = req.query.id
        let book = await Books.findById({ _id: bookIdToUpdate });
        if(!book) {
            return res.status(404).json({ message: 'Wrong book id'});
        }
        const isBookPresent = await Books.findOne({ title: req.body.title })
        if (isBookPresent) {
            return res.status(406).json({ message: 'Book with this title already exist!' });
        }
        const result = await Books.findByIdAndUpdate({_id: bookIdToUpdate}, {
            title: req.body?.title ? req.body?.title : book.title,
            author: req.body?.author ? req.body?.author : book.author,
            summary: req.body?.summary ? req.body?.summary : book.summary,
            isbn: req.body?.isbn ? req.body?.isbn : book.isbn
        });
        res.status(200).json({ message: 'Book updated', data: result });
    } catch(error) {
        console.log('error in updating book by id ', error)
        res.status(400).json({ message: 'Error in updating book by id', error: error })
    }
}

exports.deleteBookById = async (req, res) => {
    try {
        const bookId = req.query.id
        const fbook = await Books.findById({ _id: bookId })
        if(!fbook) {
            return res.status(404).json({ message: 'Book not found' })
        }
        const book = await Books.findByIdAndDelete({ _id: bookId })
        res.status(200).json({ message: 'Book deleted' })
    } catch(error) {
        console.log('error in deleting book by id ', error)
        res.status(400).json({ message: 'Error in deleting book by id', error: error })
    }
}