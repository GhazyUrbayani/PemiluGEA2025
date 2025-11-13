CREATE TYPE "public"."accepted_status" AS ENUM('accepted', 'rejected', 'pending');--> statement-breakpoint
CREATE TYPE "public"."vote_status" AS ENUM('inactive', 'active', 'used');--> statement-breakpoint
CREATE TYPE "public"."vote_type" AS ENUM('unregistered', 'offline', 'online');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin" (
	"nim" text PRIMARY KEY NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "admin_nim_unique" UNIQUE("nim")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kahim_candidate" (
	"nim" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "kahim_candidate_nim_unique" UNIQUE("nim")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offline_vote" (
	"token" text PRIMARY KEY NOT NULL,
	"sk1" text NOT NULL,
	"sk2" text NOT NULL,
	"sk3" text NOT NULL,
	"sk4" text NOT NULL,
	"ss1" text NOT NULL,
	"ss2" text NOT NULL,
	"ss3" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "offline_vote_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "online_vote" (
	"token" text PRIMARY KEY NOT NULL,
	"sk1" text NOT NULL,
	"sk2" text NOT NULL,
	"sk3" text NOT NULL,
	"sk4" text NOT NULL,
	"ss1" text NOT NULL,
	"ss2" text NOT NULL,
	"ss3" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accepted_status" "accepted_status" DEFAULT 'pending' NOT NULL,
	CONSTRAINT "online_vote_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "senator_candidate" (
	"nim" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "senator_candidate_nim_unique" UNIQUE("nim")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voter" (
	"nim" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"vote_status" "vote_status" DEFAULT 'inactive' NOT NULL,
	"vote_type" "vote_type" DEFAULT 'unregistered' NOT NULL,
	CONSTRAINT "voter_nim_unique" UNIQUE("nim"),
	CONSTRAINT "voter_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_token_voter_token_fk" FOREIGN KEY ("token") REFERENCES "public"."voter"("token") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_sk1_kahim_candidate_nim_fk" FOREIGN KEY ("sk1") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_sk2_kahim_candidate_nim_fk" FOREIGN KEY ("sk2") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_sk3_kahim_candidate_nim_fk" FOREIGN KEY ("sk3") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_sk4_kahim_candidate_nim_fk" FOREIGN KEY ("sk4") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_ss1_senator_candidate_nim_fk" FOREIGN KEY ("ss1") REFERENCES "public"."senator_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_ss2_senator_candidate_nim_fk" FOREIGN KEY ("ss2") REFERENCES "public"."senator_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offline_vote" ADD CONSTRAINT "offline_vote_ss3_senator_candidate_nim_fk" FOREIGN KEY ("ss3") REFERENCES "public"."senator_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_token_voter_token_fk" FOREIGN KEY ("token") REFERENCES "public"."voter"("token") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_sk1_kahim_candidate_nim_fk" FOREIGN KEY ("sk1") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_sk2_kahim_candidate_nim_fk" FOREIGN KEY ("sk2") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_sk3_kahim_candidate_nim_fk" FOREIGN KEY ("sk3") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_sk4_kahim_candidate_nim_fk" FOREIGN KEY ("sk4") REFERENCES "public"."kahim_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_ss1_senator_candidate_nim_fk" FOREIGN KEY ("ss1") REFERENCES "public"."senator_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_ss2_senator_candidate_nim_fk" FOREIGN KEY ("ss2") REFERENCES "public"."senator_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "online_vote" ADD CONSTRAINT "online_vote_ss3_senator_candidate_nim_fk" FOREIGN KEY ("ss3") REFERENCES "public"."senator_candidate"("nim") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
