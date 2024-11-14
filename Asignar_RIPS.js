const servidor = "HPGRIS";

console.log("Hola")
const ejecutar = async () => {
    try {
        const abc = await fetch(`http://${servidor}:3000/api/pruebahc`);
        
        if (!abc.ok) {
            // Captura un error en caso de que la respuesta no sea 'ok'
            throw new Error(`Error en la solicitud: ${abc.status} ${abc.statusText}`);
        }

        const Datos = await abc.json();
        console.log('Pacientes:', Datos);
        
    } catch (error) {
        // Manejo de errores de red o de la API
        console.error('Ocurrió un error al realizar la solicitud:', error.message);
    }
};
ejecutar();

const radioAC = document.getElementById('AC');
const radioAP = document.getElementById('AP');
const procedimientoRIPS = document.getElementById('procedimientoRIPS');
const causaViaIngreso = document.getElementById('causaViaIngreso');
const listaCausa = document.getElementById('listaCausa');
const listaViaIngreso = document.getElementById('listaViaIngreso');
const codDiagnosticoRelacionado = document.getElementById('codDiagnosticoRelacionado');
const codDiagnosticoRelacionado2 = document.getElementById('codDiagnosticoRelacionado2');
const codDiagnosticoRelacionado3 = document.querySelector('.codDiagnosticoRelacionado3')
const tipoDiagnosticoPrincipal = document.querySelector('.tipoDiagnosticoPrincipal')

// Event listener para el radio button AC
radioAC.addEventListener('change', () => {
    if (radioAC.checked) {
        procedimientoRIPS.textContent = 'codConsulta'; // Limpiar el valor si es necesario
        causaViaIngreso.textContent = 'causaMotivoAtencion';
        listaCausa.style.display = 'block'
        listaViaIngreso.style.display = 'none'
        codDiagnosticoRelacionado.textContent = 'codDiagnosticoRelacionado1'
        codDiagnosticoRelacionado2.textContent = 'codDiagnosticoRelacionado2'
        codDiagnosticoRelacionado3.style.display = 'flex'
        tipoDiagnosticoPrincipal.style.display = 'grid'

        ejecutarConsultasAC();
    }
});

// Event listener para el radio button AP
radioAP.addEventListener('change', () => {
    if (radioAP.checked) {

        procedimientoRIPS.textContent = 'codProcedimiento'; // Asignar el valor deseado
        causaViaIngreso.textContent = 'viaIngresoServicioSalud';
        listaCausa.style.display = 'none'
        listaViaIngreso.style.display = 'block'
        codDiagnosticoRelacionado.textContent = 'codDiagnosticoRelacionado'
        codDiagnosticoRelacionado2.textContent = 'codComplicación'
        codDiagnosticoRelacionado3.style.display = 'none'
        tipoDiagnosticoPrincipal.style.display = 'none'

        ejecutarConsultasAP();
    }
});

const btnRegistrarRIPS = document.getElementById('btnRegistrarRIPS');
const selectHistoriaClinica = document.getElementById('listaHC');
const listaTipoUsuario = document.getElementById('listaTipoUsuario');
const listaEntidad = document.getElementById('listaEntidad');
const listaCodConsulta = document.getElementById('listaCodConsulta');
const listamodalidadAtencion = document.getElementById('listamodalidadAtencion');
const listaGrupoServicios = document.getElementById('listaGrupoServicios');
const listaServicios = document.getElementById('listaServicios');
const listaFinalidad = document.getElementById('listaFinalidad');
const listaTipoDiagnostico = document.getElementById('listaTipoDiagnostico');
// LISTA VIA INGRESO Y LISTA CAUSA YA ESTAN DEFINIDAS ARRIBA POR ESO NO APARECEN ACÁ

// const pruebaAlert = async () => {
//     const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//             cancelButton: "btn btn-danger",
//             confirmButton: "btn btn-success"

