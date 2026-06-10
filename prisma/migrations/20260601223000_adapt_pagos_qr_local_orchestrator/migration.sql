-- ExtendEnum
ALTER TYPE "estado_pago_qr" ADD VALUE IF NOT EXISTS 'GENERANDO';
ALTER TYPE "estado_pago_qr" ADD VALUE IF NOT EXISTS 'CANCELADO';
ALTER TYPE "estado_pago_qr" ADD VALUE IF NOT EXISTS 'FALLIDO';

-- RenameIndex
DROP INDEX IF EXISTS "pagos_qr_qr_id_bnb_idx";

-- RenameColumns
ALTER TABLE "pagos_qr" RENAME COLUMN "qr_id_bnb" TO "provider_payment_id";
ALTER TABLE "pagos_qr" RENAME COLUMN "qr_imagen" TO "qr_payload";
ALTER TABLE "pagos_qr" RENAME COLUMN "estado_bnb" TO "provider_status_old";
ALTER TABLE "pagos_qr" RENAME COLUMN "mensaje_bnb" TO "provider_message";

-- AddColumns
ALTER TABLE "pagos_qr" ADD COLUMN "provider" VARCHAR(30) NOT NULL DEFAULT 'local';
ALTER TABLE "pagos_qr" ADD COLUMN "validation_method" VARCHAR(30) NOT NULL DEFAULT 'code_match';
ALTER TABLE "pagos_qr" ADD COLUMN "monto_a_pagar" DECIMAL(10,2);
ALTER TABLE "pagos_qr" ADD COLUMN "codigo" VARCHAR(16) NOT NULL DEFAULT '';
ALTER TABLE "pagos_qr" ADD COLUMN "provider_status" VARCHAR(30);
ALTER TABLE "pagos_qr" ADD COLUMN "estimated_seconds" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "pagos_qr" ADD COLUMN "failover_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "pagos_qr" ADD COLUMN "attempts" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "pagos_qr" ADD COLUMN "notification" JSONB;

-- Backfill
UPDATE "pagos_qr" SET "monto_a_pagar" = "monto" WHERE "monto_a_pagar" IS NULL;
UPDATE "pagos_qr" SET "provider_status" = "provider_status_old"::text WHERE "provider_status_old" IS NOT NULL;

-- DropOldColumns
ALTER TABLE "pagos_qr" DROP COLUMN "provider_status_old";

-- CreateIndex
CREATE INDEX "pagos_qr_provider_payment_id_idx" ON "pagos_qr"("provider_payment_id");
CREATE INDEX "pagos_qr_codigo_idx" ON "pagos_qr"("codigo");
