-- CreateEnum
CREATE TYPE "estado_pago_qr" AS ENUM ('PENDIENTE', 'PAGADO', 'EXPIRADO', 'ERROR');

-- CreateTable
CREATE TABLE "pagos_qr" (
    "id_pago" SERIAL NOT NULL,
    "id_usu" INTEGER,
    "id_ref" INTEGER,
    "qr_id_bnb" VARCHAR(80),
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'BOB',
    "glosa" TEXT NOT NULL,
    "qr_imagen" TEXT,
    "estado" "estado_pago_qr" NOT NULL DEFAULT 'PENDIENTE',
    "estado_bnb" INTEGER,
    "mensaje_bnb" TEXT,
    "fecha_expira" DATE NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_qr_pkey" PRIMARY KEY ("id_pago")
);

-- CreateIndex
CREATE INDEX "pagos_qr_qr_id_bnb_idx" ON "pagos_qr"("qr_id_bnb");

-- CreateIndex
CREATE INDEX "pagos_qr_estado_idx" ON "pagos_qr"("estado");

-- AddForeignKey
ALTER TABLE "pagos_qr" ADD CONSTRAINT "pagos_qr_id_usu_fkey" FOREIGN KEY ("id_usu") REFERENCES "usuarios"("id_usu") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_qr" ADD CONSTRAINT "pagos_qr_id_ref_fkey" FOREIGN KEY ("id_ref") REFERENCES "refugios"("id_ref") ON DELETE SET NULL ON UPDATE CASCADE;