//         },
//         buttonsStyling: false
//     });
//     swalWithBootstrapButtons.fire({
//         title: "¿Esta seguro de querer asignar el RIPS a la paciente?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true
//     }).then((result) => {
//         if (result.isConfirmed) {
//             swalWithBootstrapButtons.fire({
//                 title: "Deleted!",
//                 text: "Your file has been deleted.",
//                 icon: "success"
//             });
//         } else if (
//             /* Read more about handling dismissals below */
//             result.dismiss === Swal.DismissReason.cancel
//         ) {
//             swalWithBootstrapButtons.fire({
//                 title: "Cancelled",
//                 text: "Your imaginary file is safe :)",
//                 icon: "error"
//             });
//         }
//     });
// }

const pruebaAlert = async () => {
    const selectHistoriaClinica = document.querySelector('#listaHC');
    const opcionSeleccionada = selectHistoriaClinica.options[selectHistoriaClinica.selectedIndex].text;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            cancelButton: "btn btn-danger",
            confirmButton: "btn btn-success"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "¿Está seguro de querer asignar el RIPS a la paciente?",
        text: `Está a punto de asignar el RIPS a la paciente: ${opcionSeleccionada}. ¿Desea continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, asignarlo",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Lógica si el usuario confirma
            RegistrarRIPS().then(() => {
                swalWithBootstrapButtons.fire({
                    title: "Asignado",
                    text: `El RIPS ha sido asignado a la paciente: ${opcionSeleccionada}`,
                    icon: "success"
                });
            }).catch(error => {
                // Manejar cualquier error que ocurra durante la ejecución de RegistrarRIPS()
                swalWithBootstrapButtons.fire({
                    title: "Error",
                    text: "Ha ocurrido un error al asignar el RIPS.",
                    icon: "error"
                });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Lógica si el usuario cancela
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "La asignación del RIPS ha sido cancelada",
                icon: "error"
            });
        }
    });
};


btnRegistrarRIPS.addEventListener('click', async () => {
    pruebaAlert();
});

const RegistrarRIPS = async () => {
    
    if (selectHistoriaClinica.value === 'Sin Seleccionar') {
        const mensaje = `<span style="color: #fff">Seleccione una historia clinica por favor</span>`
        Swal.fire({
            title: "Campo faltante",
            html: mensaje,
            icon: "question"
        });
        return
    } else {
        if (radioAC.checked) {


            if (listaTipoUsuario.value == 'Sin Seleccionar' || listaEntidad.value == 'Sin Seleccionar' || listaCodConsulta.value == 'Sin Seleccionar' || listamodalidadAtencion.value == 'Sin Seleccionar' || listaGrupoServicios.value == 'Sin Seleccionar' || listaServicios.value == 'Sin Seleccionar' || listaFinalidad.value == 'Sin Seleccionar' || listaCausa.value == 'Sin Seleccionar' || listaTipoDiagnostico.value == 'Sin Seleccionar') {
                // Array para almacenar los nombres de los campos que faltan
                let camposFaltantes = [];

                // Verificar cada campo y agregarlo al array si falta por llenar
                if (listaTipoUsuario.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Tipo de Usuario');
                    listaTipoUsuario.classList.add('campo-faltante');

                }
                if (listaEntidad.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Entidad');
                    listaEntidad.classList.add('campo-faltante');

                }
                if (listaCodConsulta.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Código de Consulta');
                    listaCodConsulta.classList.add('campo-faltante');

                }
                if (listamodalidadAtencion.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Modalidad de Atención');
                    listamodalidadAtencion.classList.add('campo-faltante');

                }
                if (listaGrupoServicios.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Grupo de Servicios');
                    listaGrupoServicios.classList.add('campo-faltante');

                }
                if (listaServicios.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Servicios');
                    listaServicios.classList.add('campo-faltante');

                }
                if (listaFinalidad.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Finalidad');
                    listaFinalidad.classList.add('campo-faltante');

                }
                if (listaCausa.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Causa');
                    listaCausa.classList.add('campo-faltante');

                }
                if (listaTipoDiagnostico.value == 'Sin Seleccionar') {
                    camposFaltantes.push('Tipo de Diagnóstico');
                    listaTipoDiagnostico.classList.add('campo-faltante');

                }

                // Construir el mensaje del alert
                let mensaje = `<span style="color: #fff">Seleccione los siguientes campos obligatorios: <br></span><br>`;
                camposFaltantes.forEach(campo => {
                    mensaje += `<span style="color: #fff;">- ${campo}</span><br>`;
                });

                Swal.fire({
                    icon: "error",
                    title: "Faltan campos obligatorios por seleccionar",
                    html: mensaje,
                });
                return;
            } else {
                insertarRIPSHC('AC');
            }
        }


        if (radioAP.checked) {

            if (listaTipoUsuario.value == 'Sin Seleccionar' || listaEntidad.value == 'Sin Seleccionar' || listaCodConsulta.value == 'Sin Seleccionar' || listamodalidadAtencion.value == 'Sin Seleccionar' || listaGrupoServicios.value == 'Sin Seleccionar' || listaServicios.value == 'Sin Seleccionar' || listaFinalidad.value == 'Sin Seleccionar' || listaViaIngreso.value == 'Sin Seleccionar') {
                camposVaciosAP = []

                if (listaTipoUsuario.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Tipo Usuario')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listaEntidad.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Tipo Entidad')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listaCodConsulta.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Tipo Usuario')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listamodalidadAtencion.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Modalidad de atención')
                    listamodalidadAtencion.classList.add('campo-faltante');

                }

                if (listaGrupoServicios.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Grupo Servicios')
                    listamodalidadAtencion.classList.add('campo-faltante');
                }

                if (listaServicios.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Cod Servicios')
                    listamodalidadAtencion.classList.add('campo-faltante');
                }

                if (listaFinalidad.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Lista Finalidad')
                    listamodalidadAtencion.classList.add('campo-faltante');
                }

                if (listaViaIngreso.value == 'Sin Seleccionar') {
                    camposVaciosAP.push('Via ingreso')
                }

                // Construir el mensaje del alert
                let mensajeAP = `<span style="color: #fff">Seleccione los siguientes campos obligatorios: <br></span><br>`;
                camposFaltantes.forEach(campo => {
                    mensajeAP += `<span style="color: #fff;">- ${campo}</span><br>`;
                });

                Swal.fire({
                    icon: "error",
                    title: "Faltan campos obligatorios por seleccionar",
                    html: mensajeAP,
                });

            } else {
                insertarRIPSHC('AP');
            }


        }
    }
}

// 
listaTipoUsuario.addEventListener('change', quitarBordeRojo);
listaEntidad.addEventListener('change', quitarBordeRojo);
listaCodConsulta.addEventListener('change', quitarBordeRojo);
listamodalidadAtencion.addEventListener('change', quitarBordeRojo);
listaGrupoServicios.addEventListener('change', quitarBordeRojo);
listaServicios.addEventListener('change', quitarBordeRojo);
listaFinalidad.addEventListener('change', quitarBordeRojo);
listaCausa.addEventListener('change', quitarBordeRojo);
listaViaIngreso.addEventListener('change', quitarBordeRojo);


// Función para quitar el borde rojo
function quitarBordeRojo(event) {
    event.target.classList.remove('campo-faltante');
}


const insertarRIPSHC = async (tipoInsertar) => {

    const listaTipoUsuario = document.getElementById('listaTipoUsuario')
    const listaEntidad = document.getElementById('listaEntidad')
    const listaCodConsulta = document.getElementById('listaCodConsulta')
    const listamodalidadAtencion = document.getElementById('listamodalidadAtencion')
    const listaGrupoServicios = document.getElementById('listaGrupoServicios')
    const listaServicios = document.getElementById('listaServicios')
    const listaFinalidad = document.getElementById('listaFinalidad')
    const listaCausa = document.getElementById('listaCausa')
    const listaViaIngreso = document.getElementById('listaViaIngreso')
    const listaDiagPrincipal = document.getElementById('listaDiagPrincipal')
    const listaDiagPrincipal1 = document.getElementById('listaDiagPrincipal1')
    const listaDiagPrincipal2 = document.getElementById('listaDiagPrincipal2')
    const listaDiagPrincipal3 = document.getElementById('listaDiagPrincipal3')
    const listaTipoDiagnostico = document.getElementById('listaTipoDiagnostico')

    const opcionListaHC = selectHistoriaClinica.value;
    const opcionListaTipoUsuario = listaTipoUsuario.value;
    const opcionDocumentoEntidad = listaEntidad.value;
    const opcionListaCodConsulta = listaCodConsulta.value;
    const opcionlistamodalidadAtencion = listamodalidadAtencion.value;
    const opcionListaGrupoServicios = listaGrupoServicios.value;
    const opcionListaServicios = listaServicios.value;
    const opcionListaFinalidad = listaFinalidad.value;
    const opcionListaCausa = listaCausa.value;
    const opcionListaViaIngreso = listaViaIngreso.value;
    const opcionListaDiagPrincipal = listaDiagPrincipal.value;
    const opcionListaDiagPrincipal1 = listaDiagPrincipal1.value;
    const opcionListaDiagPrincipal2 = listaDiagPrincipal2.value;
    const opcionListaDiagPrincipal3 = listaDiagPrincipal3.value;
    const opcionListaTipoDiagnostico = listaTipoDiagnostico.value;

    try {
        const response = await fetch(`http://${servidor}:3000/api/insertarRIPS/${tipoInsertar}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ opcionListaHC, opcionListaCodConsulta, opcionListaTipoUsuario, opcionDocumentoEntidad, opcionlistamodalidadAtencion, opcionListaGrupoServicios, opcionListaServicios, opcionListaFinalidad, opcionListaCausa, opcionListaDiagPrincipal, opcionListaDiagPrincipal1, opcionListaDiagPrincipal2, opcionListaDiagPrincipal3, opcionListaTipoDiagnostico, opcionListaViaIngreso })
        });

        if (!response.ok) {
            throw new Error('Error en el insert');
            alert('Error al insertar')
        }

        const data = await response.text();
        alert(data); // Mensaje del servidor
    } catch (error) {
        console.error(error);
        alert('Error en el insert');
    }
}

