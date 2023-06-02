USE sample_api;
CREATE TABLE product (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sku INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    status TINYINT DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME
);
DESC product;
SELECT * FROM product;

SELECT * FROM product WHERE status != 2;