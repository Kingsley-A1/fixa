-- Additive schema only. Review/rehearse after the parent R1–R3 migration.
-- CockroachDB >=26.x creates tables with schema_locked=true; multi-statement migrations cannot auto-unlock, so unlock explicitly before index/FK DDL.
ALTER TABLE "User" SET (schema_locked = false);
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "googleSubject" STRING;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_googleSubject_key" ON "User"("googleSubject");

CREATE TYPE "WorkStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "EmailChallenge" (
 "id" UUID NOT NULL DEFAULT gen_random_uuid(),
 "userId" UUID NOT NULL,
 "tokenHash" STRING NOT NULL,
 "expiresAt" TIMESTAMP(3) NOT NULL,
 "consumedAt" TIMESTAMP(3),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "EmailChallenge_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "EmailChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
ALTER TABLE "EmailChallenge" SET (schema_locked = false);
CREATE UNIQUE INDEX "EmailChallenge_tokenHash_key" ON "EmailChallenge"("tokenHash");
CREATE INDEX "EmailChallenge_userId_createdAt_idx" ON "EmailChallenge"("userId","createdAt");

CREATE TABLE "WorkSample" (
 "id" UUID NOT NULL DEFAULT gen_random_uuid(),
 "businessId" UUID NOT NULL,
 "profileId" UUID NOT NULL,
 "jobId" UUID NOT NULL,
 "title" STRING NOT NULL,
 "description" STRING,
 "status" "WorkStatus" NOT NULL DEFAULT 'DRAFT',
 "customerConsentAt" TIMESTAMP(3),
 "submittedAt" TIMESTAMP(3),
 "publishedAt" TIMESTAMP(3),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "WorkSample_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "WorkSample_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "WorkSample_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TechnicianProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT "WorkSample_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "RepairJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
ALTER TABLE "WorkSample" SET (schema_locked = false);
CREATE UNIQUE INDEX "WorkSample_jobId_key" ON "WorkSample"("jobId");
CREATE INDEX "WorkSample_profileId_status_publishedAt_idx" ON "WorkSample"("profileId","status","publishedAt");
CREATE INDEX "WorkSample_businessId_status_idx" ON "WorkSample"("businessId","status");

CREATE TABLE "WorkImage" (
 "id" UUID NOT NULL DEFAULT gen_random_uuid(),
 "sampleId" UUID NOT NULL,
 "blobUrl" STRING NOT NULL,
 "contentType" STRING NOT NULL,
 "position" INT4 NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "WorkImage_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "WorkImage_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "WorkSample"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
ALTER TABLE "WorkImage" SET (schema_locked = false);
CREATE UNIQUE INDEX "WorkImage_sampleId_position_key" ON "WorkImage"("sampleId","position");
