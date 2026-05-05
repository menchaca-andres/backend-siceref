-- *****************
-- *    TABLES     *
-- *****************

-- REFUGIOS
CREATE TABLE REFUGIOS (
    id_refug serial  NOT NULL,
    nom_refug varchar(80)  NOT NULL,
    dir_refug varchar(200)  NOT NULL,
    telf_refug varchar(12)  NOT NULL,
    corr_refug varchar(100)  NOT NULL,
    contra_refug varchar(12)  NOT NULL,
    licencia_refug varchar(200)  NOT NULL,
    CONSTRAINT REFUGIOS_pk PRIMARY KEY (id_refug)
);

-- ROLES
CREATE TABLE ROLES (
    id_rol serial PRIMARY KEY NOT NULL,
    nom_rol varchar(50)  NOT NULL
);

-- USUARIOS
CREATE TABLE USUARIOS (
    id_usuario serial PRIMARY KEY NOT NULL,
    id_rol int  NOT NULL,
	id_refug int NULL,
    telf_usuario varchar(20) NULL,
    corr_usuario varchar(100)  NOT NULL,
    contra_usuario text  NOT NULL,
    nom_usuario varchar(80)  NOT NULL,
    apell_usuario varchar(80)  NOT NULL,
    fenac_usuario date  NOT NULL,
    gen_usuario boolean  NOT NULL,
    direc_usuario text NULL
);

-- ESPECIES
CREATE TABLE ESPECIES (
    id_espe serial PRIMARY KEY NOT NULL,
    nom_espe varchar(50)  NOT NULL
);

-- RAZAS
CREATE TABLE RAZAS (
    id_raza serial PRIMARY KEY NOT NULL,
    id_espe int  NOT NULL,
    nom_raza varchar(50) NULL
);

-- MASCOTAS
CREATE TABLE MASCOTAS (
    id_mascot serial PRIMARY KEY NOT NULL,
    id_raza int  NOT NULL,
    img_mascot text  NOT NULL,
    nom_mascot varchar(80)  NOT NULL,
    edad_mascot int NULL,
    fenac_mascot date NULL,
    descrip_mascot text  NOT NULL,
    gen_mascot boolean  NOT NULL,
    esterilizado boolean  NOT NULL
);

-- REFERENCES

ALTER TABLE USUARIOS ADD CONSTRAINT USUARIOS_REFUGIOS
    FOREIGN KEY (id_refug)
    REFERENCES REFUGIOS (id_refug)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

ALTER TABLE USUARIOS ADD CONSTRAINT USUARIOS_ROLES
    FOREIGN KEY (id_rol)
    REFERENCES ROLES (id_rol)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

ALTER TABLE RAZAS ADD CONSTRAINT RAZAS_ESPECIES
    FOREIGN KEY (id_espe)
    REFERENCES ESPECIES (id_espe)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

ALTER TABLE MASCOTAS ADD CONSTRAINT MASCOTAS_RAZAS
    FOREIGN KEY (id_raza)
    REFERENCES RAZAS (id_raza)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- INSERTS

-- ROLES
INSERT INTO ROLES (nom_rol) VALUES
('Superadmin'),
('Administrador Refugio'),
('Trabajador Refugio'),
('Adoptante');

SELECT * FROM ROLES;
DELETE FROM ROLES;

-- ESPECIES
INSERT INTO ESPECIES (nom_espe) VALUES
('Perro'),
('Gato'),
('Conejo'),
('Ave');

-- RAZAS
INSERT INTO RAZAS (id_espe, nom_raza) VALUES
(1, 'Labrador'),
(1, 'Golden Retriever'),
(1, 'Bulldog'),
(1, 'Pastor Alemán'),
(1, 'Chihuahua'),
(2, 'Persa'),
(2, 'Siamés'),
(2, 'Maine Coon'),
(2, 'Bengalí'),
(3, 'Holandés'),
(3, 'Angora'),
(4, 'Canario'),
(4, 'Periquito');

-- REFUGIOS
INSERT INTO REFUGIOS (nom_refug, dir_refug, telf_refug, corr_refug, contra_refug, licencia_refug) VALUES
('Refugio Esperanza', 'Av. Los Pinos 123, La Paz', '77712345', 'esperanza@gmail.com', 'refug123', 'LIC-001-2024'),
('Huellitas Felices', 'Calle Murillo 456, La Paz', '77798765', 'huellitas@gmail.com', 'refug456', 'LIC-002-2024'),
('Patitas al Hogar', 'Av. Arce 789, La Paz', '77756789', 'patitas@gmail.com', 'refug789', 'LIC-003-2024');

-- USUARIOS (administrador y refugios con id_refug, adoptantes sin refugio)
INSERT INTO USUARIOS (id_rol, id_refug, telf_usuario, corr_usuario, contra_usuario, nom_usuario, apell_usuario, fenac_usuario, gen_usuario, direc_usuario) VALUES
-- Superadmin
(1, NULL, '77711111', 'superadmin@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos',  'Mamani',  '1990-05-15', true,  'Av. 6 de Agosto 100, La Paz');

SELECT * FROM USUARIOS;
DELETE FROM USUARIOS;

-- MASCOTAS
INSERT INTO MASCOTAS (id_raza, img_mascot, nom_mascot, edad_mascot, fenac_mascot, descrip_mascot, gen_mascot, esterilizado) VALUES
(1,  'labrador1.jpg',  'Max',   2, '2022-03-10', 'Perro muy juguetón y amigable, le encanta correr',    true,  false),
(2,  'golden1.jpg',    'Luna',  1, '2023-06-15', 'Cachorra golden muy cariñosa y tranquila',             false, false),
(3,  'bulldog1.jpg',   'Rocky', 3, '2021-09-20', 'Bulldog tranquilo, ideal para apartamentos',           true,  true),
(4,  'pastor1.jpg',    'Rex',   5, '2019-04-22', 'Pastor alemán leal y protector',                       true,  true),
(5,  'chihuahua1.jpg', 'Tito',  2, '2022-11-08', 'Chihuahua pequeño pero con mucha energía',             true,  false),
(6,  'persa1.jpg',     'Mishi', 4, '2020-12-05', 'Gata persa muy elegante y calmada',                    false, true),
(7,  'siames1.jpg',    'Nala',  2, '2022-08-18', 'Gata siamesa muy activa y sociable',                   false, false),
(8,  'maincoon1.jpg',  'León',  3, '2021-05-30', 'Maine Coon grande y muy cariñoso',                     true,  true),
(10, 'holandes1.jpg',  'Bunny', 1, '2023-11-01', 'Conejo holandés muy curioso y tierno',                 false, false),
(12, 'canario1.jpg',   'Pío',   3, '2021-07-14', 'Canario con hermoso canto, muy alegre',                true,  false),
(13, 'periquito1.jpg', 'Kiwi',  2, '2022-09-25', 'Periquito colorido y muy sociable con las personas',   true,  false);