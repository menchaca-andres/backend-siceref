-- *****************
-- *    TABLES     *
-- *****************

DROP TABLE IF EXISTS ROL_PERM;
DROP TABLE IF EXISTS MASCOTAS;
DROP TABLE IF EXISTS RAZAS;
DROP TABLE IF EXISTS ESPECIES;
DROP TABLE IF EXISTS USUARIOS;
DROP TABLE IF EXISTS REFUGIOS;
DROP TABLE IF EXISTS PERMISOS;
DROP TABLE IF EXISTS ROLES;

-- ROLES
CREATE TABLE ROLES (
    id_rol serial PRIMARY KEY,
    codigo varchar(50) NOT NULL UNIQUE,
    nom_rol varchar(50) NOT NULL,
    descrip_rol text NOT NULL
);

-- PERMISOS
CREATE TABLE PERMISOS (
    id_per serial PRIMARY KEY,
    codigo varchar(80) NOT NULL UNIQUE,
    nombre varchar(50) NOT NULL
);

-- ROL_PERM
CREATE TABLE ROL_PERM (
    id_rol int NOT NULL,
    id_per int NOT NULL,
    CONSTRAINT ROL_PERM_pk PRIMARY KEY (id_rol, id_per),
    CONSTRAINT ROL_PERM_ROLES_fk FOREIGN KEY (id_rol) REFERENCES ROLES (id_rol),
    CONSTRAINT ROL_PERM_PERMISOS_fk FOREIGN KEY (id_per) REFERENCES PERMISOS (id_per)
);

-- REFUGIOS
CREATE TABLE REFUGIOS (
    id_ref serial PRIMARY KEY,
    nom_ref varchar(80) NOT NULL,
    direc_ref varchar(150) NOT NULL,
    telef_ref varchar(20) NOT NULL,
    email_ref varchar(80) NOT NULL UNIQUE,
    estado_ref boolean NOT NULL DEFAULT true
);

-- USUARIOS
CREATE TABLE USUARIOS (
    id_usu serial PRIMARY KEY,
    nom_usu varchar(80) NOT NULL,
    apell_usu varchar(80) NOT NULL,
    fecnac_usu date NOT NULL,
    numcel_usu varchar(20) NOT NULL,
    email_usu varchar(80) NOT NULL UNIQUE,
    pass_usu text NOT NULL,
    id_rol int NOT NULL,
    id_ref int NULL,
    CONSTRAINT USUARIOS_ROLES_fk FOREIGN KEY (id_rol) REFERENCES ROLES (id_rol),
    CONSTRAINT USUARIOS_REFUGIOS_fk FOREIGN KEY (id_ref) REFERENCES REFUGIOS (id_ref)
);

-- ESPECIES
CREATE TABLE ESPECIES (
    id_esp serial PRIMARY KEY,
    nom_esp varchar(50) NOT NULL
);

-- RAZAS
CREATE TABLE RAZAS (
    id_raza serial PRIMARY KEY,
    nom_raza varchar(50) NOT NULL,
    id_esp int NOT NULL,
    CONSTRAINT RAZAS_ESPECIES_fk FOREIGN KEY (id_esp) REFERENCES ESPECIES (id_esp)
);

-- MASCOTAS
CREATE TABLE MASCOTAS (
    id_ani serial PRIMARY KEY,
    nom_mascot varchar(80) NOT NULL,
    fechanac_mascot date NOT NULL,
    esteril_mascot boolean NOT NULL,
    sexo_mascot varchar(10) NOT NULL,
    caract_mascot text NOT NULL,
    fechaing_mascot date NOT NULL DEFAULT CURRENT_DATE,
    id_raza int NOT NULL,
    CONSTRAINT MASCOTAS_RAZAS_fk FOREIGN KEY (id_raza) REFERENCES RAZAS (id_raza)
);

-- *****************
-- *    SELECTS    *
-- *****************

SELECT * FROM roles;
SELECT * FROM permisos;
SELECT * FROM rol_perm;
SELECT * FROM usuarios;
SELECT * FROM refugios;
SELECT * FROM razas;
SELECT * FROM especies;
SELECT * FROM mascotas;

