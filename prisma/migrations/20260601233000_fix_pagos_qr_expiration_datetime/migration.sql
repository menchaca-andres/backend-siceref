-- AlterColumn
ALTER TABLE "pagos_qr"
ALTER COLUMN "fecha_expira" TYPE TIMESTAMP(3)
USING "fecha_expira"::timestamp;
