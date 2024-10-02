-- CreateTable
CREATE TABLE "filmes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "lancamento" TIMESTAMP(3) NOT NULL,
    "genero" TEXT NOT NULL,
    "diretor" TEXT NOT NULL,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("id")
);
