-- CreateTable
CREATE TABLE "logs_usuario" (
    "id_log" SERIAL NOT NULL,
    "id_usu" INTEGER,
    "accion" VARCHAR(120) NOT NULL,
    "entidad" VARCHAR(80),
    "id_entidad" VARCHAR(80),
    "detalle" JSONB,
    "ip" VARCHAR(45),
    "user_agent" TEXT,
    "fecha_log" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_usuario_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE INDEX "logs_usuario_id_usu_idx" ON "logs_usuario"("id_usu");

-- CreateIndex
CREATE INDEX "logs_usuario_accion_idx" ON "logs_usuario"("accion");

-- CreateIndex
CREATE INDEX "logs_usuario_entidad_id_entidad_idx" ON "logs_usuario"("entidad", "id_entidad");

-- CreateIndex
CREATE INDEX "logs_usuario_fecha_log_idx" ON "logs_usuario"("fecha_log");

-- AddForeignKey
ALTER TABLE "logs_usuario" ADD CONSTRAINT "logs_usuario_id_usu_fkey" FOREIGN KEY ("id_usu") REFERENCES "usuarios"("id_usu") ON DELETE SET NULL ON UPDATE CASCADE;