async function ejecutarConsultasAC() {
    try {
        await getTipoUsuario();
        await getCodConsulta();
        await getmodalidadAtencion();
        await getGrupoServicios();
        await getServicios();
        await getFinalidadConsulta('Consulta');
        await getCausaExterna();
        await getCodDiganostico();
        await getTipoDiagnostico();
    } catch (error) {
        console.log('Error en la consulta que trae los AC');
        console.error(error);
    }
}

async function ejecutarConsultasAP() {
    try {
        await getTipoUsuario();
        await getCodConsulta();
        await getmodalidadAtencion();
        await getGrupoServicios();
        await getServicios();
        await getFinalidadConsulta('del Procedimiento');
        await getViaIngresoUsuario()
        await getCodDiganostico();

    } catch (error) {
        console.log('Error consulta que trae los AP');
        console.error(error);
    }
}

const updateEvaluacionesTablet = (evaluaciones) => {
    const selectHistoriaClinica = document.querySelector('#listaHC');
    selectHistoriaClinica.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectHistoriaClinica.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    evaluaciones.forEach((evaluacion) => {
        const option = document.createElement("option");
        option.value = evaluacion.idEvaluacion;
        const fechaFormateada = new Date(evaluacion.fechaEvaluacion).toISOString().replace(/T/, ' ').replace(/\..+/, '');

        option.text = `${evaluacion.nombreUsuario} - documento: ${evaluacion.documentoUsuario} - Fecha: ${fechaFormateada} - ${evaluacion.nombreTipoEvaluacion}`;
        selectHistoriaClinica.appendChild(option);
    });
};

