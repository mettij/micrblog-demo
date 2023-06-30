-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER,
    "time" TIMESTAMP(3),
    "content" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "handle" TEXT,
    "displayname" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

