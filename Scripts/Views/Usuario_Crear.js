var tabladata;
$(document).ready(function () {

    ////validamos el formulario
    $("#form").validate({
        rules: {
            Nombres: "required",
            Apellidos: "required",
            Correo: "required",
            Clave: "required"
        },
        messages: {
            Nombres: "(*)",
            Apellidos: "(*)",
            Correo: "(*)",
            Clave: "(*)"
        },
        errorElement: 'span'
    });
    var id = document.getElementById("txtAreaIni").value;
    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url":"/Usuario/Obtener/?id="+ id,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [

            { "data": "Apellidos" },
            { "data": "Nombres" },
            { "data": "Tipo_Doc" },
            { "data": "Num_Doc" },
            {
                "data": "Estado", "render": function (data) {
                    if (data) {
                        return '<span class="badge badge-success">Activo</span>'
                    } else {
                        return '<span class="badge badge-danger">Inactivo</span>'
                    }
                }
            },
            {
                "data": "IdUsuario", "render": function (data) {
                    return  "<button class='btn btn-warning btn-sm' type='button' title='Asignar Empresa' onclick='EmpresasAsignadas(" + data + ")' data-toggle='modal' data-target='#FormModal2'><i class='fa fa-building'></i></button>" +
                        "<button class='btn btn-secondary btn-sm ml-2' type='button' title='Asignar Horario' onclick='ListarEmpresaHorario("+ data +")' data-toggle='modal' data-target='#FormModal3'><i class='fa fa-calendar'></i></button>" +
                        "<button class='btn btn-primary btn-sm ml-2' type='button' title='Editar' onclick='abrirPopUpForm(" + data + ")' data-toggle='modal' data-target='#FormModal'><i class='fas fa-pen'></i></button>" +
                        "<button class='btn btn-danger btn-sm ml-2' type='button' title='Eliminar' onclick='eliminar(" + data + ")'><i class='fa fa-trash'></i></button>"
                },
                "orderable": false,
                "searchable": false,
                "width": "90px"
            }

        ],
        "language": {
            "url":'https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json'
        },
        responsive: true
    });


})
function abrirPopUpForm(id) {

    if (id == 0) {
       
        borrarDatos();
    }
    else {
        $.get("/Usuario/RecuperarDatos/?id="+ id, function (data) {
            document.getElementById("txtid").value = data[0].IdUsuario;
            document.getElementById("txtApellidos").value = data[0].Apellidos;
            document.getElementById("txtNombres").value = data[0].Nombres;
            document.getElementById("cboTipoDoc").value = data[0].Tipo_Doc;
            document.getElementById("txtNumDoc").value = data[0].Num_Doc;
            document.getElementById("txtDirecion").value = data[0].Direccion;
            document.getElementById("txtCelular").value = data[0].Celular;
            document.getElementById("txtUsuario").value = data[0].Usuario1;
            document.getElementById("txtContraseña").value = data[0].Contraseña;
            document.getElementById("cboTipoUsuario").value = data[0].IdRol;
            document.getElementById("cboArea").value = data[0].IdArea;
            ListarRol();
        });
        $('#txtContraseña').prop('readonly', true);
        $('#btnGuardarCambios').show();
        $('#btnActualizar').hide();
    }
}

