-- CreateEnum
CREATE TYPE "PlaceCategory" AS ENUM ('restaurant', 'cafe', 'bar', 'market', 'turistico', 'historico', 'museo', 'iglesia', 'plaza_parque', 'centro_cultural', 'naturaleza', 'mirador', 'sendero', 'cascada_laguna', 'tienda', 'artesania', 'servicio', 'salud', 'banco', 'policia', 'municipalidad', 'transporte', 'infoturismo', 'cowork', 'gasolinera', 'alojamiento', 'instagrameable', 'random');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('draft', 'pending', 'published', 'rejected');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('festival', 'cultural', 'religioso', 'gastronomico', 'deportivo');

-- CreateEnum
CREATE TYPE "VideoCategory" AS ENUM ('documental', 'clip', 'drone', 'entrevista');

-- CreateEnum
CREATE TYPE "ResearchType" AS ENUM ('tesis', 'articulo', 'investigacion', 'libro');

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "bboxW" DOUBLE PRECISION,
    "bboxS" DOUBLE PRECISION,
    "bboxE" DOUBLE PRECISION,
    "bboxN" DOUBLE PRECISION,
    "heroImage" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "altitude" INTEGER,
    "stats" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "bboxW" DOUBLE PRECISION,
    "bboxS" DOUBLE PRECISION,
    "bboxE" DOUBLE PRECISION,
    "bboxN" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "areaId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "PlaceCategory" NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "short" TEXT,
    "details" JSONB,
    "images" JSONB,
    "rating" DOUBLE PRECISION,
    "bookingUrl" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "schedule" JSONB,
    "ownerName" TEXT,
    "ownerEmail" TEXT,
    "ownerPhone" TEXT,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "EventCategory" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "duration" TEXT,
    "location" TEXT,
    "image" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PEN',
    "highlights" JSONB,
    "image" TEXT,
    "images" JSONB,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "whatsappNumber" TEXT,
    "bookingUrl" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "VideoCategory" NOT NULL,
    "thumbnailUrl" TEXT,
    "videoUrl" TEXT,
    "duration" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Research" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "ResearchType" NOT NULL,
    "category" TEXT,
    "authorName" TEXT NOT NULL,
    "institution" TEXT,
    "year" INTEGER,
    "pages" INTEGER,
    "doi" TEXT,
    "url" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "managedCityId" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PlaceReview" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "userId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "images" JSONB,
    "status" "PublishStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewHelpful" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewHelpful_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewComment" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "Area_cityId_status_idx" ON "Area"("cityId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Area_cityId_slug_key" ON "Area"("cityId", "slug");

-- CreateIndex
CREATE INDEX "Place_areaId_idx" ON "Place"("areaId");

-- CreateIndex
CREATE INDEX "Place_status_idx" ON "Place"("status");

-- CreateIndex
CREATE INDEX "Place_category_idx" ON "Place"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Place_cityId_slug_key" ON "Place"("cityId", "slug");

-- CreateIndex
CREATE INDEX "Event_cityId_startDate_idx" ON "Event"("cityId", "startDate");

-- CreateIndex
CREATE INDEX "Event_cityId_status_idx" ON "Event"("cityId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Event_cityId_slug_key" ON "Event"("cityId", "slug");

-- CreateIndex
CREATE INDEX "Tour_cityId_status_idx" ON "Tour"("cityId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_cityId_slug_key" ON "Tour"("cityId", "slug");

-- CreateIndex
CREATE INDEX "Video_cityId_status_idx" ON "Video"("cityId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Video_cityId_slug_key" ON "Video"("cityId", "slug");

-- CreateIndex
CREATE INDEX "Research_cityId_status_idx" ON "Research"("cityId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Research_cityId_slug_key" ON "Research"("cityId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "PlaceReview_placeId_status_createdAt_idx" ON "PlaceReview"("placeId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceReview_placeId_userId_key" ON "PlaceReview"("placeId", "userId");

-- CreateIndex
CREATE INDEX "ReviewHelpful_reviewId_idx" ON "ReviewHelpful"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewHelpful_reviewId_userId_key" ON "ReviewHelpful"("reviewId", "userId");

-- CreateIndex
CREATE INDEX "ReviewComment_reviewId_status_createdAt_idx" ON "ReviewComment"("reviewId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Research" ADD CONSTRAINT "Research_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managedCityId_fkey" FOREIGN KEY ("managedCityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHelpful" ADD CONSTRAINT "ReviewHelpful_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "PlaceReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHelpful" ADD CONSTRAINT "ReviewHelpful_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "PlaceReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewComment" ADD CONSTRAINT "ReviewComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

