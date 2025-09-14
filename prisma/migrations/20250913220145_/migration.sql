-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."venues" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Sri Lanka',
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phoneNumber" TEXT,
    "email" TEXT,
    "website" TEXT,
    "amenities" TEXT[],
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."venue_opening_hours" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "venue_opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courts" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "surface" TEXT,
    "size" TEXT,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."court_maintenance" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "court_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "minPlayers" INTEGER,
    "maxPlayers" INTEGER,
    "estimatedDuration" INTEGER,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."court_sports" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,

    CONSTRAINT "court_sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."court_pricing" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "sportId" INTEGER,
    "name" TEXT,
    "dayOfWeek" INTEGER,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "minimumDuration" INTEGER NOT NULL DEFAULT 60,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "court_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courtId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "notes" TEXT,
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_favorite_venues" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "user_favorite_venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "public"."users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "public"."users"("phoneNumber");

-- CreateIndex
CREATE INDEX "venues_latitude_longitude_idx" ON "public"."venues"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "venues_isActive_idx" ON "public"."venues"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_key" ON "public"."districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "venue_opening_hours_venueId_dayOfWeek_key" ON "public"."venue_opening_hours"("venueId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "courts_venueId_idx" ON "public"."courts"("venueId");

-- CreateIndex
CREATE INDEX "courts_isActive_idx" ON "public"."courts"("isActive");

-- CreateIndex
CREATE INDEX "court_maintenance_courtId_startTime_endTime_idx" ON "public"."court_maintenance"("courtId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "sports_name_key" ON "public"."sports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "court_sports_courtId_sportId_key" ON "public"."court_sports"("courtId", "sportId");

-- CreateIndex
CREATE INDEX "court_pricing_courtId_dayOfWeek_startTime_endTime_idx" ON "public"."court_pricing"("courtId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "court_pricing_sportId_idx" ON "public"."court_pricing"("sportId");

-- CreateIndex
CREATE INDEX "court_pricing_isActive_idx" ON "public"."court_pricing"("isActive");

-- CreateIndex
CREATE INDEX "bookings_courtId_startTime_endTime_idx" ON "public"."bookings"("courtId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "bookings_userId_createdAt_idx" ON "public"."bookings"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "bookings_sportId_idx" ON "public"."bookings"("sportId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "public"."bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_startTime_endTime_idx" ON "public"."bookings"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "reviews_venueId_rating_idx" ON "public"."reviews"("venueId", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_venueId_key" ON "public"."reviews"("userId", "venueId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_venues_userId_venueId_key" ON "public"."user_favorite_venues"("userId", "venueId");

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venue_opening_hours" ADD CONSTRAINT "venue_opening_hours_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."courts" ADD CONSTRAINT "courts_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."court_maintenance" ADD CONSTRAINT "court_maintenance_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."court_sports" ADD CONSTRAINT "court_sports_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."court_sports" ADD CONSTRAINT "court_sports_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."court_pricing" ADD CONSTRAINT "court_pricing_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."court_pricing" ADD CONSTRAINT "court_pricing_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."sports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorite_venues" ADD CONSTRAINT "user_favorite_venues_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorite_venues" ADD CONSTRAINT "user_favorite_venues_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
