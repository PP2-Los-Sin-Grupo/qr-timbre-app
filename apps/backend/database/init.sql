CREATE DATABASE TimbreQR;
GO

USE TimbreQR;
GO

CREATE TABLE Edificios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(200) NOT NULL,
    direccion NVARCHAR(500),
    qr_uuid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE UNIQUE INDEX IX_Edificios_qr_uuid ON Edificios(qr_uuid);

CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    edificio_id INT NOT NULL,
    nombre NVARCHAR(200) NOT NULL,
    email NVARCHAR(200) NOT NULL,
    password_hash NVARCHAR(500) NOT NULL,
    telefono NVARCHAR(50),
    chat_id_telegram BIGINT,
    rol NVARCHAR(20) NOT NULL DEFAULT 'propietario',
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Usuarios_Edificio FOREIGN KEY (edificio_id) REFERENCES Edificios(id),
    CONSTRAINT UQ_Usuarios_Email UNIQUE(email)
);

CREATE TABLE Departamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    edificio_id INT NOT NULL,
    numero NVARCHAR(10) NOT NULL,
    piso INT NOT NULL,
    usuario_id INT,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Departamentos_Edificio FOREIGN KEY (edificio_id) REFERENCES Edificios(id),
    CONSTRAINT FK_Departamentos_Usuario FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    CONSTRAINT UQ_Depto_Edificio UNIQUE(edificio_id, numero)
);

CREATE TABLE Visitas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    departamento_id INT NOT NULL,
    mensaje NVARCHAR(500),
    estado NVARCHAR(20) NOT NULL DEFAULT 'en_espera',
    metodo_notificacion NVARCHAR(50),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Visitas_Departamento FOREIGN KEY (departamento_id) REFERENCES Departamentos(id)
);

CREATE INDEX IX_Visitas_Departamento ON Visitas(departamento_id);
CREATE INDEX IX_Visitas_Estado ON Visitas(estado);
GO