const getEvaluaciones = async (fechaInicio, fechaFin) => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/evaluacionesRIPS/${fechaInicio}/${fechaFin}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de evaluaciones: ${response.statusText}`);
        }
        console.log(response);
        const evaluaciones = await response.json();

        updateEvaluacionesTablet(evaluaciones); // Llama a la función para actualizar la tabla

    } catch (ex) {
        Swal.fire({
            icon: "error",
            title: "Error",
            html: `
                <p><strong>Mensaje:</strong> ${ex.message}</p>
                <p><strong>Nombre:</strong> ${ex.name}</p>
                <p><strong>Pila:</strong> <pre>${ex.stack}</pre></p>
            `
        });
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateTipoUsuario = (tipoUsuarios) => {
    const selectTipoUsuarios = document.querySelector('#listaTipoUsuario');
    selectTipoUsuarios.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectTipoUsuarios.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    tipoUsuarios.forEach((tipoUsuario) => {
        const option = document.createElement("option");
        option.value = tipoUsuario.idTipoRips;
        option.text = `${tipoUsuario.descripcionTipoRips}`;
        selectTipoUsuarios.appendChild(option);
    });
};

const getTipoUsuario = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/tipoUsuario`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Tipo de Usuario: ${response.statusText}`);
        }

        const tipoUsuario = await response.json();
        updateTipoUsuario(tipoUsuario);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const selectTipoUsuario = document.getElementById('listaTipoUsuario');

selectTipoUsuario.addEventListener('change', async () => {
    const usuarioSeleecionado = selectTipoUsuario.options[selectTipoUsuario.selectedIndex].text;
    await getTipoEntidad(usuarioSeleecionado)
    console.log(usuarioSeleecionado);
})

const updateTipoEntidad = (tipoEntidades) => {
    const selectTipoEntidad = document.querySelector('#listaEntidad');
    selectTipoEntidad.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectTipoEntidad.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    tipoEntidades.forEach((tipoEntidad) => {
        const option = document.createElement("option");
        option.value = tipoEntidad.idEntidad;
        option.text = `${tipoEntidad.descripcionEntidad}`;
        selectTipoEntidad.appendChild(option);
    });
};

const getTipoEntidad = async (descripcionTipoRips) => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/tipoEntidad/${descripcionTipoRips}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Tipo de Entidad: ${response.statusText}`);
        }

        const tipoEntidad = await response.json();
        updateTipoEntidad(tipoEntidad);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateCodConsultaSelect = (codConsultas) => {
    const selectCodConsulta = document.querySelector('#listaCodConsulta');

    // Limpiar opciones antiguas
    selectCodConsulta.innerHTML = "";

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectCodConsulta.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    codConsultas.forEach((codConsulta) => {
        const option = document.createElement("option");
        option.value = codConsulta.codigoObjeto;
        option.text = `${codConsulta.codigoObjeto} - ${codConsulta.descripcionObjeto} `;
        selectCodConsulta.appendChild(option);
    });
};

