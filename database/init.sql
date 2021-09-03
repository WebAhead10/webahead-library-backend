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

-- INSERT INTO admins (email , password) VALUES ('librarian@example.com' , '$2b$12$dc1CMMpXRv1giih./ccEgOzaWD/rE2apJOLs7bxDXd7SXWzGhUv5S');

COMMIT;