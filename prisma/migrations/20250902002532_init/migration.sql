/*
  Warnings:

  - The `status` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `membership_state` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `joinedType` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fileType` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Channel" DROP CONSTRAINT "Channel_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChannelMember" DROP CONSTRAINT "ChannelMember_channelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChannelMember" DROP CONSTRAINT "ChannelMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_contact_one_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_contact_two_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_channelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_contactId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropIndex
DROP INDEX "public"."Channel_name_key";

-- DropIndex
DROP INDEX "public"."idx_channel_owner";

-- DropIndex
DROP INDEX "public"."ChannelMember_channelId_userId_key";

-- DropIndex
DROP INDEX "public"."idx_channelmember_channelId";

-- DropIndex
DROP INDEX "public"."idx_channelmember_userId";

-- DropIndex
DROP INDEX "public"."Contact_contact_one_user_id_contact_two_user_id_key";

-- DropIndex
DROP INDEX "public"."idx_contact_one";

-- DropIndex
DROP INDEX "public"."idx_contact_two";

-- DropIndex
DROP INDEX "public"."idx_msg_channel_createdAt";

-- DropIndex
DROP INDEX "public"."idx_msg_contact_createdAt";

-- DropIndex
DROP INDEX "public"."idx_msg_sender_createdAt";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- DropIndex
DROP INDEX "public"."User_identifier_key";

-- DropIndex
DROP INDEX "public"."User_user_name_key";

-- AlterTable
ALTER TABLE "public"."ChannelMember" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ONLINE',
DROP COLUMN "membership_state",
ADD COLUMN     "membership_state" TEXT NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "joinedType",
ADD COLUMN     "joinedType" TEXT NOT NULL DEFAULT 'JOIN';

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "fileType",
ADD COLUMN     "fileType" TEXT NOT NULL DEFAULT 'TEXT';