const getCodConsulta = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/codConsulta`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de codConsulta: ${response.statusText}`);
        }

        const codConsulta = await response.json();
        updateCodConsultaSelect(codConsulta);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

// DESDE ACÁ COMIENZA EL CÓDIGO PARA ESCRIBIR EN EL INPUT EL CODIGO Y APAREZCA EN LA LISTA

// Crear un objeto que contenga la información de los selectores
var selectores = {
    "inputCodConsulta": "listaCodConsulta",
    "inputDiagPrincipal": "listaDiagPrincipal",
    "inputDiagPrincipal1": "listaDiagPrincipal1",
    "inputDiagPrincipal2": "listaDiagPrincipal2",
    "inputDiagPrincipal3": "listaDiagPrincipal3"
};

// Asociar el evento input a todos los input de búsqueda
for (var inputId in selectores) {
    if (selectores.hasOwnProperty(inputId)) {
        document.getElementById(inputId).addEventListener("input", function () {
            buscarElementoPorInput(this.id);
        });
    }
}

// Función genérica para buscar un elemento por el valor de un input
function buscarElementoPorInput(inputId) {
    var inputValue = document.getElementById(inputId).value;
    var selectId = selectores[inputId];
    var select = document.getElementById(selectId);

    // Iterar sobre las opciones del select y seleccionar la que coincide con el valor del input
    for (var i = 0; i < select.options.length; i++) {
        var elementoValue = select.options[i].value;

        if (elementoValue === inputValue) {
            select.selectedIndex = i; // Seleccionar la opción si coincide
            return; // Salir de la función, ya que se encontró una coincidencia
        }
    }
}

