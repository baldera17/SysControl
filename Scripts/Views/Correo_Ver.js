ListarEmpresa();
function ListarEmpresa() {
    $.get("/Marcador/ListarEmpresa", function (data) {
        LlenarCombo(data, document.getElementById("cboEmpresa"), true);
    });
}

function LlenarCombo(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='"+ data[i].ID + "'>";
        contenido += data[i].Nombre;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
};


var Correo = document.getElementById("cboEmpresa");
Correo.onchange = function () {
    var id = document.getElementById("cboEmpresa").value;
    CorreoListar(id);
};


function CorreoListar(id) {
    $.get("/Correos/CorreosMostrar/?id="+ id, function (data) {

            document.getElementById("txtPrincipal").value = data[0].Correo_Principal;
            document.getElementById("txtAsunto").value = data[0].Asunto;
    
    });
};

