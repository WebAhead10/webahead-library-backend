BEGIN;

DROP TABLE IF EXISTS newspapers, newspaper_pages, overlays, admins, publishers, 
tags, document_tag, overlay_tag CASCADE;

CREATE TABLE publishers (  
    id SERIAL PRIMARY KEY,  
    name VARCHAR(255) UNIQUE,
    logo VARCHAR(500) UNIQUE
);
 
INSERT INTO publishers (name, logo) VALUES ('فلسطين', 'https://www.maan-ctr.org/magazine/files/image/photos/issue117/topics/5/4.jpg');
INSERT INTO publishers (name, logo) VALUES ('حيفا نت', 'https://haifanet.co.il/wp-content/themes/haifanet/inc/images/logo.png');
INSERT INTO publishers (name, logo) VALUES ('الفجر', 'https://aqlam-moqawema.org/wp-content/uploads/2021/06/%D8%B5%D8%AD%D8%A7%D9%81%D8%A9.gif');
INSERT INTO publishers (name, logo) VALUES ('الجزيرة', 'http://www.wasmenia.com/wp-content/uploads/2017/11/Al-Jazirah-01.svg');
INSERT INTO publishers (name, logo) VALUES ('القدس', 'https://cdn.pixabay.com/photo/2017/07/10/19/12/al-quds-2491115_960_720.png');

CREATE TABLE newspapers(
    id SERIAL UNIQUE,  
    published_date DATE,
    publisher_id INTEGER,
    newspaper_key TEXT UNIQUE
    -- CONSTRAINT fk_publisher FOREIGN KEY(publisher_id) REFERENCES publishers(id),
    -- PRIMARY KEY(
    --     publisher_id,
    --     published_date
    -- )
);

INSERT INTO newspapers (published_date, publisher_id, newspaper_key) VALUES ('1914-03-17', '5', '1635708989964-a3f05967-3bd0-44fd-9e17-a1820bdfbf24');

CREATE TABLE newspaper_pages(
    id SERIAL PRIMARY KEY,  
    newspaper_id INTEGER REFERENCES newspapers(id),
    page_number INTEGER,
    name VARCHAR(255) 
);


INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES 
('1', '1', '1635708989964-a3f05967-3bd0-44fd-9e17-a1820bdfbf24_page_1'),
('1', '2', '1635708989964-a3f05967-3bd0-44fd-9e17-a1820bdfbf24_page_2'),
('1', '3', '1635708989964-a3f05967-3bd0-44fd-9e17-a1820bdfbf24_page_3'),
('1', '4', '1635708989964-a3f05967-3bd0-44fd-9e17-a1820bdfbf24_page_4');


CREATE TABLE overlays (
    id SERIAL PRIMARY KEY,  
    document_id INTEGER REFERENCES newspapers(id),
    coords TEXT,
    content TEXT 
);

CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(255) UNIQUE
);

CREATE TABLE document_tag (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(255),
    tag_id INTEGER REFERENCES tags(id)
);

CREATE TABLE overlay_tag (
    id SERIAL PRIMARY KEY,
    overlay_id VARCHAR(255),
    tag_id INTEGER REFERENCES tags(id)
);

COMMIT;