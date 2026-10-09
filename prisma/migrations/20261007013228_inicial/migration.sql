-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('baixa', 'media', 'alta');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "tentativas_falhas" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_ate" TIMESTAMP(3),
    "dt_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessao" (
    "id" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "refresh_hash" TEXT NOT NULL,
    "expira_em" TIMESTAMP(3) NOT NULL,
    "revogada_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" VARCHAR(80) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "categoria_id" INTEGER,
    "titulo" VARCHAR(150) NOT NULL,
    "descricao" TEXT,
    "data" DATE NOT NULL,
    "hora" TIME,
    "prioridade" "Prioridade" NOT NULL DEFAULT 'media',
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dt_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lembrete" (
    "id" SERIAL NOT NULL,
    "tarefa_id" INTEGER NOT NULL,
    "dt_hr_lembrete" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "enviado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lembrete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico" (
    "id" SERIAL NOT NULL,
    "tarefa_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "dt_hr_conclusao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_refresh_hash_key" ON "sessao"("refresh_hash");

-- CreateIndex
CREATE INDEX "sessao_usuario_id_idx" ON "sessao"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_usuario_id_nome_key" ON "categoria"("usuario_id", "nome");

-- CreateIndex
CREATE INDEX "tarefa_usuario_id_data_idx" ON "tarefa"("usuario_id", "data");

-- CreateIndex
CREATE INDEX "lembrete_ativo_enviado_dt_hr_lembrete_idx" ON "lembrete"("ativo", "enviado", "dt_hr_lembrete");

-- AddForeignKey
ALTER TABLE "sessao" ADD CONSTRAINT "sessao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lembrete" ADD CONSTRAINT "lembrete_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico" ADD CONSTRAINT "historico_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico" ADD CONSTRAINT "historico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
