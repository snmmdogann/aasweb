-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "baslik" TEXT NOT NULL,
    "yazarlar" TEXT NOT NULL,
    "dergiVeyaKonferans" TEXT NOT NULL,
    "yil" INTEGER NOT NULL,
    "tur" TEXT NOT NULL,
    "doiUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PressItem" (
    "id" TEXT NOT NULL,
    "tur" TEXT NOT NULL,
    "baslik" TEXT,
    "aciklama" TEXT,
    "imageUrl" TEXT NOT NULL,
    "haberUrl" TEXT,
    "siraNo" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PressItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);