-- *****************
-- *    INSERTS    *
-- *****************

-- ROLES
INSERT INTO roles (codigo, nom_rol, descrip_rol) VALUES
('admin-sistema', 'Administrador del sistema', 'Gestiona todo el sistema'),
('admin-refugio', 'Administrador del refugio', 'Gestiona un refugio y su equipo'),
('trabajador-refugio', 'Trabajador del refugio', 'Gestiona datos operativos del refugio'),
('adoptante', 'Adoptante', 'Usuario que puede gestionar su propio perfil');

-- PERMISOS
INSERT INTO permisos (codigo, nombre) VALUES
('usuarios:crear', 'Crear usuarios'),
('usuarios:obtener', 'Obtener usuarios'),
('usuarios:modificar', 'Modificar usuarios'),
('usuarios:eliminar', 'Eliminar usuarios'),
('roles:crear', 'Crear roles'),
('roles:obtener', 'Obtener roles'),
('roles:modificar', 'Modificar roles'),
('roles:eliminar', 'Eliminar roles'),
('permisos:crear', 'Crear permisos'),
('permisos:obtener', 'Obtener permisos'),
('permisos:modificar', 'Modificar permisos'),
('permisos:eliminar', 'Eliminar permisos'),
('refugios:crear', 'Crear refugios'),
('refugios:obtener', 'Obtener refugios'),
('refugios:modificar', 'Modificar refugios'),
('refugios:eliminar', 'Eliminar refugios'),
('refugio:obtener:propio', 'Obtener refugio propio'),
('refugio:modificar:propio', 'Modificar refugio propio'),
('mascotas:crear', 'Crear mascotas'),
('mascotas:obtener', 'Obtener mascotas'),
('mascotas:modificar', 'Modificar mascotas'),
('mascotas:eliminar', 'Eliminar mascotas'),
('razas:crear', 'Crear razas'),
('razas:obtener', 'Obtener razas'),
('razas:modificar', 'Modificar razas'),
('razas:eliminar', 'Eliminar razas'),
('especies:crear', 'Crear especies'),
('especies:obtener', 'Obtener especies'),
('especies:modificar', 'Modificar especies'),
('especies:eliminar', 'Eliminar especies'),
('perfil:obtener', 'Obtener perfil propio'),
('perfil:modificar', 'Modificar perfil propio'),
('perfil:eliminar', 'Eliminar perfil propio'),
('trabajadores:obtener', 'Obtener trabajadores'),
('trabajadores:crear', 'Crear trabajadores'),
('admins-sistema:crear', 'Crear administradores del sistema'),
('admins-refugio:crear', 'Crear administradores del refugio');

-- PERMISOS DEL ADMINISTRADOR DEL SISTEMA
INSERT INTO rol_perm (id_rol, id_per)
SELECT r.id_rol, p.id_per
FROM roles r
CROSS JOIN permisos p
WHERE r.codigo = 'admin-sistema';

-- PERMISOS DEL ADMINISTRADOR DEL REFUGIO
INSERT INTO rol_perm (id_rol, id_per)
SELECT r.id_rol, p.id_per
FROM roles r
JOIN permisos p ON p.codigo IN (
    'perfil:obtener',
    'perfil:modificar',
    'refugio:obtener:propio',
    'refugio:modificar:propio',
    'mascotas:crear',
    'mascotas:obtener',
    'mascotas:modificar',
    'mascotas:eliminar',
    'razas:crear',
    'razas:obtener',
    'razas:modificar',
    'razas:eliminar',
    'especies:crear',
    'especies:obtener',
    'especies:modificar',
    'especies:eliminar',
    'trabajadores:obtener',
    'trabajadores:crear'
)
WHERE r.codigo = 'admin-refugio';

-- PERMISOS DEL TRABAJADOR DEL REFUGIO
INSERT INTO rol_perm (id_rol, id_per)
SELECT r.id_rol, p.id_per
FROM roles r
JOIN permisos p ON p.codigo IN (
    'perfil:obtener',
    'perfil:modificar',
    'mascotas:crear',
    'mascotas:obtener',
    'mascotas:modificar',
    'mascotas:eliminar',
    'razas:crear',
    'razas:obtener',
    'razas:modificar',
    'razas:eliminar',
    'especies:crear',
    'especies:obtener',
    'especies:modificar',
    'especies:eliminar'
)
WHERE r.codigo = 'trabajador-refugio';

