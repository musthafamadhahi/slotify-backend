-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Venue" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "address" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VenueOpeningHour" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,

    CONSTRAINT "VenueOpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Court" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourtSport" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,

    CONSTRAINT "CourtSport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourtPricing" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "sportId" INTEGER,
    "dayOfWeek" INTEGER,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "CourtPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courtId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "public"."User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "public"."User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "public"."Sport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CourtSport_courtId_sportId_key" ON "public"."CourtSport"("courtId", "sportId");

-- CreateIndex
CREATE INDEX "Booking_courtId_startTime_endTime_idx" ON "public"."Booking"("courtId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "Booking_sportId_idx" ON "public"."Booking"("sportId");

-- AddForeignKey
ALTER TABLE "public"."Venue" ADD CONSTRAINT "Venue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VenueOpeningHour" ADD CONSTRAINT "VenueOpeningHour_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Court" ADD CONSTRAINT "Court_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourtSport" ADD CONSTRAINT "CourtSport_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourtSport" ADD CONSTRAINT "CourtSport_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourtPricing" ADD CONSTRAINT "CourtPricing_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourtPricing" ADD CONSTRAINT "CourtPricing_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "public"."Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
