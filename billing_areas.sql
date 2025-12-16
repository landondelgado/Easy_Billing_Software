CREATE TABLE billing_areas (
    billing_area_id SERIAL PRIMARY KEY,
    area_name TEXT NOT NULL UNIQUE
);

INSERT INTO billing_areas (area_name) VALUES
('Lubbock'),
('New Mexico'),
('Amarillo');