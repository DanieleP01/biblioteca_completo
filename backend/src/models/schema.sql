-- CREAZIONE TABELLE 
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    city TEXT,
    province TEXT,
    role TEXT DEFAULT 'user'  -- 'user', 'librarian', 'admin'
);

CREATE TABLE IF NOT EXISTS libraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    librarian_id INTEGER,
    cover_url TEXT,
    FOREIGN KEY (librarian_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    description TEXT NOT NULL,
    year INTEGER NOT NULL,
    content_path TEXT NOT NULL
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
('Il Signore degli Anelli', 'J.R.R. Tolkien', '978-8845292613', 'Fantasy', 'https://www.ibs.it/images/9788830119000_0_0_536_0_75.jpg', 'Un''epica avventura nella Terra di Mezzo che segue il viaggio del giovane hobbit Frodo Baggins. Insieme a una compagnia di eroi, Frodo deve attraversare territori ostili per distruggere l''Unico Anello nel fuoco del Monte Fato, l''unico modo per fermare l''ascesa dell''Oscuro Signore Sauron.', '2000', 'Il_signore_degli_anelli.txt'),
('Orgoglio e Pregiudizio', 'Jane Austen', '978-8804677943', 'Classici', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE4RH5mtS5Z7QvnhEkax5ot1ijt4nuB39UBg&s', 'Nell''Inghilterra dell''Ottocento, la vivace e intelligente Elizabeth Bennet si scontra con le convenzioni sociali del suo tempo. Tra malintesi, differenze di classe e orgoglio ferito, il suo complicato rapporto con il ricco e riservato Mr. Darcy si trasformerà in una delle storie d''amore più celebri della letteratura.', '2001', 'Orgoglio_pregiudizio.txt'),
('1984', 'George Orwell', '978-8804618762', 'Distopico', 'https://copertine.hoepli.it/archivio/978/8499/9788499890944.jpg', 'In un futuro distopico e totalitario, il Grande Fratello sorveglia ogni mossa dei cittadini e la polizia del pensiero reprime ogni forma di individualità. Winston Smith, un funzionario del partito che riscrive la storia per il regime, tenta disperatamente di ribellarsi al sistema e trovare la verità.', '2002', '1984.txt'),
('Moby Dick', 'Herman Melville', '978-8817009419', 'Classici', 'https://www.ibs.it/images/9788868676018_0_0_536_0_75.jpg','L''ossessiva e folle caccia del Capitano Achab alla leggendaria balena bianca, Moby Dick, che anni prima gli aveva strappato una gamba. Narrata dal marinaio Ishmael, è una potente allegoria sulla lotta dell''uomo contro la natura, il destino e i propri demoni interiori.', '2003', 'moby_dick.txt'),
('Harry Potter e la Pietra Filosofale', 'J.K. Rowling', '978-8869184519', 'Fantasy', 'https://m.media-amazon.com/images/I/71QIZXG2J2L._AC_UF1000,1000_QL80_.jpg', 'Nel giorno del suo undicesimo compleanno, l''orfano Harry Potter scopre di possedere poteri magici e di essere stato ammesso alla Scuola di Magia e Stregoneria di Hogwarts. Qui scoprirà la verità sulla morte dei suoi genitori e affronterà per la prima volta il terribile mago oscuro Voldemort.', '2004', 'Harry_Potter_e_la_Pietra_Filosofale.txt'),
('Il Codice Da Vinci', 'Dan Brown', '978-8804523620', 'Thriller', 'https://m.media-amazon.com/images/I/719CeDchSsL._AC_UF1000,1000_QL80_.jpg', 'Il simbologo Robert Langdon viene convocato al Louvre dopo un misterioso omicidio. Insieme alla crittologa Sophie Neveu, si ritrova coinvolto in una frenetica caccia al tesoro attraverso codici nascosti nelle opere di Leonardo da Vinci, che potrebbero rivelare un segreto capace di scuotere le fondamenta del Cristianesimo.', '2005', 'Il_Codice_Da_Vinci.txt'),
('Guerra e Pace', 'Lev Tolstoj', '978-8806206013', 'Classici', 'https://www.ibs.it/images/9788807901461_0_0_536_0_75.jpg', 'Un monumentale affresco della Russia durante le guerre napoleoniche. Attraverso le vite intrecciate di diverse famiglie aristocratiche, tra cui i Bolkonskij e i Rostov, Tolstoj esplora temi universali come l''amore, il destino, la sofferenza umana e l''insensatezza della guerra.', '2006', 'Guerra_E_Pace.txt'),
('Cronache di Narnia: Il Leone, la Strega e Armadio', 'C.S. Lewis', '978-8804642873', 'Fantasy', 'https://m.media-amazon.com/images/I/71+eLNG0bXL.jpg', 'Quattro fratelli, sfollati in una casa di campagna durante la guerra, scoprono un passaggio segreto in un vecchio armadio che conduce al magico mondo di Narnia. Lì, dovranno aiutare il maestoso leone Aslan a sconfiggere la Strega Bianca, che ha condannato il regno a un inverno eterno.', '2007', 'cronache_di_narnia.txt'),
('Cento anni di Solitudine', 'Gabriel Garcia Marquez', '978-8804494276', 'Realismo Magico', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP8hqUcc_q2miAOPg-yVv2GivfAKLVmYxHjA&s', 'L''epopea della famiglia Buendía nella città immaginaria di Macondo. Attraverso sette generazioni, il romanzo mescola realtà e magia per raccontare la storia della Colombia, esplorando la solitudine, l''amore, la guerra e l''ineluttabilità del destino circolare.', '2008', 'Cento_Anni_di_Solitudine.txt'),
('Fahrenheit 451', 'Ray Bradbury', '978-8804683074', 'Distopico', 'https://m.media-amazon.com/images/I/61uRn2XO9QL._AC_UF1000,1000_QL80_.jpg', 'In un futuro inquietante dove possedere libri è reato e il pensiero critico è soppresso, i pompieri hanno il compito di appiccare incendi per bruciare la carta stampata. Il pompiere Guy Montag inizia a mettere in discussione il suo ruolo e la società vuota in cui vive dopo aver incontrato una ragazza anticonformista.', '2009', 'Fahrenheit_451.txt'),
('Il Piccolo Principe', 'Antoine de Saint-Exupéry', '978-8845292279', 'Favola', 'https://m.media-amazon.com/images/I/61XaPkL2EKL.jpg', 'Un pilota precipitato nel deserto del Sahara incontra un giovane principe proveniente da un asteroide lontano. Attraverso i racconti dei suoi viaggi tra i pianeti, il bambino offre profonde e poetiche riflessioni sull''amicizia, l''amore e sul "vedere col cuore" ciò che è invisibile agli occhi.', '2010', 'Il_Piccolo_Principe.txt'),
('Il Nome della Rosa', 'Umberto Eco', '978-8845290688', 'Giallo Storico', 'https://m.media-amazon.com/images/I/61Aa9Yic8AL._AC_UF1000,1000_QL80_.jpg', 'In un''abbazia medievale italiana isolata sulle Alpi, il frate Guglielmo da Baskerville e il suo novizio Adso indagano su una serie di misteriosi e macabri delitti. Un giallo storico che si intreccia con dispute teologiche e l''accesso a una biblioteca labirintica e proibita.', '2011', 'Il_Nome_della_Rosa.txt'),
('L''alchimista', 'Paulo Coelho', '978-8878187884', 'Narrativa Esoterica', 'https://m.media-amazon.com/images/I/91rF1lW1oRL._UF1000,1000_QL80_.jpg', 'Il viaggio mistico del giovane pastore andaluso Santiago, che lascia il suo gregge per inseguire un sogno ricorrente che lo guida verso un tesoro nascosto ai piedi delle Piramidi d''Egitto. Lungo il cammino, imparerà ad ascoltare il proprio cuore e a decifrare i segnali del destino.', '2012', 'L_alchimista.txt'),
('Don Chisciotte della Mancia', 'Miguel de Cervantes', '978-8804677844', 'Classici', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs9drnYCFoeSdimqkpCV45OQbXYWf5332qng&s', 'Le tragicomiche avventure di un hidalgo spagnolo che, impazzito per le troppe letture cavalleresche, decide di farsi cavaliere errante. Accompagnato dal fedele scudiero Sancho Panza, scambia mulini a vento per giganti e locande per castelli, in una lotta tra l''idealismo e realtà.', '2013', 'Don_Chisciotte_della_Mancha.txt');

INSERT OR IGNORE INTO libraries 
(name, address, city, province, librarian_id, cover_url) VALUES
('Biblioteca Centrale della Regione Siciliana “A. Bombace”', 'Via Vittorio Emanuele, 429', 'Palermo', 'PA', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCslfEf-6IHYB4xEDF8jpeaPJXFroma2tXg&s'),
('Biblioteca Comunale di Palermo Leonardo Sciascia (Casa Professa)', 'Piazzetta Brunaccini, 2', 'Palermo', 'PA', NULL, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/99/94/1c/caption.jpg?w=1200&h=-1&s=1'),
('Biblioteca Comunale Borgo Nuovo', 'Via Largo Pozzillo, 7', 'Palermo', 'PA', NULL, 'https://www.esperienzeconilsud.it/openlibrary/wp-content/uploads/sites/376/2025/03/WhatsApp-Image-2025-03-19-at-13.00.06-3-.jpeg'),
('Biblioteca Centrale della Facoltà di Agraria', 'Piazza Delle Cliniche, 2', 'Palermo', 'PA', NULL, 'https://biblio.unipd.it/biblioteche/agripolis/@@images/image-1200-735bb42cad85a09d99ce9e4315f5ae4d.jpeg'),
('Biblioteca Comunale - Palazzo Ziino', 'Via Dante, 53', 'Palermo', 'PA', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTGQ7dKRkBwCvgkFfBgmxuWsck9PMtQPClQw&s'),
('Biblioteca Civica Pallavicino', 'Via Giuseppe Spata, 10', 'Palermo', 'PA', NULL, 'https://parmawelcome.it/wp-content/uploads/2025/01/Biblioteca-civica-interno.jpg'),
('Biblioteca Civica dei Ragazzi', 'Cortile Scalilla', 'Palermo', 'PA', NULL, 'https://bibliotecagambalunga.it/sites/default/files/inline-images/foto_estivo.jpg'),
('Biblioteca Civica Multimediale Villa Trabia', 'Via Salinas, 3', 'Palermo', 'PA', NULL, 'https://turismo.comune.palermo.it/js/server/uploads/luoghi/213x104/_12042019122006.jpg'),
('Biblioteca Privata Itinerante “Pietro Tramonte”', 'Monte Santa Rosalia 18/19', 'Palermo', 'PA', NULL, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEie09TME83LScB6vDwm84bryRzC3TdVuxhi61sS0Ww9Xnw8rIWBRSkk68Gae2ZW_3cDoOvf9a8FYFC8Ilgs0pNG8LOACOpY79c1GyWov0tsv_bSEOOdLTgfuK_XhL91tqFgP6XCYo3h7t_V/s1600/20181205_153523.jpg'),
('Biblioteca Francescana', 'Via del Parlamento, 32', 'Palermo', 'PA', NULL, 'https://www.balarm.it/cache/9/a/d/3/3/9ad3352c03426e6c141409c7f8ef8a9da8291b02-biblioteca-francescana-jpg-614-1487160989.jpeg');
