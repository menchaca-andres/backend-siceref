-- CreateEnum
CREATE TYPE "tipo_notificacion" AS ENUM ('MENSAJE_CHAT');

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nom_rol" VARCHAR(50) NOT NULL,
    "descrip_rol" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id_per" SERIAL NOT NULL,
    "codigo" VARCHAR(80) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id_per")
);

-- CreateTable
CREATE TABLE "rol_perm" (
    "id_rol" INTEGER NOT NULL,
    "id_per" INTEGER NOT NULL,

    CONSTRAINT "rol_perm_pkey" PRIMARY KEY ("id_rol","id_per")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usu" SERIAL NOT NULL,
    "img_usu" TEXT,
    "nom_usu" VARCHAR(80) NOT NULL,
    "apell_usu" VARCHAR(80) NOT NULL,
    "fecnac_usu" DATE NOT NULL,
    "numcel_usu" VARCHAR(20) NOT NULL,
    "email_usu" VARCHAR(80) NOT NULL,
    "pass_usu" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_ref" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usu")
);

-- CreateTable
CREATE TABLE "refugios" (
    "id_ref" SERIAL NOT NULL,
    "img_ref" TEXT,
    "nom_ref" VARCHAR(80) NOT NULL,
    "direc_ref" VARCHAR(150) NOT NULL,
    "telef_ref" VARCHAR(20) NOT NULL,
    "email_ref" VARCHAR(80) NOT NULL,
    "estado_ref" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "refugios_pkey" PRIMARY KEY ("id_ref")
);

-- CreateTable
CREATE TABLE "especies" (
    "id_esp" SERIAL NOT NULL,
    "nom_esp" VARCHAR(50) NOT NULL,

    CONSTRAINT "especies_pkey" PRIMARY KEY ("id_esp")
);

-- CreateTable
CREATE TABLE "razas" (
    "id_raza" SERIAL NOT NULL,
    "nom_raza" VARCHAR(50) NOT NULL,
    "id_esp" INTEGER NOT NULL,

    CONSTRAINT "razas_pkey" PRIMARY KEY ("id_raza")
);

-- CreateTable
CREATE TABLE "tamanios" (
    "id_tam" SERIAL NOT NULL,
    "nom_tam" VARCHAR(50) NOT NULL,
    "estado_tam" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tamanios_pkey" PRIMARY KEY ("id_tam")
);

-- CreateTable
CREATE TABLE "mascotas" (
    "id_ani" SERIAL NOT NULL,
    "nom_mascot" VARCHAR(80) NOT NULL,
    "img_mascot" TEXT,
    "fechanac_mascot" DATE NOT NULL,
    "esteril_mascot" BOOLEAN NOT NULL,
    "sexo_mascot" VARCHAR(10) NOT NULL,
    "caract_mascot" TEXT NOT NULL,
    "fechaing_mascot" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hist_mascot" TEXT NOT NULL,
    "id_raza" INTEGER NOT NULL,
    "id_tam" INTEGER NOT NULL,
    "id_ref" INTEGER NOT NULL,

    CONSTRAINT "mascotas_pkey" PRIMARY KEY ("id_ani")
);

-- CreateTable
CREATE TABLE "publicaciones" (
    "id_publi" SERIAL NOT NULL,
    "fechapubli" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estad_publ" BOOLEAN NOT NULL DEFAULT true,
    "id_ani" INTEGER NOT NULL,
    "id_ref" INTEGER NOT NULL,

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id_publi")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_noti" SERIAL NOT NULL,
    "id_destinatario" INTEGER NOT NULL,
    "id_publi" INTEGER,
    "tipo" "tipo_notificacion" NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fecha_noti" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_leida" TIMESTAMP(3),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_noti")
);

-- CreateTable
CREATE TABLE "conversaciones" (
    "id_conv" SERIAL NOT NULL,
    "id_usu" INTEGER NOT NULL,
    "id_responsable" INTEGER,
    "id_publi" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id_conv")
);

-- CreateTable
CREATE TABLE "mensajes_chat" (
    "id_msj" SERIAL NOT NULL,
    "id_conv" INTEGER NOT NULL,
    "id_remitente" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_msj" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mensajes_chat_pkey" PRIMARY KEY ("id_msj")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_codigo_key" ON "roles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_codigo_key" ON "permisos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_usu_key" ON "usuarios"("email_usu");

-- CreateIndex
CREATE UNIQUE INDEX "refugios_email_ref_key" ON "refugios"("email_ref");

-- CreateIndex
CREATE UNIQUE INDEX "tamanios_nom_tam_key" ON "tamanios"("nom_tam");

-- CreateIndex
CREATE UNIQUE INDEX "conversaciones_id_usu_id_publi_key" ON "conversaciones"("id_usu", "id_publi");

-- AddForeignKey
ALTER TABLE "rol_perm" ADD CONSTRAINT "rol_perm_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_perm" ADD CONSTRAINT "rol_perm_id_per_fkey" FOREIGN KEY ("id_per") REFERENCES "permisos"("id_per") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_ref_fkey" FOREIGN KEY ("id_ref") REFERENCES "refugios"("id_ref") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "razas" ADD CONSTRAINT "razas_id_esp_fkey" FOREIGN KEY ("id_esp") REFERENCES "especies"("id_esp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_id_raza_fkey" FOREIGN KEY ("id_raza") REFERENCES "razas"("id_raza") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_id_tam_fkey" FOREIGN KEY ("id_tam") REFERENCES "tamanios"("id_tam") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_id_ref_fkey" FOREIGN KEY ("id_ref") REFERENCES "refugios"("id_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_ani_fkey" FOREIGN KEY ("id_ani") REFERENCES "mascotas"("id_ani") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_ref_fkey" FOREIGN KEY ("id_ref") REFERENCES "refugios"("id_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_destinatario_fkey" FOREIGN KEY ("id_destinatario") REFERENCES "usuarios"("id_usu") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_publi_fkey" FOREIGN KEY ("id_publi") REFERENCES "publicaciones"("id_publi") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_id_usu_fkey" FOREIGN KEY ("id_usu") REFERENCES "usuarios"("id_usu") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "usuarios"("id_usu") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_id_publi_fkey" FOREIGN KEY ("id_publi") REFERENCES "publicaciones"("id_publi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_chat" ADD CONSTRAINT "mensajes_chat_id_conv_fkey" FOREIGN KEY ("id_conv") REFERENCES "conversaciones"("id_conv") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_chat" ADD CONSTRAINT "mensajes_chat_id_remitente_fkey" FOREIGN KEY ("id_remitente") REFERENCES "usuarios"("id_usu") ON DELETE RESTRICT ON UPDATE CASCADE;
