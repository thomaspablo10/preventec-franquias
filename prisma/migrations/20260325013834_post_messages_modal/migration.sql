-- CreateTable
CREATE TABLE "PostMessage" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostMessage_postId_idx" ON "PostMessage"("postId");

-- CreateIndex
CREATE INDEX "PostMessage_recipientId_idx" ON "PostMessage"("recipientId");

-- CreateIndex
CREATE INDEX "PostMessage_senderId_idx" ON "PostMessage"("senderId");

-- CreateIndex
CREATE INDEX "PostMessage_readAt_idx" ON "PostMessage"("readAt");

-- AddForeignKey
ALTER TABLE "PostMessage" ADD CONSTRAINT "PostMessage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMessage" ADD CONSTRAINT "PostMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMessage" ADD CONSTRAINT "PostMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
