
var tabladata;
$(document).ready(function () {

    ////validamos el formulario
    $("#form").validate({
        rules: {
            numerodocumento: "required",
            nombres: "required",
            direccion: "required",
            telefono: "required"
        },
        messages: {
            numerodocumento: "(*)",
            nombres: "(*)",
            direccion: "(*)",
            telefono: "(*)"
        },
        errorElement: 'span'
    });




    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url":"/Empresa/Listar",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "RUC" },
            { "data": "Direccion" },
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
                "data": "IdEmpresa", "render": function (data, type, row, meta) {
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
        AsignarUbicacion();
    }
    else {
        $.get("/Empresa/RecuperarDatos/?id="+ id, function (data) {
            document.getElementById("txtid").value = data[0].IdEmpresa;
            document.getElementById("txtNombre").value = data[0].Nombre;
            document.getElementById("txtRuc").value = data[0].RUC;
            document.getElementById("txtDireccion").value = data[0].Direccion;
            var la= document.getElementById("us3-lat").value = data[0].Latitud;
            var lo=document.getElementById("us3-lon").value = data[0].Longitud;
            var ra=document.getElementById("us3-radius").value = data[0].Radio;

            $('#us3').locationpicker({
                location: {
                    latitude: la,
                    longitude: lo
                },
                radius: ra,
                zoom: 18,
                inputBinding: {
                    latitudeInput: $('#us3-lat'),
                    longitudeInput: $('#us3-lon'),
                    radiusInput: $('#us3-radius'),
                    locationNameInput: $('#us3-address')
                },
                enableAutocomplete: true,
                onchanged: function (currentLocation, radius, isMarkerDropped) {
                    // Uncomment line below to show alert on each Location Changed event
                    //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
                }
            });
            $('#FormModal').on('shown.bs.modal', function () {
                $('#us3').locationpicker('autosize');
            });

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
    frm.append("IdEmpresa", document.getElementById("txtid").value);
    frm.append("Nombre", document.getElementById("txtNombre").value);
    frm.append("RUC", document.getElementById("txtRuc").value);
    frm.append("Direccion", document.getElementById("txtDireccion").value);
    frm.append("Estado", 1);
    frm.append("IdUbicacionEmpresa", document.getElementById("txtidubi").value);
    frm.append("Latitud", document.getElementById("us3-lat").value);
    frm.append("Longitud", document.getElementById("us3-lon").value);
    frm.append("Radio", document.getElementById("us3-radius").value);
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
            url:"/Empresa/Guardar",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {
                    tabladata.ajax.reload();
                    document.getElementById("btnCancelar").click();
                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                }
                else {
                    swal("Error", "Empresa Existente(RUC)", "error");
                }
            }
        });
    });
}

function eliminar(id) {
    var frm = new FormData();
    frm.append("IdEmpresa", id);
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
            url:"/Empresa/EliminarDatos",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {

                    tabladata.ajax.reload();
                    swal("¡Eliminado!", "Tu archivo ha sido eliminado.", "success");
                }
                else {
                    swal("Error", "No se pudo Registro", "error");
                }
            }
        });
    });
}

//AsignarUbicacion();
function AsignarUbicacion() {
    
    $('#us3').locationpicker({
        location: {
           latitude: -12.04318,
            longitude: -77.02824
        },
        radius: 50,
        zoom: 18, 
        inputBinding: {
            latitudeInput: $('#us3-lat'),
            longitudeInput: $('#us3-lon'),
            radiusInput: $('#us3-radius'),
            locationNameInput: $('#us3-address')
        },
        enableAutocomplete: true,
        onchanged: function (currentLocation, radius, isMarkerDropped) {
            // Uncomment line below to show alert on each Location Changed event
            //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
        }
    });
    $('#FormModal').on('shown.bs.modal', function () {
        $('#us3').locationpicker('autosize');
    });
}
