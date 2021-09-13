BEGIN;

DROP TABLE IF EXISTS newspapers, newspaper_pages, overlay_coords, admins, publishers CASCADE;

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

CREATE TABLE newspaper_pages(
    id SERIAL PRIMARY KEY,  
    newspaper_id INTEGER REFERENCES newspapers(id),
    page_number INTEGER,
    name VARCHAR(255) 
);

INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '1', 'HAREEAT_page_1');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '2', 'HAREEAT_page_2');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '3', 'HAREEAT_page_3');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '4', 'HAREEAT_page_4');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '5', 'HAREEAT_page_5');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '6', 'HAREEAT_page_6');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '7', 'HAREEAT_page_7');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '8', 'HAREEAT_page_8');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '9', 'HAREEAT_page_9');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '10', 'HAREEAT_page_10');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '11', 'HAREEAT_page_11');
INSERT INTO newspaper_pages (newspaper_id, page_number, name) VALUES ('1', '12', 'HAREEAT_page_12');


CREATE TABLE overlay_coords(
    id SERIAL PRIMARY KEY,  
    newspaper_id INTEGER REFERENCES newspapers(id),
    coords TEXT
);
-- INSERT INTO overlay_coords (newspaper_id,coords) VALUES ('1','[{"x":4756.60681369538,"y":330.51214148731304,"width":378.2821562709105,"height":287.21052721097345,"degrees":0},{"x":5330.046355699557,"y":32.4140969014465,"width":176.0542458985219,"height":412.9440855428983,"degrees":0},{"x":5503.883110580155,"y":454.2190584381016,"width":185.9329866218177,"height":343.8565170254213,"degrees":0}]');

CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at DATE DEFAULT CURRENT_TIMESTAMP
);


COMMIT;