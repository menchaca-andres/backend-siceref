ALTER TABLE "usuarios" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "mascotas" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "refugios" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "publicaciones" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "especies" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "razas" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "roles" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "permisos" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "tamanios" ADD COLUMN "deleted_at" TIMESTAMP(3);

ALTER TABLE "usuarios" DROP CONSTRAINT IF EXISTS "usuarios_email_usu_key";
ALTER TABLE "refugios" DROP CONSTRAINT IF EXISTS "refugios_email_ref_key";
ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "roles_codigo_key";
ALTER TABLE "permisos" DROP CONSTRAINT IF EXISTS "permisos_codigo_key";
ALTER TABLE "tamanios" DROP CONSTRAINT IF EXISTS "tamanios_nom_tam_key";

CREATE UNIQUE INDEX "usuarios_email_usu_active_key" ON "usuarios"("email_usu") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX "refugios_email_ref_active_key" ON "refugios"("email_ref") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX "roles_codigo_active_key" ON "roles"("codigo") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX "permisos_codigo_active_key" ON "permisos"("codigo") WHERE "deleted_at" IS NULL;
CREATE UNIQUE INDEX "tamanios_nom_tam_active_key" ON "tamanios"("nom_tam") WHERE "deleted_at" IS NULL;

CREATE INDEX "usuarios_deleted_at_idx" ON "usuarios"("deleted_at");
CREATE INDEX "mascotas_deleted_at_idx" ON "mascotas"("deleted_at");
CREATE INDEX "refugios_deleted_at_idx" ON "refugios"("deleted_at");
CREATE INDEX "publicaciones_deleted_at_idx" ON "publicaciones"("deleted_at");
CREATE INDEX "especies_deleted_at_idx" ON "especies"("deleted_at");
CREATE INDEX "razas_deleted_at_idx" ON "razas"("deleted_at");
CREATE INDEX "roles_deleted_at_idx" ON "roles"("deleted_at");
CREATE INDEX "permisos_deleted_at_idx" ON "permisos"("deleted_at");
CREATE INDEX "tamanios_deleted_at_idx" ON "tamanios"("deleted_at");
