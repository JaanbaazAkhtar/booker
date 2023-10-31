const express = require("express");
const { authMiddleware, signup, signin, signout, updateUser, deleteUser } = require("../controllers/users");
const { createBook, getAllBooks, getBookById, updateBookById, deleteBookById } = require("../controllers/books");
const router = express.Router();

//user routes
router.post('/add-user', signup);
router.post('/sign-in', signin);
router.post('/sign-out', authMiddleware, signout);
router.post('/update-user', authMiddleware, updateUser);
router.post('/delete-user', authMiddleware, deleteUser);

//book routes
router.post('/add-book', authMiddleware, createBook);
router.get('/get-books', getAllBooks);
router.get('/get-book?:id', getBookById);
router.post('/update-book?:id', authMiddleware, updateBookById);
router.post('/delete-book?:id', authMiddleware, deleteBookById);

module.exports = router;