-- PERMISOS DEL ADOPTANTE
INSERT INTO rol_perm (id_rol, id_per)
SELECT r.id_rol, p.id_per
FROM roles r
JOIN permisos p ON p.codigo IN (
    'perfil:obtener',
    'perfil:modificar',
    'perfil:eliminar'
)
WHERE r.codigo = 'adoptante';

-- ESPECIES
INSERT INTO especies (nom_esp) VALUES
('Perro'),
('Gato'),
('Conejo'),
('Ave');

-- RAZAS
INSERT INTO razas (id_esp, nom_raza) VALUES
(1, 'Labrador'),
(1, 'Golden Retriever'),
(1, 'Bulldog'),
(1, 'Pastor Aleman'),
(1, 'Chihuahua'),
(2, 'Persa'),
(2, 'Siames'),
(2, 'Maine Coon'),
(2, 'Bengali'),
(3, 'Holandes'),
(3, 'Angora'),
(4, 'Canario'),
(4, 'Periquito');

-- REFUGIOS
INSERT INTO refugios (nom_ref, direc_ref, telef_ref, email_ref, estado_ref) VALUES
('Refugio Esperanza', 'Av. Los Pinos 123, La Paz', '77712345', 'esperanza@gmail.com', true),
('Huellitas Felices', 'Calle Murillo 456, La Paz', '77798765', 'huellitas@gmail.com', true),
('Patitas al Hogar', 'Av. Arce 789, La Paz', '77756789', 'patitas@gmail.com', true);

-- USUARIOS
-- Password de ejemplo bcrypt para "password": $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO usuarios (nom_usu, apell_usu, fecnac_usu, numcel_usu, email_usu, pass_usu, id_rol, id_ref) VALUES
('Carlos', 'Mamani', '1990-05-15', '77711111', 'superadmin@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL),
('Ana', 'Quispe', '1992-04-10', '77722222', 'admin.refugio@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1),
('Luis', 'Choque', '1995-08-20', '77733333', 'trabajador@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1),
('Maria', 'Flores', '1998-11-05', '77744444', 'adoptante@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, NULL);

-- MASCOTAS
INSERT INTO mascotas (id_raza, nom_mascot, fechanac_mascot, esteril_mascot, sexo_mascot, caract_mascot, fechaing_mascot) VALUES
(1, 'Max', '2022-03-10', false, 'Macho', 'Perro muy jugueton y amigable, le encanta correr', CURRENT_DATE),
(2, 'Luna', '2023-06-15', false, 'Hembra', 'Cachorra golden muy carinosa y tranquila', CURRENT_DATE),
(3, 'Rocky', '2021-09-20', true, 'Macho', 'Bulldog tranquilo, ideal para apartamentos', CURRENT_DATE),
(4, 'Rex', '2019-04-22', true, 'Macho', 'Pastor aleman leal y protector', CURRENT_DATE),
(5, 'Tito', '2022-11-08', false, 'Macho', 'Chihuahua pequeno pero con mucha energia', CURRENT_DATE),
(6, 'Mishi', '2020-12-05', true, 'Hembra', 'Gata persa muy elegante y calmada', CURRENT_DATE),
(7, 'Nala', '2022-08-18', false, 'Hembra', 'Gata siamesa muy activa y sociable', CURRENT_DATE),
(8, 'Leon', '2021-05-30', true, 'Macho', 'Maine Coon grande y muy carinoso', CURRENT_DATE),
(10, 'Bunny', '2023-11-01', false, 'Hembra', 'Conejo holandes muy curioso y tierno', CURRENT_DATE),
(12, 'Pio', '2021-07-14', false, 'Macho', 'Canario con hermoso canto, muy alegre', CURRENT_DATE),
(13, 'Kiwi', '2022-09-25', false, 'Macho', 'Periquito colorido y muy sociable con las personas', CURRENT_DATE);