function ActContraseña() {
    $('#txtContraseña').prop('readonly', false);
    $('#btnGuardarCambios').hide();
    $('#btnActualizar').show();

}

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    for (var i = 0; i < controles.length; i++) {
        controles[i].value = "";
    }
}
function Guardar() {

    var frm = new FormData();

    frm.append("IdUsuario", document.getElementById("txtid").value);
    frm.append("IdRol", document.getElementById("cboTipoUsuario").value);
    frm.append("Apellidos", document.getElementById("txtApellidos").value);
    frm.append("Nombres", document.getElementById("txtNombres").value);
    frm.append("Tipo_Doc", document.getElementById("cboTipoDoc").value);
    frm.append("Num_Doc", document.getElementById("txtNumDoc").value);
    frm.append("Direccion", document.getElementById("txtDirecion").value);
    frm.append("Celular", document.getElementById("txtCelular").value);
    frm.append("Usuario1", document.getElementById("txtUsuario").value);
    frm.append("Contraseña", document.getElementById("txtContraseña").value);
    frm.append("IdArea", document.getElementById("cboArea").value);
    frm.append("Estado", 1);

    swal({
        title: "Mensaje",
        text: "¿Desea realmente Guardar los Cambios?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "¡Sí, Guardar!",
        closeOnConfirm: false,
        html: false
    }, function () {
        $.ajax({
            type: "POST",
            url:"/Usuario/Guardar",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {
                    document.getElementById("btnCancelar").click();
                    tabladata.ajax.reload();
                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                }
                else {
                    swal("Error", "Usuario Existente(DNI/Usuario)", "error");
                }
            }
        });
    });
}
function Modificar() {

    var frm = new FormData();

    frm.append("IdUsuario", document.getElementById("txtid").value);
    frm.append("IdRol", document.getElementById("cboTipoUsuario").value);
    frm.append("Apellidos", document.getElementById("txtApellidos").value);
    frm.append("Nombres", document.getElementById("txtNombres").value);
    frm.append("Tipo_Doc", document.getElementById("cboTipoDoc").value);
    frm.append("Num_Doc", document.getElementById("txtNumDoc").value);
    frm.append("Direccion", document.getElementById("txtDirecion").value);
    frm.append("Celular", document.getElementById("txtCelular").value);
    frm.append("Usuario1", document.getElementById("txtUsuario").value);
    frm.append("Contraseña", document.getElementById("txtContraseña").value);
    frm.append("Estado", 1);
    frm.append("IdArea", document.getElementById("cboArea").value);

    swal({
        title: "Mensaje",
        text: "¿Desea realmente Guardar los Cambios?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "¡Sí, Guardar!",
        closeOnConfirm: false,
        html: false
    }, function () {
        $.ajax({
            type: "POST",
            url: "/Usuario/Actualizar",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {
                    document.getElementById("btnCancelar").click();
                    tabladata.ajax.reload();
                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                }
                else {
                    swal("Error", "Usuario Existente(DNI/Usuario)", "error");
                }
            }
        });
    });
}

function ListarRol() {
    var id = document.getElementById("cboArea").value;
    ListarRolid(id)
}
function ListarRolid(id) {
    $.get("/Usuario/ListarRol/?id="+ id, function (data) {
        LlenarCombo(data, document.getElementById("cboTipoUsuario"), true);
    });
}

function LlenarCombo(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].ID + "'>";
        contenido += data[i].Rol1;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}

var cboListar = document.getElementById("cboArea");
cboListar.onchange = function () {
    ListarRol()
}

function eliminar(id) {
    var frm = new FormData();
    frm.append("IdUsuario", id);
    swal({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar este archivo!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "¡Sí, bórralo!",
        closeOnConfirm: false,
        html: false
    }, function () {
        $.ajax({
            type: "POST",
            url:"/Usuario/Inactivo",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {

                    tabladata.ajax.reload();
                    swal("¡Eliminado!", "Tu archivo ha sido eliminado.", "success");
                }
                else {
                    swal("Error", "No se pudo Eliminar el Usuario", "error");
                }
            }
        });
    });
}

function EmpresasAsignadas(id) {

    Listar();
    function Listar() {
        $.get("/Usuario/ListarEmpresa/?id=" + id, function (data) {
            CrearListado(["Item", "Nombre","Horario"], data);
        });
        $.get("/Usuario/RecuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtidUsuario").value = data[0].IdUsuario;
        });
        ListarEmpresaId();
        document.getElementById("txtIdUsuEm").value = "0";
    }
}

function CrearListado(arrayColumnas, data) {
        var contenido = "";
        contenido += "<table id='tablas' class='table table-striped table-bordered nowrap compact' style='width: 100%'>";
        contenido += "<thead>";
        contenido += "<tr>";

        for (var i = 0; i < arrayColumnas.length; i++) {
            contenido += "<td>";
            contenido += arrayColumnas[i];
            contenido += "</td>";
        }
        contenido += "<td></td>";

        contenido += "</tr>";
        contenido += "</thead>";
        contenido += "<tbody>";

        //Obtener el nombre del campo (tabla de la BD - fila 0 = encabezado de columnas)
        if (data[0] != null) {
            var llaves = Object.keys(data[0]);
        } else {
            contenido = "<tr> No se le asigno Empresa</tr>";
        }



        //1er for para el registro de filas
        for (var j = 0; j < data.length; j++) {
            //Debo Obtener el valor de ese campo
            contenido += "<tr>";

            //2do for para el registro de las columnas de cada fila
            for (var l = 0; l < llaves.length; l++) {
                //Creo una variable que almacene el dato o valor del campo
                var valorLlaves = llaves[l];
                contenido += "<td>";
                contenido += data[j][valorLlaves];
                contenido += "</td>";
            }

            var llaveID = llaves[0];

            contenido += "<td>";
            contenido += "<button class='btn btn-primary btn-sm' type='button' onclick='RecuperarUsuEmp("+ data[j][llaveID] +")'><i class='fas fa-pen'></i></button>" +
             "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='eliminarUsuEm("+ data[j][llaveID] +")'><i class='fa fa-trash'></i></button>";
           
            contenido += "</td>";

            contenido += "</tr>";
        }
        contenido += "</tbody>";
        contenido += "</table>";

        document.getElementById("divTabla").innerHTML = contenido;
        $("#tablas").dataTable({
            searching: false,
            language: {
                "url": 'https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json'
            },
        });

}

