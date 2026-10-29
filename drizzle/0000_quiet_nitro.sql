CREATE TYPE "public"."LaneType" AS ENUM('standard', 'sentri', 'ready', 'fast');--> statement-breakpoint
CREATE TYPE "public"."TravelerType" AS ENUM('passenger', 'pedestrian', 'commercial');--> statement-breakpoint
CREATE TABLE "Crossing" (
	"id" text PRIMARY KEY NOT NULL,
	"portNumber" text NOT NULL,
	"portName" text NOT NULL,
	"crossingName" text,
	"originCountry" text NOT NULL,
	"originCity" text NOT NULL,
	"destinationCity" text NOT NULL,
	"portStatus" text,
	"hours" text,
	"constructionNotice" text,
	"hasCommercialLanes" boolean DEFAULT false NOT NULL,
	"hasPassengerLanes" boolean DEFAULT false NOT NULL,
	"hasPedestrianLanes" boolean DEFAULT false NOT NULL,
	"maxCommercialLanes" integer DEFAULT 0 NOT NULL,
	"maxPassengerLanes" integer DEFAULT 0 NOT NULL,
	"maxPedestrianLanes" integer DEFAULT 0 NOT NULL,
	"cbpLastUpdateDate" text,
	"cbpLastUpdateTime" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "Crossing_portNumber_unique" UNIQUE("portNumber")
);
--> statement-breakpoint
CREATE TABLE "Favorite" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"crossingId" text NOT NULL,
	"travelerType" "TravelerType" NOT NULL,
	"laneType" "LaneType" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Favorite_userId_crossingId_travelerType_laneType_unique" UNIQUE("userId","crossingId","travelerType","laneType")
);
--> statement-breakpoint
CREATE TABLE "Post" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"username" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "WaitTime" (
	"id" text PRIMARY KEY NOT NULL,
	"crossingId" text NOT NULL,
	"commercial" json,
	"passenger" json,
	"pedestrian" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "WaitTime_crossingId_unique" UNIQUE("crossingId")
);
--> statement-breakpoint
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_crossingId_Crossing_id_fk" FOREIGN KEY ("crossingId") REFERENCES "public"."Crossing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WaitTime" ADD CONSTRAINT "WaitTime_crossingId_Crossing_id_fk" FOREIGN KEY ("crossingId") REFERENCES "public"."Crossing"("id") ON DELETE cascade ON UPDATE no action;