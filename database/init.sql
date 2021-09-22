BEGIN;

DROP TABLE IF EXISTS newspapers, newspaper_pages, overlay_coords, admins, publishers, tags, newspaper_tags CASCADE;

CREATE TABLE publishers (  
    id SERIAL PRIMARY KEY,  
    name VARCHAR(255) UNIQUE,
    logo VARCHAR(500) UNIQUE
);
 
INSERT INTO publishers (name, logo) VALUES ('فلسطين', 'https://www.maan-ctr.org/magazine/files/image/photos/issue117/topics/5/4.jpg');
INSERT INTO publishers (name, logo) VALUES ('הארץ', 'https://cameraoncampus.org/wp-content/uploads/2017/06/Haaretz.jpg');
INSERT INTO publishers (name, logo) VALUES ('حيفا نت', 'https://haifanet.co.il/wp-content/themes/haifanet/inc/images/logo.png');
INSERT INTO publishers (name, logo) VALUES ('الفجر', 'https://aqlam-moqawema.org/wp-content/uploads/2021/06/%D8%B5%D8%AD%D8%A7%D9%81%D8%A9.gif');
INSERT INTO publishers (name, logo) VALUES ('الجزيرة', 'http://www.wasmenia.com/wp-content/uploads/2017/11/Al-Jazirah-01.svg');

CREATE TABLE newspapers(
    id SERIAL UNIQUE,  
    published_date DATE,
    publisher_id INTEGER,  
    CONSTRAINT fk_publisher FOREIGN KEY(publisher_id) REFERENCES publishers(id),
    PRIMARY KEY(
        publisher_id,
        published_date
    )
);

INSERT INTO newspapers (published_date, publisher_id) VALUES ('2021-09-05', '2');
INSERT INTO newspapers (published_date, publisher_id) VALUES ('1924-02-02', '1');

CREATE TABLE newspaper_pages(
    id SERIAL PRIMARY KEY,  
    newspaper_id INTEGER REFERENCES newspapers(id),
    page_number INTEGER,
    name VARCHAR(255) 
);

INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES 
('1', '1', 'HAREEAT_page_1'),
('1', '2', 'HAREEAT_page_2'),
('1', '3', 'HAREEAT_page_3'),
('1', '4', 'HAREEAT_page_4'),
('1', '5', 'HAREEAT_page_5'),
('1', '6', 'HAREEAT_page_6'),
('1', '7', 'HAREEAT_page_7'),
('1', '8', 'HAREEAT_page_8'),
('1', '9', 'HAREEAT_page_9'),
('1', '10', 'HAREEAT_page_10'),
('1', '11', 'HAREEAT_page_11'),
('1', '12', 'HAREEAT_page_12');

INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES 
('2', '14', '1924-02-02-publisherId-1-84626c0f-cca0-4aed-9f28-16a400ed11ad_page_1'),
('2', '15', '1924-02-02-publisherId-1-84626c0f-cca0-4aed-9f28-16a400ed11ad_page_2'),
('2', '16', '1924-02-02-publisherId-1-84626c0f-cca0-4aed-9f28-16a400ed11ad_page_3'),
('2', '17', '1924-02-02-publisherId-1-84626c0f-cca0-4aed-9f28-16a400ed11ad_page_4'),
('2', '18', '1924-02-02-publisherId-1-84626c0f-cca0-4aed-9f28-16a400ed11ad_page_5'),
('2', '19', '1924-02-02-publisherId-1-84626c0f-cca0-4aed-9f28-16a400ed11ad_page_6');


CREATE TABLE overlay_coords(
    id SERIAL PRIMARY KEY,  
    newspaper_id INTEGER REFERENCES newspapers(id),
    coords TEXT,
    content TEXT 
);

CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR(255)
);

CREATE TABLE newspaper_tags(
    id SERIAL PRIMARY KEY,
    newspaper_id VARCHAR(255),
    tag_id INTEGER REFERENCES tags(id)
);

COMMIT;