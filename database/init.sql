-- Création de la base de données
CREATE DATABASE IF NOT EXISTS overtime_db;
USE overtime_db;

-- Table des employés
CREATE TABLE IF NOT EXISTS employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    poste VARCHAR(100) NOT NULL
);

-- Table des tarifs
CREATE TABLE IF NOT EXISTS tarifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_jour ENUM('weekend', 'jour ordinaire') NOT NULL,
    tarif DECIMAL(10,2) NOT NULL
);

-- Table des heures supplémentaires
CREATE TABLE IF NOT EXISTS heures_sup (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employe_id INT NOT NULL,
    date DATE NOT NULL,
    nb_heures DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE CASCADE
);

-- Insertion des données de test pour les employés
INSERT INTO employes (nom, prenom, poste) VALUES
('Dupont', 'Jean', 'Développeur'),
('Martin', 'Marie', 'Designer'),
('Bernard', 'Pierre', 'Chef de projet'),
('Petit', 'Sophie', 'Développeur'),
('Robert', 'Lucas', 'Designer');

-- Insertion des tarifs
INSERT INTO tarifs (type_jour, tarif) VALUES
('jour ordinaire', 25.00),
('weekend', 35.00);

-- Insertion des heures supplémentaires
INSERT INTO heures_sup (employe_id, date, nb_heures) VALUES
-- Heures pour Jean Dupont (ID: 1)
(1, '2024-03-15', 2.5),  -- Vendredi (jour ordinaire)
(1, '2024-03-16', 4.0),  -- Samedi (weekend)
(1, '2024-03-17', 3.0),  -- Dimanche (weekend)
(1, '2024-03-18', 2.0),  -- Lundi (jour ordinaire)

-- Heures pour Marie Martin (ID: 2)
(2, '2024-03-15', 3.0),  -- Vendredi (jour ordinaire)
(2, '2024-03-16', 5.0),  -- Samedi (weekend)
(2, '2024-03-19', 2.5),  -- Mardi (jour ordinaire)

-- Heures pour Pierre Bernard (ID: 3)
(3, '2024-03-17', 4.0),  -- Dimanche (weekend)
(3, '2024-03-20', 3.0),  -- Mercredi (jour ordinaire)
(3, '2024-03-21', 2.0);  -- Jeudi (jour ordinaire) 