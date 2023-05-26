var btnIngresar = document.getElementById("btnIngresar");
btnIngresar.onclick = function () {

    var usuario = document.getElementById("txtUsuario").value;
    var contraseña = document.getElementById("txtPassword").value;

    if (usuario == "") {
        alert("Falta Ingresar al Usuario.");
        return;
    }
    if (pwd == "") {
        alert("Falta Ingresar la Contraseña del Usuario");
        return;
    }


    $.get("Login/Index/?correo="+ usuario + "&clave="+ contraseña, function (data) {

        if (data == 1) {
            //document.location.href ="Home/Index";
            document.location.href = '@Url.Action("Index","Home")';
        }
        else {
            alert("Ocurrio un Error en los datos.");
        }


    });


}