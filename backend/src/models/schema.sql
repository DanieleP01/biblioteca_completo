-- CREAZIONE TABELLE 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    role TEXT DEFAULT 'user'  -- 'user', 'librarian', 'admin'
);

CREATE TABLE IF NOT EXISTS libraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
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
    cover_url TEXT,
    description TEXT,
    year INTEGER
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
(title, author, isbn, category, cover_url, description, year) VALUES
('Il Signore degli Anelli', 'J.R.R. Tolkien', '978-8845292613', 'Fantasy', 'assets/books/IlSignoreDegliAnelli.png', 'dsnfkdnfidnf', '2000'),
('Orgoglio e Pregiudizio', 'Jane Austen', '978-8804677943', 'Classici', 'assets/books/OrgoglioPregiudizio.png', 'udnfudsnfodsn', '2001'),
('1984', 'George Orwell', '978-8804618762', 'Distopico', 'assets/books/1984.png', 'sdnsjdnf', '2002'),
('Moby Dick', 'Herman Melville', '978-8817009419', 'Classici', 'assets/books/mobyDick.png','cnsdvnds', '2003'),
('Harry Potter e la Pietra Filosofale', 'J.K. Rowling', '978-8869184519', 'Fantasy', 'assets/books/HarryPotter.png', 'dsfndnf', '2004'),
('Il Codice Da Vinci', 'Dan Brown', '978-8804523620', 'Thriller', 'assets/books/CodiceDaVinci.png', 'dsnfjdnf', '2005'),
('Guerra e Pace', 'Lev Tolstoj', '978-8806206013', 'Classici', 'assets/books/GuerraPace.png', 'dnosjdns', '2006'),
('Cronache di Narnia: Il Leone, la Strega e Armadio', 'C.S. Lewis', '978-8804642873', 'Fantasy', 'assets/books/narnia.png', 'dsnodnfon', '2007'),
('Cento anni di Solitudine', 'Gabriel Garcia Marquez', '978-8804494276', 'Realismo Magico', 'assets/books/cent_anni_di_solitudine.png', 'amsdpkdpowa', '2008'),
('Fahrenheit 451', 'Ray Bradbury', '978-8804683074', 'Distopico', 'assets/books/fahrenheit_451.png', 'cmnvibns', '2009'),
('Il Piccolo Principe', 'Antoine de Saint-Exupéry', '978-8845292279', 'Favola', 'assets/books/il_piccolo_principe.png', 'niubcfrc', '2010'),
('Il Nome della Rosa', 'Umberto Eco', '978-8845290688', 'Giallo Storico', 'assets/books/il_nome_della_rosa.png', 'pkdojsijins', '2011'),
('L''alchimista', 'Paulo Coelho', '978-8878187884', 'Narrativa Esoterica', 'assets/books/l_alchimista.png', 'dncsodvnos', '2012'),
('Don Chisciotte della Mancia', 'Miguel de Cervantes', '978-8804677844', 'Classici', 'assets/books/don_chisciotte_della_mancia.png', 'mdocinwecjn', '2013');

INSERT OR IGNORE INTO libraries 
(name, address, city, province, manager_id, cover_url) VALUES
('Biblioteca Centrale della Regione Siciliana “A. Bombace”', 'Via Vittorio Emanuele, 429', 'Palermo', 'PA', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCslfEf-6IHYB4xEDF8jpeaPJXFroma2tXg&s'),
('Biblioteca Comunale di Palermo Leonardo Sciascia (Casa Professa)', 'Piazzetta Brunaccini, 2', 'Palermo', 'PA', NULL, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/99/94/1c/caption.jpg?w=1200&h=-1&s=1'),
('Biblioteca Comunale Borgo Nuovo', 'Via Largo Pozzillo, 7', 'Palermo', 'PA', NULL, 'https://www.esperienzeconilsud.it/openlibrary/wp-content/uploads/sites/376/2025/03/WhatsApp-Image-2025-03-19-at-13.00.06-3-.jpeg'),
('Biblioteca Centrale della Facoltà di Agraria', 'Piazza Delle Cliniche, 2', 'Palermo', 'PA', NULL, 'https://biblio.unipd.it/biblioteche/agripolis/@@images/image-1200-735bb42cad85a09d99ce9e4315f5ae4d.jpeg'),
('Biblioteca Comunale - Palazzo Ziino', 'Via Dante, 53', 'Palermo', 'PA', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTGQ7dKRkBwCvgkFfBgmxuWsck9PMtQPClQw&s'),
('Biblioteca Civica Pallavicino', 'Via Giuseppe Spata, 10', 'Palermo', 'PA', NULL, 'https://parmawelcome.it/wp-content/uploads/2025/01/Biblioteca-civica-interno.jpg'),
('Biblioteca Civica dei Ragazzi', 'Cortile Scalilla', 'Palermo', 'PA', NULL, 'https://bibliotecagambalunga.it/sites/default/files/inline-images/foto_estivo.jpg'),
('Biblioteca Civica Multimediale Villa Trabia', 'Via Salinas, 3', 'Palermo', 'PA', NULL, 'https://turismo.comune.palermo.it/js/server/uploads/luoghi/213x104/_12042019122006.jpg'),
('Biblioteca Privata Itinerante “Pietro Tramonte”', 'Monte Santa Rosalia 18/19', 'Palermo', 'PA', NULL, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEie09TME83LScB6vDwm84bryRzC3TdVuxhi61sS0Ww9Xnw8rIWBRSkk68Gae2ZW_3cDoOvf9a8FYFC8Ilgs0pNG8LOACOpY79c1GyWov0tsv_bSEOOdLTgfuK_XhL91tqFgP6XCYo3h7t_V/s1600/20181205_153523.jpg'),
('Biblioteca Francescana', 'Via del Parlamento, 32', 'Palermo', 'PA', NULL, 'https://www.balarm.it/cache/9/a/d/3/3/9ad3352c03426e6c141409c7f8ef8a9da8291b02-biblioteca-francescana-jpg-614-1487160989.jpeg'),
('Biblioteca Officina Studi Medievali', 'Via del Parlamento, 32', 'Palermo', 'PA', NULL, 'https://www.balarm.it/cache/7/5/0/3/9/75039b73bf188384a0c640180e8a656ea3e123f0-officina-studi-medievali-palermo-jpg-477-1481115794.jpeg'),
('Biblioteca della Fondazione Sicilia', 'Via Bara all’Olivella, 2', 'Palermo', 'PA', NULL, 'https://www.fondazionesicilia.it/wp-content/uploads/2022/04/biblioteca02-1000x661-1.jpg'),
('Biblioteca del Conservatorio Alessandro Scarlatti', 'Via Squarcialupo, 45', 'Palermo', 'PA', NULL, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/26/7b/2e/interno-della-biblioteca.jpg?w=1200&h=1200&s=1');
