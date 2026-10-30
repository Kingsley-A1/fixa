-- Additive migration: retain every existing customer/device/repair row and ticket URL.
-- Review and apply with prisma migrate deploy to the intended CockroachDB environment.
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

ALTER TABLE "Device" ADD COLUMN "modelNumber" STRING;
ALTER TABLE "RepairJob" ADD COLUMN "assignedProfileId" UUID;
ALTER TABLE "RepairJob" ADD COLUMN "collectedByName" STRING;
ALTER TABLE "RepairJob" ADD COLUMN "handoverNote" STRING;

CREATE TABLE "TechnicianProfile" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "businessId" UUID NOT NULL,
  "ownerUserId" UUID NOT NULL,
  "slug" STRING NOT NULL,
  "displayName" STRING NOT NULL,
  "headline" STRING,
  "bio" STRING,
  "publicPhone" STRING NOT NULL,
  "photoUrl" STRING,
  "state" STRING NOT NULL,
  "city" STRING NOT NULL,
  "area" STRING,
  "specialties" STRING[] NOT NULL,
  "deviceClasses" STRING[] NOT NULL,
  "searchText" STRING NOT NULL DEFAULT '',
  "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
  "contactVerifiedAt" TIMESTAMP(3),
  "locationVerifiedAt" TIMESTAMP(3),
  "identityVerifiedAt" TIMESTAMP(3),
  "ownershipVerifiedAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TechnicianProfile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TechnicianProfile_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "TechnicianProfile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TechnicianProfile_slug_key" ON "TechnicianProfile"("slug");
CREATE UNIQUE INDEX "TechnicianProfile_businessId_ownerUserId_key" ON "TechnicianProfile"("businessId","ownerUserId");
CREATE INDEX "TechnicianProfile_status_state_city_idx" ON "TechnicianProfile"("status","state","city");
CREATE INDEX "TechnicianProfile_businessId_status_idx" ON "TechnicianProfile"("businessId","status");
ALTER TABLE "RepairJob" ADD CONSTRAINT "RepairJob_assignedProfileId_fkey" FOREIGN KEY ("assignedProfileId") REFERENCES "TechnicianProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "PlatformAdmin" (
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlatformAdmin_pkey" PRIMARY KEY ("userId"),
  CONSTRAINT "PlatformAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ModerationAction" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "actorUserId" UUID NOT NULL,
  "targetType" STRING NOT NULL,
  "targetId" STRING NOT NULL,
  "decision" STRING NOT NULL,
  "reason" STRING NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ModerationAction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ModerationAction_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "ModerationAction_targetType_targetId_createdAt_idx" ON "ModerationAction"("targetType","targetId","createdAt");

CREATE TABLE "ReviewInvitation" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "token" UUID NOT NULL DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  "profileId" UUID NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReviewInvitation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ReviewInvitation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "RepairJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ReviewInvitation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TechnicianProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ReviewInvitation_token_key" ON "ReviewInvitation"("token");
CREATE UNIQUE INDEX "ReviewInvitation_jobId_key" ON "ReviewInvitation"("jobId");

CREATE TABLE "TechnicianReview" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  "profileId" UUID NOT NULL,
  "rating" INT4 NOT NULL,
  "comment" STRING NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt" TIMESTAMP(3),
  CONSTRAINT "TechnicianReview_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TechnicianReview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "RepairJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "TechnicianReview_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TechnicianProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TechnicianReview_jobId_key" ON "TechnicianReview"("jobId");
CREATE INDEX "TechnicianReview_profileId_status_createdAt_idx" ON "TechnicianReview"("profileId","status","createdAt");
