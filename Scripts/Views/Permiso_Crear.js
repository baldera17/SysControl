var tabladata;
function buscar() {
    if ($("#cboRol").val() == 0) {
        swal("Mensaje", "Seleccione un rol", "warning")
        return;
    }
    //OBTENER PERMISOS
    jQuery.ajax({
        url:"/Permisos/Obtener/?id="+ $("#cboRol").val(),
        type:"GET",
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        success: function (data) {
            $(".card-load").LoadingOverlay("hide");

            $("#tbpermiso tbody").html("");

            if (data != undefined) {
                $.each(data, function (i, row) {
                    $("<tr>").append(
                        $("<td>").text(i + 1),
                        $("<td>").append(
                            $("<input class='permiso'>").attr({ "type": "checkbox"}).data("IdPermiso", row.IdPermiso ).prop('checked', row.Estado)
                        ),
                        $("<td>").text(row.Nombre),
                        //$("<td>").append(
                           // $("<input class='leer'>").attr({ "type": "checkbox" }).data("Leer", row.Leer).prop('checked', row.Leer)
                        //),
                       /* $("<td>").append(
                            $("<input>").attr({ "type": "checkbox" }).data("IdPermiso", row.IdPermiso).prop('checked', row.Registrar)
                        ),
                        $("<td>").append(
                            $("<input>").attr({ "type": "checkbox" }).data("IdPermiso", row.IdPermiso).prop('checked', row.Editar)
                        ),
                        $("<td>").append(
                            $("<input>").attr({ "type": "checkbox" }).data("IdPermiso", row.IdPermiso).prop('checked', row.Eliminar)
                        )*/
                    ).appendTo("#tbpermiso tbody");

                })

            }
        },
        error: function (error) {

        },
        beforeSend: function () {

            $(".card-load").LoadingOverlay("show");

        },
    });


}


ListarArea();
function ListarArea() {
    $.get("/Permisos/ListarArea", function (data) {
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


function ListarRol() {
    var id = document.getElementById("cboArea").value;
    ListarRolid(id);
}

function ListarRolid(id) {
    $.get("/Permisos/ListarRol/?id="+ id , function (data) {
        LlenarComboRol(data, document.getElementById("cboRol"), true);
    });
}

function LlenarComboRol(data, control, primerElemento) {
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

function Guardar() {

    if ($("#cboRol").val() == 0) {
        swal("Mensaje", "Seleccione un rol", "warning")
        return;
    }
    if ($("#tbpermiso tbody tr").length == 0) {
        swal("Mensaje", "No hay datos", "warning")
        return;
    }


    var $xml = "<DETALLE>"
    var permiso = "";
    
    $('input[type="checkbox"]').each(function () {
        var idpermiso = $(this).data("IdPermiso");
        var activo = $(this).prop("checked") == true ? "1" : "0";
      
       
        permiso = permiso + "<PERMISO><IdPermisos>" + idpermiso + "</IdPermisos><Activo>" + activo + "</Activo></PERMISO>";
        
    });
   
    $xml = $xml + permiso;
    $xml = $xml + "</DETALLE>"

    var request = { xml: $xml };
    console.log(request)
    jQuery.ajax({
        url:"Permisos/Guardar",
        type: "POST",
        data: JSON.stringify(request),
        dataType:"json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $(".card-load").LoadingOverlay("hide");

            if (data.resultado) {
               // $("#cboRol").val(0);
                swal("Mensaje", "Registro Guardado correctamente", "success")
                $("#tbpermiso tbody").html("");
            } else {

                swal("Mensaje", "No se pudo guardar los cambios", "warning")
            }
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {
            $(".card-load").LoadingOverlay("show");
        },
    });
}

