-- CreateEnum
CREATE TYPE "CertificationType" AS ENUM ('ORGANIC_NPOP', 'ORGANIC_PGS', 'FSSAI', 'APEDA', 'GOOD_AGRICULTURAL_PRACTICE', 'ISO_22000', 'OTHER');

-- CreateEnum
CREATE TYPE "CertStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "addressLine" TEXT,
    "landmark" TEXT,
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "geoAccuracy" DOUBLE PRECISION,
    "geoUpdatedAt" TIMESTAMP(3),
    "landSizeHa" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerCertification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certType" "CertificationType" NOT NULL,
    "certName" TEXT NOT NULL,
    "issuedBy" TEXT,
    "certNumber" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "documentUrl" TEXT NOT NULL,
    "status" "CertStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerCertification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "FarmerCertification_userId_idx" ON "FarmerCertification"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmerCertification" ADD CONSTRAINT "FarmerCertification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
