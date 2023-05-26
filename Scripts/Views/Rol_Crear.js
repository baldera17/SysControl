
var tabladata;
$(document).ready(function () {
    ////validamos el formulario
    $("#form").validate({
        rules: {
            Descripcion: "required"
        },
        messages: {
            Descripcion: "(*)"
        },
        errorElement: 'span'
    });

    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url":"/Rol/Obtener",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "Area" },
            { "data": "Rol" },
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
                "data": "IdRol", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-primary btn-sm' type='button' onclick='abrirPopUpForm("+ data +")'><i class='fas fa-pen'></i></button>" +
                        "<button class='btn btn-danger btn-sm ml-2' type='button' onclick='eliminar("+ data +")'><i class='fa fa-trash'></i></button>"
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
        ListarArea();
    }
    else {
        $.get("/Rol/RecuperarDatos/?id="+ id, function (data) {
            document.getElementById("txtid").value = data[0].IdRol;
            document.getElementById("txtDescripcion").value = data[0].Rol1;
            document.getElementById("cboArea").value = data[0].IdArea;
        });
    }
    $('#FormModal').modal('show');

}

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    for (var i = 0; i < controles.length; i++) {
        controles[i].value = "";
    }
}
function Guardar() {
        var frm = new FormData();

        frm.append("IdRol", document.getElementById("txtid").value);
        frm.append("Rol1", document.getElementById("txtDescripcion").value);;
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
                url:"/Rol/Guardar",
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
                        swal("Error", "No se pudo guardar el registro", "error");
                    }
                }
            });
        });
   

}

ListarArea();
function ListarArea() {
    $.get("/Rol/ListarArea", function (data) {
        LlenarComboArea(data, document.getElementById("cboArea"), true);
    });
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


