-- CreateEnum
CREATE TYPE "public"."MemberStatus" AS ENUM ('ONLINE', 'OFFLINE', 'AWAY', 'BUSY');

-- CreateEnum
CREATE TYPE "public"."MembershipState" AS ENUM ('ACTIVE', 'LEFT', 'BANNED');

-- CreateEnum
CREATE TYPE "public"."JoinedType" AS ENUM ('INVITE', 'JOIN');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('CONTACT', 'CHANNEL');

-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('TEXT', 'IMAGE', 'AUDIO', 'VIDEO');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "password_hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "owner_user_id" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" SERIAL NOT NULL,
    "contact_one_user_id" INTEGER NOT NULL,
    "contact_two_user_id" INTEGER NOT NULL,
    "oneAccepted" BOOLEAN NOT NULL DEFAULT true,
    "twoAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChannelMember" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "public"."MemberStatus" NOT NULL DEFAULT 'ONLINE',
    "membership_state" "public"."MembershipState" NOT NULL DEFAULT 'ACTIVE',
    "joinedType" "public"."JoinedType" NOT NULL DEFAULT 'JOIN',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAccepted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ChannelMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "contactId" INTEGER,
    "channelId" INTEGER,
    "type" "public"."MessageType" NOT NULL,
    "fileType" "public"."FileType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT,
    "fileUrl" TEXT,
    "fileData" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_identifier_key" ON "public"."User"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "public"."User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "public"."Channel"("name");

-- CreateIndex
CREATE INDEX "idx_channel_owner" ON "public"."Channel"("owner_user_id");

-- CreateIndex
CREATE INDEX "idx_contact_one" ON "public"."Contact"("contact_one_user_id");

-- CreateIndex
CREATE INDEX "idx_contact_two" ON "public"."Contact"("contact_two_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_contact_one_user_id_contact_two_user_id_key" ON "public"."Contact"("contact_one_user_id", "contact_two_user_id");

-- CreateIndex
CREATE INDEX "idx_channelmember_userId" ON "public"."ChannelMember"("userId");

-- CreateIndex
CREATE INDEX "idx_channelmember_channelId" ON "public"."ChannelMember"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelMember_channelId_userId_key" ON "public"."ChannelMember"("channelId", "userId");

-- CreateIndex
CREATE INDEX "idx_msg_channel_createdAt" ON "public"."Message"("channelId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_msg_contact_createdAt" ON "public"."Message"("contactId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_msg_sender_createdAt" ON "public"."Message"("senderId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Channel" ADD CONSTRAINT "Channel_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_contact_one_user_id_fkey" FOREIGN KEY ("contact_one_user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_contact_two_user_id_fkey" FOREIGN KEY ("contact_two_user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChannelMember" ADD CONSTRAINT "ChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChannelMember" ADD CONSTRAINT "ChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
