/*
  Warnings:

  - The `status` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `membership_state` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `joinedType` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fileType` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ChannelMember" DROP COLUMN "status",
ADD COLUMN     "status" "public"."MemberStatus" NOT NULL DEFAULT 'ONLINE',
DROP COLUMN "membership_state",
ADD COLUMN     "membership_state" "public"."MembershipState" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "joinedType",
ADD COLUMN     "joinedType" "public"."JoinedType" NOT NULL DEFAULT 'JOIN';

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "type",
ADD COLUMN     "type" "public"."MessageType" NOT NULL,
DROP COLUMN "fileType",
ADD COLUMN     "fileType" "public"."FileType" NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "status",
ADD COLUMN     "status" "public"."MemberStatus" NOT NULL DEFAULT 'ONLINE';