ListarEmpresaId();
function ListarEmpresaId() {
    $.get("/Usuario/ObtenerEmpresa", function (data) {
        LlenarCombo1(data, document.getElementById("cboEm"), true);
        $('#cboEm').select2();
    });
    
}

function LlenarCombo1(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='"+ data[i].IdEmpresa +"'>";
        contenido += data[i].Nombre;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}




/*$(document).ready(function () {
    $(function () {
        $.ajax({
            type: "GET",
            url:"/Usuario/ObtenerEmpresa",
            success: function (data) {
                $.each(data, function (indice, data) {
                    $("#cboEm").append("<option value='"+ data.IdEmpresa +"'>"+ data.Nombre +"</option>");
                });
                $('#cboEm').select2();
            }
        });
    });
});*/

function GuardarUsuarioEmpresa() {

    var frm = new FormData();
    frm.append("IdUsuarioEmpresa", document.getElementById("txtIdUsuEm").value);
    frm.append("IdUsuario", document.getElementById("txtidUsuario").value);
    frm.append("IdEmpresa", document.getElementById("cboEm").value);
    frm.append("tipo_Horario", document.getElementById("cboHor").value);

    swal({
        title: "Mensaje",
        text: "¿Desea realmente Guardar los Cambios?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "¡Sí, Guardar!",
        closeOnConfirm: false,
        html: false
    }, function () {
        $.ajax({
            type: "POST",
            url:"/Usuario/Guardar_UsuarioEmpresa",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {
                    
                    //document.getElementById("btnCancelar").click();
                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                    var idu = document.getElementById("txtidUsuario").value;
                    EmpresasAsignadas(idu);
                }
                else {
                    swal("Error","Empresa ya se encuenta asignada","error");
                }
            }
        });
    });
}

function RecuperarUsuEmp(id) {
    
    $.get("/Usuario/RecuperarUsuarioEmp/?id="+ id, function (data) {
        document.getElementById("txtIdUsuEm").value = data[0].IdUsuarioEmpresa;
        document.getElementById("cboEm").value = data[0].IdEmpresa;
        $('#cboEm').select2();
    });
    
}

function eliminarUsuEm(id) {
    var frm = new FormData();
    frm.append("IdUsuarioEmpresa",id);
    swal({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar este archivo!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "¡Sí, bórralo!",
        closeOnConfirm: false,
        html: false
    }, function () {
        $.ajax({
            type: "POST",
            url:"/Usuario/EliminarUsuarioEmpresa",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {
                    swal("¡Eliminado!", "Tu archivo ha sido eliminado.", "success");
                    var idu = document.getElementById("txtidUsuario").value;
                    EmpresasAsignadas(idu);
                }
                else {
                    swal("Error", "No se pudo Eliminar el registro", "error");
                }
            }
        });
    });
}

ListarArea();
function ListarArea() {
    var id = document.getElementById("txtAreaIni").value;
    if (id = 1) {
        $.get("/Usuario/ListarArea1", function (data) {
            LlenarComboArea(data, document.getElementById("cboArea"), true);
        });
    } else {
        $.get("/Usuario/ListarArea/?id=" + id, function (data) {
            LlenarComboArea(data, document.getElementById("cboArea"), true);
        });
    }
   
}

function LlenarComboArea(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].ID + "'>";
        contenido += data[i].Nombre;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}

// listar empresa para horario
function ListarEmpresaHorario(id) {
    $.get("/Usuario/ListarEmpresa/?id=" + id, function (data) {
        LlenarComboEmpresaHorario(data, document.getElementById("cboEmpresaHorario"), true);
    });

}

function LlenarComboEmpresaHorario(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].IdEmpresa + "'>";
        contenido += data[i].Nombre;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}
// listar Tipo_Horario

ListarHorario();
function ListarHorario() {
    $.get("/Usuario/ListarHorario", function (data) {
        LlenarComboHorario(data, document.getElementById("cboHor"), true);
    });

}
function LlenarComboHorario(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].IdTipoHorario + "'>";
        contenido += data[i].Descripcion;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}

