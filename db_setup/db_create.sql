DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS packaging CASCADE;
DROP TABLE IF EXISTS property CASCADE;
DROP TABLE IF EXISTS category_property CASCADE;
DROP TABLE IF EXISTS item_property CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS professor CASCADE;
DROP TABLE IF EXISTS manager CASCADE;
DROP TABLE IF EXISTS request_workflow CASCADE;
DROP TABLE IF EXISTS request_items CASCADE;

CREATE TABLE category (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE NOT NULL,
	id_parent INT,
	FOREIGN KEY(id_parent) REFERENCES category(id));

CREATE TABLE packaging (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE NOT NULL);

CREATE TABLE item (
	id SERIAL PRIMARY KEY,
	description TEXT NOT NULL,
	image BYTEA NOT NULL,
	total_stock REAL NOT NULL CHECK (total_stock >= 0),
	free_stock REAL NOT NULL CHECK (free_stock >= 0),
	last_price REAL NOT NULL CHECK (last_price > 0),
	location TEXT,
	user_comments TEXT,
	details TEXT,
	manufacturer TEXT NOT NULL,
	reference TEXT UNIQUE NOT NULL,
	packaging_id INT,
	category_id INT NOT NULL,
	last_edit TIMESTAMP WITH TIME ZONE NOT NULL,
	FOREIGN KEY(packaging_id) REFERENCES packaging(id),
	FOREIGN KEY(category_id) REFERENCES category(id));

CREATE TABLE property (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE NOT NULL,
	number BOOLEAN NOT NULL,
	unit TEXT);

CREATE TABLE category_property (
	id SERIAL PRIMARY KEY,
	category_id INT NOT NULL,
	property_id INT NOT NULL,
	FOREIGN KEY(category_id) REFERENCES category(id),
	FOREIGN KEY(property_id) REFERENCES property(id));

CREATE TABLE item_property (
	id SERIAL PRIMARY KEY,
	value TEXT NOT NULL,
	item_id INT NOT NULL,
	property_id INT NOT NULL,
	FOREIGN KEY(item_id) REFERENCES item(id),
	FOREIGN KEY(property_id) REFERENCES property(id));

CREATE TABLE permissions (
	id SERIAL PRIMARY KEY,
	name TEXT UNIQUE NOT NULL,
	user_path TEXT NOT NULL,
	can_read BOOLEAN NOT NULL,
	can_request BOOLEAN NOT NULL,
	can_edit BOOLEAN NOT NULL);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	login TEXT UNIQUE,
	password TEXT NOT NULL,
	user_permissions INT NOT NULL,
	FOREIGN KEY(user_permissions) REFERENCES permissions(id));


CREATE TABLE request_workflow (
	id SERIAL PRIMARY KEY,
	date_sent TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	date_cancelled TIMESTAMP WITH TIME ZONE,
	date_professor_evaluated TIMESTAMP WITH TIME ZONE,
	date_manager_evaluated TIMESTAMP WITH TIME ZONE,
	cancelled BOOLEAN NOT NULL,
	professor_accept BOOLEAN,
	manager_accept BOOLEAN,
	purpose TEXT NOT NULL,
	workflow TEXT,
	requester_id INT NOT NULL,
	professor_id INT NOT NULL,
	manager_id INT,
	FOREIGN KEY(requester_id) REFERENCES users(id),
	FOREIGN KEY(professor_id) REFERENCES users(id),
	FOREIGN KEY(manager_id) REFERENCES users(id));

CREATE TABLE request_items (
	id SERIAL PRIMARY KEY,
	request_id INT NOT NULL,
	item_id INT NOT NULL,
	count REAL NOT NULL CHECK (count > 0),
	FOREIGN KEY(request_id) REFERENCES request_workflow(id),
	FOREIGN KEY(item_id) REFERENCES item(id));
