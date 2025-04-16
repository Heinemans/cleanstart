-- Create accommodation_types table
CREATE TABLE IF NOT EXISTS accommodation_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert some default accommodation types
INSERT INTO accommodation_types (name) VALUES 
  ('Bungalow'),
  ('Tentplaats'),
  ('Hotel'),
  ('Vakantiehuis'),
  ('Camping'),
  ('Bungalowpark'),
  ('Anders');

-- Update vacation_addresses table to include accommodation_type_id
ALTER TABLE vacation_addresses 
ADD COLUMN accommodation_type_id INT,
ADD CONSTRAINT fk_accommodation_type 
FOREIGN KEY (accommodation_type_id) REFERENCES accommodation_types(id); 