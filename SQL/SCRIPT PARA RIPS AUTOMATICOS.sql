
-- se ingresa columna
ALTER TABLE [Evaluación Entidad Rips]
ADD [Id Factura] int Null;


/****** Object:  UserDefinedFunction [dbo].[FuncionBuscarRelacionRips]    Script Date: 20/03/2024 7:26:55 a.m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[FuncionBuscarRelacionRips]
(
	@DocumentoPaciente NVARCHAR(50),
	@FechaEvaluacionPaciente DATE
)

RETURNS INT
AS
BEGIN 
	DECLARE @IdEvaluacionEntidad INT;  -- VARIABLE PARA ALMACENAR EL ID DE LA EVALUACIÓN ENTIDAD
	DECLARE @ResultadoExisteRelacionRips INT;

	-- SE CAPTURA EL ID DE LA EVALUACIÓN ENTIDAD
	SELECT 
		@IdEvaluacionEntidad = [Evaluación Entidad].[Id Evaluación Entidad] 
	FROM 
		[Evaluación Entidad]
	INNER JOIN 
		[Evaluación Entidad Rips] ON [Evaluación Entidad].[Id Evaluación Entidad] = [Evaluación Entidad Rips].[Id Evaluación Entidad]
	WHERE 
		[Documento Entidad] = @DocumentoPaciente 
		AND CONVERT(DATE, [Fecha Evaluación Entidad]) = @FechaEvaluacionPaciente
		AND [Evaluación Entidad Rips].[Id Factura] is NULL;

	
	-- ASIGNA EL RESULTADO (1 SI EXISTE, 0 SI NO EXISTE) A LA VARIABLE
	SET @ResultadoExisteRelacionRips = CASE WHEN @IdEvaluacionEntidad IS NOT NULL THEN 1 ELSE 0 END;


	-- RETORNA EL ID DE LA EVALUACIÓN ENTIDAD SI LA RELACIÓN EXISTE, DE LO CONTRARIO, RETORNA 0
	RETURN CASE WHEN @ResultadoExisteRelacionRips = 1 THEN @IdEvaluacionEntidad ELSE 0 END;
END;
GO


CREATE FUNCTION [dbo].[FuncionBuscarFacturaPaciente]
(
	@DocumentoPaciente NVARCHAR(50),
	@FechaFactura DATE
)

RETURNS INT
AS 
BEGIN

	--DECLARE @ResultadoExisteFactura INT;
	DECLARE @ResultadoExisteFactura INT;

	SELECT @ResultadoExisteFactura = (SELECT TOP (1) [Id Factura] FROM Factura WHERE [Documento Paciente] = @DocumentoPaciente AND CONVERT(DATE, [Fecha Factura]) = @FechaFactura 
	AND  NOT EXISTS  (select [Id Factura] from [Evaluación Entidad Rips] where ([Evaluación Entidad Rips].[Id Factura] = Factura.[Id Factura]) ));

	RETURN @ResultadoExisteFactura;

END;

GO


CREATE TRIGGER [dbo].[Relacion_Rips_Factura]
ON [dbo].[Factura]
AFTER  insert
--NOT FOR REPLICATION
AS
begin
declare @IDFactura int;
declare  @documentoPaciente nvarchar(50);
declare @FechaFACTURA datetime;
declare @IdEvaluacion  int;

Select @documentoPaciente = [Documento Paciente],
@FechaFACTURA = [Fecha Factura],
@IDFactura = [Id Factura]
FROM inserted

SELECT @IdEvaluacion =   dbo.FuncionBuscarRelacionRips(@documentoPaciente, @FechaFACTURA) ;

update [Evaluación Entidad Rips] set [Id Factura] = @IDFactura
	where [Id Evaluación Entidad] = @IdEvaluacion

	END
GO

ALTER TABLE [dbo].[Factura] ENABLE TRIGGER [Relacion_Rips_Factura]
GO



CREATE TRIGGER [dbo].[Relacion_Factura_Rips]
ON [dbo].[Evaluación Entidad Rips]
AFTER  insert
--NOT FOR REPLICATION
AS
begin

declare @IDFactura int;
declare  @documentoPaciente nvarchar(50);
declare @FechaEvaluacionEntidad datetime;
declare @IdEvaluacion  int;




select  @documentoPaciente = [Evaluación Entidad].[Documento Entidad],
@FechaEvaluacionEntidad = [Evaluación Entidad].[Fecha Evaluación Entidad],
@IdEvaluacion = inserted.[Id Evaluación Entidad Rips]
from Inserted inner join [Evaluación Entidad Rips] on [Evaluación Entidad Rips].[Id Evaluación Entidad rips] = inserted.[Id Evaluación Entidad Rips]
inner join [Evaluación Entidad] on [Evaluación Entidad Rips].[Id Evaluación Entidad] = [Evaluación Entidad].[Id Evaluación Entidad]

SELECT @IDFactura =   dbo.FuncionBuscarFacturaPaciente(@documentoPaciente, @FechaEvaluacionEntidad) ;	


	update [Evaluación Entidad Rips] set [Id Factura] = @IDFactura
	where [Id Evaluación Entidad Rips] = @IdEvaluacion


END;
GO

ALTER TABLE [dbo].[Evaluación Entidad Rips] ENABLE TRIGGER [Relacion_Factura_Rips]
GO


