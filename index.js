const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Thay bằng username của bạn
    password: '@Nguyen1222004',      // Thay bằng password của bạn
    database: 'BookInventory'
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Kết nối MySQL thành công!');
});

// API Test
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/upload-book', (req, res) => {
    const { bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL } = req.body;
    const sql = `INSERT INTO Books (bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách đã được thêm!', bookId: result.insertId });
    });
});
app.get('/all-books', (req, res) => {
    const sql = "SELECT * FROM Books";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
app.patch('/book/:id', (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    let updateQuery = "UPDATE Books SET ";
    let updateValues = [];
    Object.keys(updateFields).forEach((key, index) => {
        updateQuery += `${key} = ?${index < Object.keys(updateFields).length - 1 ? ', ' : ' '}`;
        updateValues.push(updateFields[key]);
    });
    updateQuery += "WHERE id = ?";

    db.query(updateQuery, [...updateValues, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cập nhật sách thành công!' });
    });
});
app.delete('/book/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Books WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách đã bị xóa!' });
    });
});
app.get('/book/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Books WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});
app.post('/upload-favorite-book', (req, res) => {
    const { bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL } = req.body;
    const sql = `INSERT INTO BooksFavorite (bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [bookTitle, authorName, imageURL, category, bookDescription, bookPDFURL], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách yêu thích đã được thêm!', bookId: result.insertId });
    });
});
app.get('/all-favorite-books', (req, res) => {
    const sql = "SELECT * FROM BooksFavorite";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
app.delete('/favorite-book/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM BooksFavorite WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Sách yêu thích đã bị xóa!' });
    });
});
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});