// ACÁ TERMINA EL CÓDIGO PARA ESCRIBIR EN EL INPUT EL CODIGO Y APAREZCA EN LA LISTA

const updateModalidadAtencion = (modalidadAtenciones) => {
    const selectmodalidadAtencion = document.querySelector('#listamodalidadAtencion');
    selectmodalidadAtencion.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectmodalidadAtencion.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    modalidadAtenciones.forEach((modalidadAtencion) => {
        const option = document.createElement("option");
        option.value = modalidadAtencion.codigoModalidad;
        option.text = `${modalidadAtencion.nombreModalidad}`;
        selectmodalidadAtencion.appendChild(option);
    });
};

const getmodalidadAtencion = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/modalidadAtencion`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Modalidad Atención: ${response.statusText}`);
        }

        const modalidadAtencion = await response.json();
        updateModalidadAtencion(modalidadAtencion);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateGrupoServicios = (grupoServicios) => {
    const selectGrupoServicios = document.querySelector('#listaGrupoServicios');
    selectGrupoServicios.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectGrupoServicios.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    grupoServicios.forEach((grupoServicio) => {
        const option = document.createElement("option");
        option.value = grupoServicio.codigoServicios;
        option.text = `${grupoServicio.nombreServicios}`;
        selectGrupoServicios.appendChild(option);
    });
};

const getGrupoServicios = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/grupoServicios`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Grupo Servicios: ${response.statusText}`);
        }

        const grupoServicio = await response.json();
        updateGrupoServicios(grupoServicio);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateServicios = (Servicios) => {
    const selectServicios = document.querySelector('#listaServicios');
    selectServicios.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectServicios.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    Servicios.forEach((Servicio) => {
        const option = document.createElement("option");
        option.value = Servicio.codigoServicios;
        option.text = `${Servicio.nombreServicios}`;
        selectServicios.appendChild(option);
    });
};

const getServicios = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/Servicios`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Servicios: ${response.statusText}`);
        }

        const Servicio = await response.json();
        updateServicios(Servicio);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateFinalidadConsulta = (finalidadConsulta) => {
    const selectFinalidadConsulta = document.querySelector('#listaFinalidad');
    selectFinalidadConsulta.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectFinalidadConsulta.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    finalidadConsulta.forEach((Finalidad) => {
        const option = document.createElement("option");
        option.value = Finalidad.codigoFinalidad;
        option.text = `${Finalidad.nombreFinalidad}`;
        selectFinalidadConsulta.appendChild(option);
    });
};

