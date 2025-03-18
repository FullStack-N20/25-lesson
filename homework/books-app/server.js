const http = require('http');
const fs = require('fs');
const path = require('path');

// Books data file path
const BOOKS_FILE = path.join(__dirname, 'books.json');

// Initialize books.json if it doesn't exist
if (!fs.existsSync(BOOKS_FILE)) {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify([]));
}

// Helper function to read books
const readBooks = () => {
    const data = fs.readFileSync(BOOKS_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper function to write books
const writeBooks = (books) => {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // // Set CORS headers
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // // Handle OPTIONS request for CORS
    // if (req.method === 'OPTIONS') {
    //     res.writeHead(200);
    //     res.end();
    //     return;
    // }

    // Parse request body for POST and PUT requests
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let requestBody;
        try {
            requestBody = body ? JSON.parse(body) : {};
        } catch (error) {
            requestBody = {};
        }

        // Route handling
        const url = req.url;

        // GET /books - Get all books
        if (url === '/books' && req.method === 'GET') {
            const books = readBooks();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(books));
        }
        // POST /books - Add new book
        else if (url === '/books' && req.method === 'POST') {
            const books = readBooks();
            const newBook = {
                id: Date.now().toString(),
                ...requestBody
            };
            books.push(newBook);
            writeBooks(books);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newBook));
        }
        // PUT /books/:id - Update book
        else if (url.match(/\/books\/\d+/) && req.method === 'PUT') {
            const id = url.split('/')[2];
            const books = readBooks();
            const index = books.findIndex(book => book.id === id);
            
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Book not found' }));
                return;
            }

            books[index] = { ...books[index], ...requestBody };
            writeBooks(books);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(books[index]));
        }
        // DELETE /books/:id - Delete book
        else if (url.match(/\/books\/\d+/) && req.method === 'DELETE') {
            const id = url.split('/')[2];
            const books = readBooks();
            const index = books.findIndex(book => book.id === id);
            
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Book not found' }));
                return;
            }

            books.splice(index, 1);
            writeBooks(books);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Book deleted successfully' }));
        }
        
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 