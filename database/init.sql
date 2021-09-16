BEGIN;

DROP TABLE IF EXISTS newspapers, newspaper_pages, overlay_coords, admins;

CREATE TABLE newspapers(
    id SERIAL PRIMARY KEY,  
    name VARCHAR(255) UNIQUE
);

CREATE TABLE newspaper_pages(
    id SERIAL PRIMARY KEY,  
    newspaper_id INTEGER REFERENCES newspapers(id),
    page_number INTEGER,
    name VARCHAR(255) 
);

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