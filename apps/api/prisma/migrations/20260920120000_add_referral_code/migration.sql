-- AlterTable: Add referralCode column to beta_subscribers
ALTER TABLE "beta_subscribers" ADD COLUMN "referral_code" TEXT;

-- CreateIndex: Unique index on referralCode
CREATE UNIQUE INDEX "beta_subscribers_referral_code_key" ON "beta_subscribers"("referral_code");
