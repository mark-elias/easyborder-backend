-- CreateEnum
CREATE TYPE "TravelerType" AS ENUM ('passenger', 'pedestrian', 'commercial');

-- CreateEnum
CREATE TYPE "LaneType" AS ENUM ('standard', 'sentri', 'ready', 'fast');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crossing" (
    "id" TEXT NOT NULL,
    "portNumber" TEXT NOT NULL,
    "portName" TEXT NOT NULL,
    "crossingName" TEXT,
    "originCountry" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "portStatus" TEXT,
    "hours" TEXT,
    "constructionNotice" TEXT,
    "hasCommercialLanes" BOOLEAN NOT NULL DEFAULT false,
    "hasPassengerLanes" BOOLEAN NOT NULL DEFAULT false,
    "hasPedestrianLanes" BOOLEAN NOT NULL DEFAULT false,
    "maxCommercialLanes" INTEGER NOT NULL DEFAULT 0,
    "maxPassengerLanes" INTEGER NOT NULL DEFAULT 0,
    "maxPedestrianLanes" INTEGER NOT NULL DEFAULT 0,
    "cbpLastUpdateDate" TEXT,
    "cbpLastUpdateTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crossing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitTime" (
    "id" TEXT NOT NULL,
    "crossingId" TEXT NOT NULL,
    "commercial" JSONB,
    "passenger" JSONB,
    "pedestrian" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "crossingId" TEXT NOT NULL,
    "travelerType" "TravelerType" NOT NULL,
    "laneType" "LaneType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Crossing_portNumber_key" ON "Crossing"("portNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WaitTime_crossingId_key" ON "WaitTime"("crossingId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_crossingId_travelerType_laneType_key" ON "Favorite"("userId", "crossingId", "travelerType", "laneType");

-- AddForeignKey
ALTER TABLE "WaitTime" ADD CONSTRAINT "WaitTime_crossingId_fkey" FOREIGN KEY ("crossingId") REFERENCES "Crossing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_crossingId_fkey" FOREIGN KEY ("crossingId") REFERENCES "Crossing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
