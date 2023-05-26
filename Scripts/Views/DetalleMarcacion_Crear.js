var tabladata;
$(document).ready(function () {
    var id = document.getElementById("txtAreaIni").value;
    tabladata = $('#tbdata').DataTable({
        "ajax": {
            "url":"/DetalleMarcacion/Obtener/?id="+ id,
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "Fecha"},
            { "data": "Usuario" },
            { "data": "Nombre" },
            { "data": "Hora_Inicio" },
            //{ "data": "Hora_Fin" },
            {
                "data": "Hora_Fin",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        var edita = row.Edita;
                        if (edita == null) {
                            return data;
                            $('.text-primary').popover('dispose')
                        } else {
                                $(function () {
                                    $('.text-primary').popover({ toggle: "popover", title :"Mensaje", content:"Registro editado po: "+row.Edita })
                                });
                            
                            return row.Hora_Fin + " " + "<a  class='text-primary'><i class='fa fa-question-circle'></i></a>";
                        }
                        
                    } else {
                        $('.text-primary').popover({
                            trigger: 'focus'
                        })
                        return data;
                    }
                }
            },
            { "data": "Horas_Trabajadas" },
            {
                "data": "IdDetalle_Ubicacion", "render": function (data, type, row, meta) {
                    return "<button class='btn btn-info btn-sm btn-sm' type='button' title='Mapa Inicio' onclick='ModalMapa(" + data + ")'><i class='fa fa-map'></i></button>" +
                        "<button class='btn btn-warning btn-sm ml-2' type='button' title='Mapa Fin' onclick='ModalMapa2(" + data + ")'><i class='fa fa-map'></i></button>" +
                        "<button class='btn btn-success btn-sm ml-2' type='button' title='Editar' onclick='ModalDetalle(" + data + ")'><i class='fas fa-pen'></i></button>" 
                      
                        
                },
                "orderable": false,
                "searchable": false,
                "width": "90px",
                
            }
        ],

        "language": {
            "url":'https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json'
        }, 
        responsive: true,
        dom: 'Bfrtlip',
        buttons: [
            {
                extend:'excelHtml5',
                text:'<i class="fas fa-file-excel"></i> ',
                titleAttr:'Exportar a Excel',
                className:'btn btn-success'
            },
            {
                extend:'pdfHtml5',
                text:'<i class="fas fa-file-pdf"></i> ',
                titleAttr: 'Exportar a PDF',
                className:'btn btn-danger'
            },
            {
                extend:'print',
                text:'<i class="fa fa-print"></i> ',
                titleAttr:'Imprimir',
                className:'btn btn-info'
            },
        ]	                
    });
})

function ModalMapa(id) {

    $.get("/DetalleMarcacion/RecuperarDatos/?id=" + id, function (data) {
        document.getElementById("txtIdDetalle").value = data[0].IdDetalleUbicacion;
        document.getElementById("txtlatitud").value = data[0].Latitud;
        document.getElementById("txtLongitd").value = data[0].Longitug;
        findMe1();
    });
    $('#FormModal1').modal('show');
}
function ModalMapa2(id) {

    $.get("/DetalleMarcacion/DatosFinServicio/?id=" + id, function (data) {
        document.getElementById("txtIdDetalle1").value = data[0].IdDetalleUbicacion;
        document.getElementById("txtlatitudFin").value = data[0].Fin_Latitud;
        document.getElementById("txtLongitdFin").value = data[0].fin_Longitud;
        findMe2();
    });
    $('#FormModal2').modal('show');
}
ListarUsuario();
function ListarUsuario() {
    var id = document.getElementById("txtAreaIni").value;
    $.get("/DetalleMarcacion/ListarUsuario/?id="+ id, function (data) {
        LlenarComboU(data, document.getElementById("cboUsuario"), true);
        $('#cboUsuario').select2();
    });
}
function LlenarComboU(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].IdUsuario + "'>";
        contenido += data[i].Apellidos + " " + data[i].Nombres;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}

