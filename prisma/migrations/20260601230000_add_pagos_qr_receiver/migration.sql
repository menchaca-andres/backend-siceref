-- AddColumn
ALTER TABLE "pagos_qr" ADD COLUMN "id_receptor" INTEGER;

-- CreateIndex
CREATE INDEX "pagos_qr_id_receptor_idx" ON "pagos_qr"("id_receptor");

-- AddForeignKey
ALTER TABLE "pagos_qr" ADD CONSTRAINT "pagos_qr_id_receptor_fkey" FOREIGN KEY ("id_receptor") REFERENCES "usuarios"("id_usu") ON DELETE SET NULL ON UPDATE CASCADE;