const getFinalidadConsulta = async (tipoConsulta) => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/finalidadConsulta/${tipoConsulta}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Finalidad Consulta: ${response.statusText}`);

            console.log(tipoConsulta);
        }

        const finalidad = await response.json();
        updateFinalidadConsulta(finalidad);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateCausaExterna = (causaExterna) => {
    const selectCausaExterna = document.querySelector('#listaCausa');
    selectCausaExterna.innerHTML = ""; // Limpiar opciones antiguas

    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectCausaExterna.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    causaExterna.forEach((Causa) => {
        const option = document.createElement("option");
        option.value = Causa.codigoCausa;
        option.text = `${Causa.nombreCausa}`;
        selectCausaExterna.appendChild(option);
    });
};

const getCausaExterna = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/causaExterna`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Causa Externa: ${response.statusText}`);
        }

        const Causa = await response.json();
        updateCausaExterna(Causa);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateCodDiagnostico = (codDiagnosticos) => {
    const selects = document.querySelectorAll('.listaDiagPrincipal'); // Selecciona todos los select con la clase listaDiagPrincipal
    selects.forEach((select) => {
        select.innerHTML = ""; // Limpiar opciones antiguas

        // Agregar opción "Sin Seleccionar" al principio
        const optionSinSeleccionar = document.createElement("option");
        optionSinSeleccionar.value = "";
        optionSinSeleccionar.text = "No Aplica";
        select.appendChild(optionSinSeleccionar);

        // Agregar opciones al select
        codDiagnosticos.forEach((codDiagnostico) => {
            const option = document.createElement("option");
            option.value = codDiagnostico.codigoObjeto;
            option.text = `${codDiagnostico.codigoObjeto} - ${codDiagnostico.descripcionObjeto} `;
            select.appendChild(option);
        });
    });
};

const getCodDiganostico = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/codDiagnostico`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Código Diagnóstico: ${response.statusText}`);
        }

        const codDiagnostico = await response.json();
        updateCodDiagnostico(codDiagnostico);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateTipoDiagnostico = (tipoDiagnosticos) => {
    const selectTipoDiagnostico = document.querySelector('#listaTipoDiagnostico');
    selectTipoDiagnostico.innerHTML = "";


    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectTipoDiagnostico.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    tipoDiagnosticos.forEach((tipoDiagnostico) => {
        const option = document.createElement("option");
        option.value = tipoDiagnostico.codigoObjeto;
        option.text = `${tipoDiagnostico.descripcionObjeto} `;
        selectTipoDiagnostico.appendChild(option);
    });

};

const getTipoDiagnostico = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/tipoDiagnostico`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Tipo Diagnóstico Principal: ${response.statusText}`);
        }

        const tipoDiagnostico = await response.json();
        updateTipoDiagnostico(tipoDiagnostico);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

const updateViaIngresoUsuario = (viaIngresoUsuarios) => {
    const selectViaIngresoUsuario = document.querySelector('#listaViaIngreso');
    selectViaIngresoUsuario.innerHTML = "";


    // Agregar opción "Sin Seleccionar" al principio
    const optionSinSeleccionar = document.createElement("option");
    optionSinSeleccionar.value = "Sin Seleccionar";
    optionSinSeleccionar.text = "Sin Seleccionar";
    selectViaIngresoUsuario.appendChild(optionSinSeleccionar);

    // Agregar opciones al select
    viaIngresoUsuarios.forEach((viaIngresoUsuario) => {
        const option = document.createElement("option");
        option.value = viaIngresoUsuario.codigoObjeto;
        option.text = `${viaIngresoUsuario.descripcionObjeto} `;
        selectViaIngresoUsuario.appendChild(option);
    });

};

const getViaIngresoUsuario = async () => {
    try {
        const response = await fetch(`http://${servidor}:3000/api/viaIngresoUsuario`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de Via Ingreso usuario: ${response.statusText}`);
        }

        const viaIngresoUsuario = await response.json();
        updateViaIngresoUsuario(viaIngresoUsuario);
    } catch (ex) {
        console.error(ex);
        alert(`Error: ${ex.message}`);
    }
};

let fechaInicio;
let fechaFin;

const alerta = async () => {
    // Obtener las fechas almacenadas en localStorage
    const storedFechaInicio = localStorage.getItem("fechaInicio");
    const storedFechaFin = localStorage.getItem("fechaFin");

    const { value: formValues } = await Swal.fire({
        title: "Seleccione el rango de fecha para cargar los historias clinicas",
        html: `
            <label style="color: white;">FECHA INICIO</label>
            <input type="date" id="swal-input1" class="swal2-input" value="${storedFechaInicio || ''}">

            <label style="color: white;">FECHA FIN</label>
            <input type="date" id="swal-input2" class="swal2-input" value="${storedFechaFin || ''}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            fechaInicio = document.getElementById("swal-input1").value;
            fechaFin = document.getElementById("swal-input2").value;

            // Validar que se hayan seleccionado ambas fechas
            if (fechaInicio && fechaFin) {
                // Almacenar las fechas en localStorage
                localStorage.setItem("fechaInicio", fechaInicio);
                localStorage.setItem("fechaFin", fechaFin);

                // Llamar a la función getPacientes con el rango de fechas seleccionado
                getEvaluaciones(fechaInicio, fechaFin);
            } else {
                // Mostrar un mensaje si falta alguna de las fechas
                Swal.showValidationMessage("Por favor, seleccione ambas fechas");
            }
        },
        allowOutsideClick: false // Evitar que se cierre al hacer clic fuera del SweetAlert

    });

    if (formValues) {
        Swal.fire("Pacientes Cargados correctamente");
    }
};

window.addEventListener('load', async () => {
    alerta();
    // ejecutar();
});
