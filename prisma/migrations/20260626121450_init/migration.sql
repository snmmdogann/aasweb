-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baslik" TEXT NOT NULL,
    "yazarlar" TEXT NOT NULL,
    "dergiVeyaKonferans" TEXT NOT NULL,
    "yil" INTEGER NOT NULL,
    "tur" TEXT NOT NULL,
    "doiUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PressItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tur" TEXT NOT NULL,
    "baslik" TEXT,
    "aciklama" TEXT,
    "imageUrl" TEXT NOT NULL,
    "haberUrl" TEXT,
    "siraNo" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
