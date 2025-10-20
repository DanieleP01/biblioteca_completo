-- CREAZIONE TABELLE 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'  -- 'user', 'librarian', 'admin'
);

CREATE TABLE IF NOT EXISTS libraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    manager_id INTEGER,
    cover_url TEXT,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    category TEXT,
    cover_url TEXT
);

CREATE TABLE IF NOT EXISTS library_books (
    library_id INTEGER,
    book_id INTEGER,
    copies INTEGER,
    PRIMARY KEY(library_id, book_id),
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    library_id INTEGER,
    book_id INTEGER,
    loan_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    library_id INTEGER,
    book_id INTEGER,
    reservation_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- POPOLAMENTO

INSERT OR IGNORE INTO books 
(title, author, isbn, category, cover_url) VALUES
('Il Signore degli Anelli', 'J.R.R. Tolkien', '978-8845292613', 'Fantasy', 'assets/books/IlSignoreDegliAnelli.png'),
('Orgoglio e Pregiudizio', 'Jane Austen', '978-8804677943', 'Classici', 'assets/books/OrgoglioPregiudizio.png'),
('1984', 'George Orwell', '978-8804618762', 'Distopico', 'assets/books/1984.png'),
('Moby Dick', 'Herman Melville', '978-8817009419', 'Classici', 'assets/books/mobyDick.png'),
('Harry Potter e la Pietra Filosofale', 'J.K. Rowling', '978-8869184519', 'Fantasy', 'assets/books/HarryPotter.png'),
('Il Codice Da Vinci', 'Dan Brown', '978-8804523620', 'Thriller', 'assets/books/CodiceDaVinci.png'),
('Guerra e Pace', 'Lev Tolstoj', '978-8806206013', 'Classici', 'assets/books/GuerraPace.png'),
('Cronache di Narnia: Il Leone, la Strega e Armadio', 'C.S. Lewis', '978-8804642873', 'Fantasy', 'assets/books/narnia.png'),
('Cento anni di Solitudine', 'Gabriel Garcia Marquez', '978-8804494276', 'Realismo Magico', 'assets/books/cent_anni_di_solitudine.png'),
('Fahrenheit 451', 'Ray Bradbury', '978-8804683074', 'Distopico', 'assets/books/fahrenheit_451.png'),
('Il Piccolo Principe', 'Antoine de Saint-Exupéry', '978-8845292279', 'Favola', 'assets/books/il_piccolo_principe.png'),
('Il Nome della Rosa', 'Umberto Eco', '978-8845290688', 'Giallo Storico', 'assets/books/il_nome_della_rosa.png'),
('L''alchimista', 'Paulo Coelho', '978-8878187884', 'Narrativa Esoterica', 'assets/books/l_alchimista.png'),
('Don Chisciotte della Mancia', 'Miguel de Cervantes', '978-8804677844', 'Classici', 'assets/books/don_chisciotte_della_mancia.png');

