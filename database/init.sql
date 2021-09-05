BEGIN;

DROP TABLE IF EXISTS newspapers, newspaper_pages, overlay_coords, admins, publishers CASCADE;

CREATE TABLE publishers (  
    id SERIAL PRIMARY KEY,  
    name VARCHAR(255) UNIQUE,
    logo VARCHAR(500) UNIQUE
);

INSERT INTO publishers (name, logo) VALUES ('aljazera', 'somelink.com');
INSERT INTO publishers (name, logo) VALUES ('haarz', 'url.com');

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
    newspaper_id INTEGER REFERENCES newspapers(id)
);

CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at DATE DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO admins (email , password) VALUES ('librarian@example.com' , '$2b$12$dc1CMMpXRv1giih./ccEgOzaWD/rE2apJOLs7bxDXd7SXWzGhUv5S');

COMMIT;