-- CreateTable
CREATE TABLE "beta_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "team_size" TEXT NOT NULL,
    "current_tool" TEXT NOT NULL,
    "interest" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "position" INTEGER NOT NULL DEFAULT 0,
    "referral_source" TEXT,
    "utm_campaign" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invited_at" TIMESTAMP(3),
    "activated_at" TIMESTAMP(3),

    CONSTRAINT "beta_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beta_subscribers_email_key" ON "beta_subscribers"("email");

-- CreateIndex
CREATE INDEX "beta_subscribers_status_idx" ON "beta_subscribers"("status");

-- CreateIndex
CREATE INDEX "beta_subscribers_created_at_idx" ON "beta_subscribers"("created_at");
