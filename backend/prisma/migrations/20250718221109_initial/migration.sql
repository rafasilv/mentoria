-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('MENTOR', 'MENTORADO');

-- CreateEnum
CREATE TYPE "StatusGoal" AS ENUM ('EM_ANDAMENTO', 'EM_ATRASO', 'SUSPENSA', 'ATINGIDA', 'EXCLUIDA');

-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('UNICA', 'MULTIPLA');

-- CreateEnum
CREATE TYPE "StatusInteraction" AS ENUM ('REALIZADO', 'NAO_REALIZADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo_usuario" "TipoUsuario" NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "mentor_id" TEXT,
    "notificacoes_ativas" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "mentorado_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data_limite" TIMESTAMP(3) NOT NULL,
    "status" "StatusGoal" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "tipo" "TipoPlano" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data_limite" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_versions" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "interacoes_esperadas" INTEGER NOT NULL,
    "dias_semana" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "horarios" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "horario_programado" TEXT,
    "plan_id" TEXT NOT NULL,
    "plan_version_id" TEXT NOT NULL,
    "mentorado_id" TEXT NOT NULL,
    "data_interacao" TIMESTAMP(3) NOT NULL,
    "status" "StatusInteraction" NOT NULL,
    "justificativa" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications_sent" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "plan_version_id" TEXT NOT NULL,
    "mentorado_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "horario" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_sent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications_summary_sent" (
    "id" TEXT NOT NULL,
    "mentorado_id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_summary_sent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_sent_plan_id_mentorado_id_data_horario_key" ON "notifications_sent"("plan_id", "mentorado_id", "data", "horario");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_summary_sent_mentorado_id_data_key" ON "notifications_summary_sent"("mentorado_id", "data");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_mentorado_id_fkey" FOREIGN KEY ("mentorado_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_versions" ADD CONSTRAINT "plan_versions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_plan_version_id_fkey" FOREIGN KEY ("plan_version_id") REFERENCES "plan_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_mentorado_id_fkey" FOREIGN KEY ("mentorado_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_sent" ADD CONSTRAINT "notifications_sent_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_sent" ADD CONSTRAINT "notifications_sent_plan_version_id_fkey" FOREIGN KEY ("plan_version_id") REFERENCES "plan_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_sent" ADD CONSTRAINT "notifications_sent_mentorado_id_fkey" FOREIGN KEY ("mentorado_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications_summary_sent" ADD CONSTRAINT "notifications_summary_sent_mentorado_id_fkey" FOREIGN KEY ("mentorado_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
