BEGIN;

DROP TABLE IF EXISTS newspapers, newspaper_pages, overlay_coords ,admins CASCADE;

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

create table admins (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255),
	password VARCHAR(255)
);

-- insert into admins ( email, password) values ( 'lib@web.com', '123');

COMMIT;