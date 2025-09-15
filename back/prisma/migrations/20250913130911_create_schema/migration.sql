-- CreateTable
CREATE TABLE `clientes` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(20) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos` (
    `id_evento` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `local` VARCHAR(255) NOT NULL,
    `dt_inicio` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_fim` DATETIME(0) NULL,
    `capacidade_max` INTEGER NOT NULL DEFAULT 5000,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_evento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfis` (
    `id_perfil` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_perfil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas` (
    `id_reserva` VARCHAR(50) NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,
    `id_setor` INTEGER NOT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'Emitido',
    `dt_criacao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_validacao` DATETIME(0) NULL,
    `ativo` BOOLEAN NULL DEFAULT true,

    INDEX `fk_reservas_clientes`(`id_cliente`),
    INDEX `fk_reservas_eventos`(`id_evento`),
    INDEX `fk_reservas_setores`(`id_setor`),
    INDEX `fk_reservas_usuarios`(`id_usuario`),
    PRIMARY KEY (`id_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas_auditoria` (
    `id_auditoria` INTEGER NOT NULL AUTO_INCREMENT,
    `id_evento` INTEGER NOT NULL,
    `id_setor` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_cliente` INTEGER NOT NULL,
    `operacao` VARCHAR(10) NOT NULL,
    `reserva_status` VARCHAR(20) NULL DEFAULT 'Não validado',
    `dt_registro` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_auditoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setores` (
    `id_setor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(255) NOT NULL,
    `capacidade_max` INTEGER NOT NULL DEFAULT 5000,
    `capacidade_atual` INTEGER NOT NULL DEFAULT 0,
    `id_evento` INTEGER NOT NULL,
    `ativo` BOOLEAN NULL DEFAULT true,

    INDEX `fk_setores_eventos`(`id_evento`),
    PRIMARY KEY (`id_setor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(20) NOT NULL,
    `telefone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `id_perfil` INTEGER NOT NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `fk_usuarios_perfil`(`id_perfil`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reservas_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reservas_eventos` FOREIGN KEY (`id_evento`) REFERENCES `eventos`(`id_evento`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reservas_setores` FOREIGN KEY (`id_setor`) REFERENCES `setores`(`id_setor`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reservas_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `setores` ADD CONSTRAINT `fk_setores_eventos` FOREIGN KEY (`id_evento`) REFERENCES `eventos`(`id_evento`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfis`(`id_perfil`) ON DELETE RESTRICT ON UPDATE NO ACTION;
