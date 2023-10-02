-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "duration" INTEGER;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "dateCreated" SET DEFAULT CURRENT_TIMESTAMP;
