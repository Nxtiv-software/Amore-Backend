/*
  Warnings:

  - You are about to drop the `BILLING_ITEMS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BILLING_ITEMS" DROP CONSTRAINT "BILLING_ITEMS_billing_id_fkey";

-- DropForeignKey
ALTER TABLE "BILLING_ITEMS" DROP CONSTRAINT "BILLING_ITEMS_product_id_fkey";

-- DropTable
DROP TABLE "BILLING_ITEMS";

-- CreateTable
CREATE TABLE "BILLING_ITEM" (
    "id" SERIAL NOT NULL,
    "billing_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_time" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BILLING_ITEM_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BILLING_ITEM" ADD CONSTRAINT "BILLING_ITEM_billing_id_fkey" FOREIGN KEY ("billing_id") REFERENCES "BILLING"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BILLING_ITEM" ADD CONSTRAINT "BILLING_ITEM_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "PRODUCT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
