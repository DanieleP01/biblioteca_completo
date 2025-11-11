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
    year INTEGER,
    content_path TEXT
);

CREATE TABLE IF NOT EXISTS library_books (
    library_id INTEGER,
    book_id INTEGER,
    total_copies INTEGER,
    available_copies INTEGER,
    PRIMARY KEY(library_id, book_id),
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    library_id INTEGER,
    book_id INTEGER,
    loan_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'active', 'overdue', 'returned', 'rejected'
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

CREATE TABLE IF NOT EXISTS CopyRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    library_id INTEGER NOT NULL,
    librarian_id INTEGER NOT NULL, 
    requested_copies INTEGER NOT NULL CHECK(requested_copies > 0),
    reason TEXT, -- "Alta richiesta", "Copie danneggiate", ecc.
    status TEXT NOT NULL DEFAULT 'Pending', -- Valori possibili: Pending, Approved, Rejected
    admin_id INTEGER, -- L'amministratore che ha approvato o rifiutato la richiesta
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,

    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (library_id) REFERENCES libraries(id),
    FOREIGN KEY (librarian_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_id INTEGER NOT NULL,
  recipient_role TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- POPOLAMENTO
INSERT OR IGNORE INTO books 
(title, author, isbn, category, cover_url, description, year, content_path) VALUES
('Il Signore degli Anelli', 'J.R.R. Tolkien', '978-8845292613', 'Fantasy', 'https://www.ibs.it/images/9788830119000_0_0_536_0_75.jpg', 'dsnfkdnfidnf', '2000', 'Il_signore_degli_anelli.txt'),
('Orgoglio e Pregiudizio', 'Jane Austen', '978-8804677943', 'Classici', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE4RH5mtS5Z7QvnhEkax5ot1ijt4nuB39UBg&s', 'udnfudsnfodsn', '2001', 'Orgoglio_pregiudizio.txt'),
('1984', 'George Orwell', '978-8804618762', 'Distopico', 'https://copertine.hoepli.it/archivio/978/8499/9788499890944.jpg', 'sdnsjdnf', '2002', '1984.txt'),
('Moby Dick', 'Herman Melville', '978-8817009419', 'Classici', 'https://www.ibs.it/images/9788868676018_0_0_536_0_75.jpg','cnsdvnds', '2003', 'moby_dick.txt'),
('Harry Potter e la Pietra Filosofale', 'J.K. Rowling', '978-8869184519', 'Fantasy', 'https://m.media-amazon.com/images/I/71QIZXG2J2L._AC_UF1000,1000_QL80_.jpg', 'dsfndnf', '2004', 'Harry_Potter_e_la_Pietra_Filosofale.txt'),
('Il Codice Da Vinci', 'Dan Brown', '978-8804523620', 'Thriller', 'https://m.media-amazon.com/images/I/719CeDchSsL._AC_UF1000,1000_QL80_.jpg', 'dsnfjdnf', '2005', 'Il_Codice_Da_Vinci.txt'),
('Guerra e Pace', 'Lev Tolstoj', '978-8806206013', 'Classici', 'https://www.ibs.it/images/9788807901461_0_0_536_0_75.jpg', 'dnosjdns', '2006', 'Guerra_E_Pace.txt'),
('Cronache di Narnia: Il Leone, la Strega e Armadio', 'C.S. Lewis', '978-8804642873', 'Fantasy', 'https://m.media-amazon.com/images/I/71+eLNG0bXL.jpg', 'dsnodnfon', '2007', 'cronache_di_narnia.txt'),
('Cento anni di Solitudine', 'Gabriel Garcia Marquez', '978-8804494276', 'Realismo Magico', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP8hqUcc_q2miAOPg-yVv2GivfAKLVmYxHjA&s', 'amsdpkdpowa', '2008', 'Cento_Anni_di_Solitudine.txt'),
('Fahrenheit 451', 'Ray Bradbury', '978-8804683074', 'Distopico', 'https://m.media-amazon.com/images/I/61uRn2XO9QL._AC_UF1000,1000_QL80_.jpg', 'cmnvibns', '2009', 'Fahrenheit_451.txt'),
('Il Piccolo Principe', 'Antoine de Saint-Exupéry', '978-8845292279', 'Favola', 'https://m.media-amazon.com/images/I/61XaPkL2EKL.jpg', 'niubcfrc', '2010', 'Il_Piccolo_Principe.txt'),
('Il Nome della Rosa', 'Umberto Eco', '978-8845290688', 'Giallo Storico', 'https://m.media-amazon.com/images/I/61Aa9Yic8AL._AC_UF1000,1000_QL80_.jpg', 'pkdojsijins', '2011', 'Il_Nome_della_Rosa.txt'),
('L''alchimista', 'Paulo Coelho', '978-8878187884', 'Narrativa Esoterica', 'https://m.media-amazon.com/images/I/91rF1lW1oRL._UF1000,1000_QL80_.jpg', 'dncsodvnos', '2012', 'L_alchimista.txt'),
('Don Chisciotte della Mancia', 'Miguel de Cervantes', '978-8804677844', 'Classici', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs9drnYCFoeSdimqkpCV45OQbXYWf5332qng&s', 'mdocinwecjn', '2013', 'Don_Chisciotte_della_Mancha.txt');

INSERT OR IGNORE INTO libraries 
(name, address, city, province, manager_id, cover_url) VALUES
('Biblioteca Centrale della Regione Siciliana “A. Bombace”', 'Via Vittorio Emanuele, 429', 'Palermo', 'PA', 11, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCslfEf-6IHYB4xEDF8jpeaPJXFroma2tXg&s'),
('Biblioteca Comunale di Palermo Leonardo Sciascia (Casa Professa)', 'Piazzetta Brunaccini, 2', 'Palermo', 'PA', NULL, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/99/94/1c/caption.jpg?w=1200&h=-1&s=1'),
('Biblioteca Comunale Borgo Nuovo', 'Via Largo Pozzillo, 7', 'Palermo', 'PA', NULL, 'https://www.esperienzeconilsud.it/openlibrary/wp-content/uploads/sites/376/2025/03/WhatsApp-Image-2025-03-19-at-13.00.06-3-.jpeg'),
('Biblioteca Centrale della Facoltà di Agraria', 'Piazza Delle Cliniche, 2', 'Palermo', 'PA', NULL, 'https://biblio.unipd.it/biblioteche/agripolis/@@images/image-1200-735bb42cad85a09d99ce9e4315f5ae4d.jpeg'),
('Biblioteca Comunale - Palazzo Ziino', 'Via Dante, 53', 'Palermo', 'PA', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTGQ7dKRkBwCvgkFfBgmxuWsck9PMtQPClQw&s'),
('Biblioteca Civica Pallavicino', 'Via Giuseppe Spata, 10', 'Palermo', 'PA', NULL, 'https://parmawelcome.it/wp-content/uploads/2025/01/Biblioteca-civica-interno.jpg'),
('Biblioteca Civica dei Ragazzi', 'Cortile Scalilla', 'Palermo', 'PA', NULL, 'https://bibliotecagambalunga.it/sites/default/files/inline-images/foto_estivo.jpg'),
('Biblioteca Civica Multimediale Villa Trabia', 'Via Salinas, 3', 'Palermo', 'PA', NULL, 'https://turismo.comune.palermo.it/js/server/uploads/luoghi/213x104/_12042019122006.jpg'),
('Biblioteca Privata Itinerante “Pietro Tramonte”', 'Monte Santa Rosalia 18/19', 'Palermo', 'PA', NULL, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEie09TME83LScB6vDwm84bryRzC3TdVuxhi61sS0Ww9Xnw8rIWBRSkk68Gae2ZW_3cDoOvf9a8FYFC8Ilgs0pNG8LOACOpY79c1GyWov0tsv_bSEOOdLTgfuK_XhL91tqFgP6XCYo3h7t_V/s1600/20181205_153523.jpg'),
('Biblioteca Francescana', 'Via del Parlamento, 32', 'Palermo', 'PA', NULL, 'https://www.balarm.it/cache/9/a/d/3/3/9ad3352c03426e6c141409c7f8ef8a9da8291b02-biblioteca-francescana-jpg-614-1487160989.jpeg');


INSERT OR IGNORE INTO library_books
(library_id, book_id, total_copies, available_copies) VALUES
(1, 1, 5, 5),
(1, 2, 3, 3),
(1, 3, 4, 4),
(2, 4, 2, 2),
(2, 5, 6, 6),
(3, 6, 1, 1),
(3, 7, 2, 2),
(4, 8, 3, 3),
(4, 9, 4, 4),
(5, 10, 5, 5),
(5, 11, 2, 2),
(6, 12, 3, 3),
(6, 13, 4, 4),
(7, 14, 1, 1),
(7, 1, 2, 2),
(8, 2, 3, 3),
(8, 3, 4, 4),
(9, 4, 5, 5),
(9, 5, 2, 2),
(10, 6, 3, 3),
(10, 7, 4, 4),
(11, 8, 1, 1),
(11, 9, 2, 2),
(12, 10, 3, 3),
(12, 11, 4, 4),
(13, 12, 5, 5),
(13, 13, 2, 6);