ListarEmpresa();
function ListarEmpresa() {
    $.get("/DetalleMarcacion/ListarEmpresa", function (data) {
        LlenarCombo(data, document.getElementById("cboEmpresa"), true);
        $('#cboEmpresa').select2();
    });
}
function LlenarCombo(data, control, primerElemento) {
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
$(document).ready(function () {
    var dat = document.getElementById("txtAreaIni").value;
    $("#txtidar").val(dat);
})


function ModalDetalle(id) {
    if (id == 0) {
        
        borrarDatos();
        ActivarControles();
        
    } else {
        $.get("/DetalleMarcacion/RecuperarMarcacion/?id=" + id, function (data) {
            document.getElementById("txtid").value = data[0].IdDetalle_Ubicacion;
            document.getElementById("cboUsuario").value = data[0].IdUsuario;
            document.getElementById("cboEmpresa").value = data[0].IdEmpresa;
            document.getElementById("txtFecha").value = data[0].Fecha;
            document.getElementById("txtHInicio").value = data[0].Hora_Inicio;
            document.getElementById("txtHFin").value = data[0].Hora_Fin;
            $('#cboUsuario').select2();
            $('#cboEmpresa').select2();
            DesactivarControles();
        });
    }
    $('#FormModal').modal('show');
  
}

Relojdigital();
function Relojdigital() {

    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();
    var reloj = document.getElementById("txtHFin");
    if (hora < 10) { hora = "0" + hora }
    if (minutos < 10) { minutos = "0" + minutos }
    if (segundos < 10) { segundos = "0" + segundos }
    reloj.textContent = hora + ":" + minutos + ":" + segundos;

}

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    for (var i = 0; i < controles.length; i++) {
        controles[i].value = "";
    }
    ListarEmpresa();
}

function DesactivarControles() {
    $('#cboUsuario').prop('disabled', true);
    $('#cboEmpresa').prop('disabled', true);
    $('#txtFecha').prop('disabled', true);
}
function ActivarControles() {
    $('#cboUsuario').prop('disabled', false);
    $('#cboEmpresa').prop('disabled', false);
    $('#txtFecha').prop('disabled', false);
}
function findMe1() {
    var output = document.getElementById('map');
    var latitude = document.getElementById("txtlatitud").value;
    var longitude = document.getElementById("txtLongitd").value;
    // The location of Uluru
    const uluru = { lat: +latitude, lng: +longitude };
    // The map, centered at Uluru
    const map = new google.maps.Map(output, {
        zoom: 19,
        center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title: "Inicio de Servicio",
    });
}

function findMe2() {
    var output = document.getElementById('map1');
    var latitude = document.getElementById("txtlatitudFin").value;
    var longitude = document.getElementById("txtLongitdFin").value;
    // The location of Uluru
    const uluru = { lat: +latitude, lng: +longitude };
    // The map, centered at Uluru
    const map = new google.maps.Map(output, {
        zoom: 19,
        center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title:"Fin de Servicio",
    });
}

$("#txtFechaInicio").datepicker(
    {
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    }
);
$("#txtFechaFin").datepicker(
    {
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    }
);

$("#txtFecha").datepicker(
    {
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    }
);

function buscar1() {
    var id = document.getElementById("txtAreaIni").value;
    var FechaInicio = document.getElementById("txtFechaInicio").value;
    var FechaFin = document.getElementById("txtFechaFin").value;
    if ($("#txtFechaInicio").val().trim() == "" || $("#txtFechaFin").val().trim() == "") {
        swal("Mensaje", "Debe ingresar fechas", "warning")
        return;
    }

    tabladata.ajax.url("DetalleMarcacion/Buscar/?id=" + id + "&inicio=" + FechaInicio + "&fin=" + FechaFin).load();
}

function Modificar() {

    var frm = new FormData();

    frm.append("IdDetalle_Ubicacion", document.getElementById("txtid").value);
    frm.append("Hora_Inicio", document.getElementById("txtHInicio").value);
    frm.append("Hora_Fin", document.getElementById("txtHFin").value);
    frm.append("Edita", document.getElementById("txtAdministrador").textContent);

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
            url:"/DetalleMarcacion/Editar",
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
                    swal("Error", "No se edito el registro", "error");
                }
            }
        });
    });

}
