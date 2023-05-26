
//$('#btnFinalizar').prop('disabled', true);

$(document).ready(function () {

    $("#txtfechaventa").val(ObtenerFecha());
})

function ObtenerFecha() {

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + (('' + day).length < 2 ? '0' : '')+ day ;

    return output;
}

function Relojdigital() {

    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();
    var reloj = document.getElementById("txtHora");
    if (hora < 10) { hora = "0" + hora }
    if (minutos < 10) { minutos = "0" + minutos }
    if (segundos < 10) { segundos = "0" + segundos }
    reloj.textContent = hora + ":" + minutos + ":" + segundos;

}

setInterval(() => {
    Relojdigital()
}, 1000);

ListarEmpresas();
function ListarEmpresas() {
    var id = document.getElementById("txtIdUsuario").value;
    ListarEmpresa(id);
   
}
function ListarEmpresa(id) {
    $.get("/Marcador/ListarEmpresa/?id="+ id , function (data) {
        LlenarCombo(data, document.getElementById("cboEmpresa"), true);
    });
   
}

function LlenarCombo(data, control, primerElemento) {
    var contenido = "";

    if (primerElemento == true) {
        contenido += "<option value=''> --Seleccione--</option>";
    }

    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='"+ data[i].IdEmpresa + "'>";
        contenido += data[i].Nombre;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}

var cboListar = document.getElementById("cboEmpresa");
cboListar.onchange = function () {
    var id = document.getElementById("cboEmpresa").value;

    //para cuando coloque --seleccione-- me limpie el filtro

    if (id == "") {
        document.getElementById("txtLa").value = "";
        document.getElementById("txtLo").value = "";
        document.getElementById("txtRa").value = "";
    }
    else {
        ListarEmpresaMarcar(id);
    }
}

ListarEmpresasMarcar()
function ListarEmpresasMarcar() {

    var id = document.getElementById("cboEmpresa").value;

    if (id == 0) {
        document.getElementById("txtLa").value = "";
        document.getElementById("txtLo").value = "";
        document.getElementById("txtRa").value = "";
    } else {
        ListarEmpresaMarcar(id);
    }

}

function ListarEmpresaMarcar(id) {
    $.get("/Marcador/ListarEmpresaMarcar/?id=" + id, function (data) {
        document.getElementById("txtLa").value = data[0].Latitud;
        document.getElementById("txtLo").value = data[0].Longitud;
        document.getElementById("txtRa").value = data[0].Radio;
       // findMe1();
    });
}
//Guardar en la base de Datos
function GuardarDatos() {

    var La = document.getElementById("txtLa").value;
    var Lo = document.getElementById("txtLo").value;
    var Ra = document.getElementById("txtRa").value;
    
    if (La == "") {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -12.074444695950797, lng: -77.1002298492359 },
            zoom: 18
        });

        var marker = new google.maps.Marker({
            position: { lat: -12.074444695950797, lng: -77.1002298492359 },
            map: map
        });

        var alerta = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: { lat: -12.074444695950797, lng: -77.1002298492359 },
            radius: 11
        });

    } else {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: +La, lng: +Lo },
            zoom: 18
        });

        var marker = new google.maps.Marker({
            position: { lat: +La, lng: +Lo },
            map: map
        });

        var alerta = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: { lat: +La, lng: +Lo },
            radius: +Ra
        });

        function localizacion(posicion) {

            var latitude = posicion.coords.latitude;
            var longitude = posicion.coords.longitude;

            document.getElementById('us3-lat').value = latitude;
            document.getElementById('us3-lon').value = longitude;
            const uluru = { lat: +latitude, lng: +longitude };

            const marker = new google.maps.Marker({
                position: uluru,
                map: map,

            });

            var frm = new FormData();
            frm.append("IdUbicacion", document.getElementById("txtIdUbicacion").value);
            frm.append("IdUsuario", document.getElementById("txtIdUsuario").value);
            frm.append("Fecha", document.getElementById("txtfechaventa").value);
            frm.append("Estado", 1);
            frm.append("IdDetalle_Ubicacion", document.getElementById("txtIdDetalleUbicacion").value);
            frm.append("IdEmpresa", document.getElementById("cboEmpresa").value);
            frm.append("Hora_Inicio", document.getElementById("txtHora").textContent);
            frm.append("Hora_Fin", document.getElementById("txtHora").textContent);
            frm.append("Latitud", document.getElementById("us3-lat").value);
            frm.append("Longitug", document.getElementById("us3-lon").value);
            var imgFoto = document.getElementById("imgFoto").src.replace("data:image/png;base64,", "")
            frm.append("Foto", imgFoto);
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
                var lat = document.getElementById("us3-lat").value;
                if (lat == "") {
                    swal("Error", "Activa tu Ubicacion", "error");
                } else {
                    var isInRadius = google.maps.geometry.spherical.computeDistanceBetween(
                        uluru, alerta.getCenter()) <= alerta.radius;
                    //console.log(isInRadius);
                    if (isInRadius == false) {
                        //window.location.reload();
                        swal("Error", "No se encuentra en el area de servicio", "error");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        $.ajax({
                            type: "POST",
                            url: "/Marcador/GuardarDatos",
                            data: frm,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data != 0) {
                                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 2000);
                                }
                                else {
                                    swal("Error", "No se registro tu asistencia", "error");
                                }
                            }
                        });
                    }
                   
                }
            });


            
        }
        function error() {
            alert("Tienes que activar tu Ubicacion");
        }

        navigator.geolocation.getCurrentPosition(localizacion, error);

    }


}


findMe()
function findMe() {
    if (navigator.geolocation) {
    } else {
        alert("Tu navegador no soporte geolocalizacion");
    }
    function localizacion(posicion) {

        var latitude = posicion.coords.latitude;
        var longitude = posicion.coords.longitude;

        document.getElementById('us3-lat').value = latitude;
        document.getElementById('us3-lon').value = longitude;
    }

    function error() {
        alert("Tienes que activar tu Ubicacion");

    }

    navigator.geolocation.getCurrentPosition(localizacion, error);
}

/*
    Tomar una fotografía y descargarla
    @date 2019-04-23
    @author parzibyte
    @web parzibyte.me/blog
*/
function TomarFoto() {
    const tieneSoporteUserMedia = () =>
        !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
    const _getUserMedia = (...arguments) =>
        (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);

    // Declaramos elementos del DOM
    const $video = document.querySelector("#video"),
        $canvas = document.querySelector("#canvas"),
        $boton = document.querySelector("#boton"),
        $listaDeDispositivos = document.querySelector("#listaDeDispositivos");

    const limpiarSelect = () => {
        for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--)
            $listaDeDispositivos.remove(x);
    };
    const obtenerDispositivos = () => navigator
        .mediaDevices
        .enumerateDevices();

    // La función que es llamada después de que ya se dieron los permisos
    // Lo que hace es llenar el select con los dispositivos obtenidos
    const llenarSelectConDispositivosDisponibles = () => {

        limpiarSelect();
        obtenerDispositivos()
            .then(dispositivos => {
                const dispositivosDeVideo = [];
                dispositivos.forEach(dispositivo => {
                    const tipo = dispositivo.kind;
                    if (tipo === "videoinput") {
                        dispositivosDeVideo.push(dispositivo);
                    }
                });

                // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
                if (dispositivosDeVideo.length > 0) {
                    // Llenar el select
                    dispositivosDeVideo.forEach(dispositivo => {
                        const option = document.createElement('option');
                        option.value = dispositivo.deviceId;
                        option.text = dispositivo.label;
                        $listaDeDispositivos.appendChild(option);
                    });
                }
            });
    }

    (function () {
        // Comenzamos viendo si tiene soporte, si no, nos detenemos
        if (!tieneSoporteUserMedia()) {
            alert("Lo siento. Tu navegador no soporta esta característica");
            $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
            return;
        }
        //Aquí guardaremos el stream globalmente
        let stream;


        // Comenzamos pidiendo los dispositivos
        obtenerDispositivos()
            .then(dispositivos => {
                // Vamos a filtrarlos y guardar aquí los de vídeo
                const dispositivosDeVideo = [];

                // Recorrer y filtrar
                dispositivos.forEach(function (dispositivo) {
                    const tipo = dispositivo.kind;
                    if (tipo === "videoinput") {
                        dispositivosDeVideo.push(dispositivo);
                    }
                });

                // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
                // y le pasamos el id de dispositivo
                if (dispositivosDeVideo.length > 0) {
                    // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
                    mostrarStream(dispositivosDeVideo[0].deviceId);
                }
            });

        const mostrarStream = idDeDispositivo => {
            _getUserMedia({
                video: {
                    // Justo aquí indicamos cuál dispositivo usar
                    deviceId: idDeDispositivo,
                }
            },
                (streamObtenido) => {
                    // Aquí ya tenemos permisos, ahora sí llenamos el select,
                    // pues si no, no nos daría el nombre de los dispositivos
                    llenarSelectConDispositivosDisponibles();

                    // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
                    $listaDeDispositivos.onchange = () => {
                        // Detener el stream
                        if (stream) {
                            stream.getTracks().forEach(function (track) {
                                track.stop();
                            });
                        }
                        // Mostrar el nuevo stream con el dispositivo seleccionado
                        mostrarStream($listaDeDispositivos.value);
                    }

                    // Simple asignación
                    stream = streamObtenido;

                    // Mandamos el stream de la cámara al elemento de vídeo
                    $video.srcObject = stream;
                    $video.play();

                    //Escuchar el click del botón para tomar la foto
                    $boton.addEventListener("click", function () {

                        //Pausar reproducción
                        $video.pause();

                        //Obtener contexto del canvas y dibujar sobre él
                        let contexto = $canvas.getContext("2d");
                        $canvas.width = $video.videoWidth;
                        $canvas.height = $video.videoHeight;
                        contexto.drawImage($video, 0, 0, $canvas.width, $canvas.height);

                        var img = document.getElementById("imgFoto");

                        let foto = $canvas.toDataURL(); //Esta es la foto, en base 64

                        let enlace = document.createElement('a'); // Crear un <a>
                        //enlace.download = "foto_parzibyte.me.png";
                        enlace.href = foto;
                        img.src = enlace;
                        enlace.click();
                        document.getElementById("btnCancelar").click();
                        var emp = document.getElementById("cboEmpresa").value;
                        if (emp == "") {
                            swal("Error", "Seleccione Empresa", "error");
                        } else {
                            GuardarDatos();
                        }
                        
                        //Reanudar reproducción
                        //$video.play();

                    });
                }, (error) => {
                    console.log("Permiso denegado o error: ", error);
                    $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
                });
        }
    })();
};

verUltimaUbi();
function verUltimaUbi() {
    var id = document.getElementById("txtIdUsuario").value;
    UltimaUbi(id);
}

function UltimaUbi(id) {
     
    $.get("/Marcador/UltimaMarcacion/?id=" + id, function (data) {

        $('#btnFinalizar').prop('disabled', true);

        var ultima = document.getElementById("txtUltima").value = data[0].IdUbicacion;
        var HFin = document.getElementById("txtHoraFin").value = data[0].Hora_Fin;

            if (HFin == null && ultima != null) {
                document.getElementById("cboEmpresa").value = data[0].IdEmpresa;
                $('#cboEmpresa').prop('disabled', true);
                $('#btnFinalizar').prop('disabled', false);
                $('#btnNuevaFoto').prop('disabled', true);
                ListarEmpresasMarcar();
            } else {
                $('#btnFinalizar').prop('disabled', true);
                $('#btnNuevaFoto').prop('disabled', false);
            }
    
    });
}


function FinalizarServicio() {
    var La = document.getElementById("txtLa").value;
    var Lo = document.getElementById("txtLo").value;
    var Ra = document.getElementById("txtRa").value;
    if (La == "") {
        var map = new google.maps.Map(document.getElementById('map1'), {
            center: { lat: -12.074444695950797, lng: -77.1002298492359 },
            zoom: 18
        });

        var marker = new google.maps.Marker({
            position: { lat: -12.074444695950797, lng: -77.1002298492359 },
            map: map
        });

        var alerta = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: { lat: -12.074444695950797, lng: -77.1002298492359 },
            radius: 11
        });

    } else {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: +La, lng: +Lo },
            zoom: 18
        });

        var marker = new google.maps.Marker({
            position: { lat: +La, lng: +Lo },
            map: map
        });

        var alerta = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: { lat: +La, lng: +Lo },
            radius: +Ra
        });

        function localizacion(posicion) {

            var latitude = posicion.coords.latitude;
            var longitude = posicion.coords.longitude;

            document.getElementById('us3-lat').value = latitude;
            document.getElementById('us3-lon').value = longitude;
            const uluru = { lat: +latitude, lng: +longitude };

            const marker = new google.maps.Marker({
                position: uluru,
                map: map,

            });

            var frm = new FormData();
            frm.append("IdUbicacion", document.getElementById("txtUltima").value);
            frm.append("Hora_Fin", document.getElementById("txtHora").textContent);
            frm.append("Fin_Latitud", document.getElementById("us3-lat").value);
            frm.append("fin_Longitud", document.getElementById("us3-lon").value);
            var imgFoto = document.getElementById("imgFoto").src.replace("data:image/png;base64,","")
            frm.append("Foto_Fin", imgFoto);
            swal({
                title: "Mensaje",
                text: "¿Desea realmente Finalizar?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "¡Sí, Guardar!",
                closeOnConfirm: false,
                html: false
            }, function () {
                var lat = document.getElementById("us3-lat").value;
                if (lat == "") {
                    swal("Error", "Activa tu Ubicacion", "error");
                } else {
                    var isInRadius = google.maps.geometry.spherical.computeDistanceBetween(
                        uluru, alerta.getCenter()) <= alerta.radius;
                    //console.log(isInRadius);
                    if (isInRadius == false) {
                        // $('#btnNuevaFoto').prop('disabled', true);
                        swal("Error", "No se encuentra en el area de servicio", "error");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        $.ajax({
                            type: "POST",
                            url: "/Marcador/FinalizarServicio",
                            data: frm,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data != 0) {

                                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 2000);
                                }
                                else {
                                    swal("Error", "No Se registro tu Salida", "error");
                                }
                            }
                        });
                    }
                    
                }
            });

            
        }
        function error() {
            alert("Tienes que activar tu Ubicacion");
        }

        navigator.geolocation.getCurrentPosition(localizacion, error);

    }





    
}

function TomarFoto1() {
    const tieneSoporteUserMedia = () =>
        !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
    const _getUserMedia = (...arguments) =>
        (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);

    // Declaramos elementos del DOM
    const $video = document.querySelector("#video1"),
        $canvas = document.querySelector("#canvas1"),
        $boton = document.querySelector("#boton1"),
        $listaDeDispositivos = document.querySelector("#listaDeDispositivos1");

    const limpiarSelect = () => {
        for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--)
            $listaDeDispositivos.remove(x);
    };
    const obtenerDispositivos = () => navigator
        .mediaDevices
        .enumerateDevices();

    // La función que es llamada después de que ya se dieron los permisos
    // Lo que hace es llenar el select con los dispositivos obtenidos
    const llenarSelectConDispositivosDisponibles = () => {

        limpiarSelect();
        obtenerDispositivos()
            .then(dispositivos => {
                const dispositivosDeVideo = [];
                dispositivos.forEach(dispositivo => {
                    const tipo = dispositivo.kind;
                    if (tipo === "videoinput") {
                        dispositivosDeVideo.push(dispositivo);
                    }
                });

                // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
                if (dispositivosDeVideo.length > 0) {
                    // Llenar el select
                    dispositivosDeVideo.forEach(dispositivo => {
                        const option = document.createElement('option');
                        option.value = dispositivo.deviceId;
                        option.text = dispositivo.label;
                        $listaDeDispositivos.appendChild(option);
                    });
                }
            });
    }

    (function () {
        // Comenzamos viendo si tiene soporte, si no, nos detenemos
        if (!tieneSoporteUserMedia()) {
            alert("Lo siento. Tu navegador no soporta esta característica");
            $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
            return;
        }
        //Aquí guardaremos el stream globalmente
        let stream;


        // Comenzamos pidiendo los dispositivos
        obtenerDispositivos()
            .then(dispositivos => {
                // Vamos a filtrarlos y guardar aquí los de vídeo
                const dispositivosDeVideo = [];

                // Recorrer y filtrar
                dispositivos.forEach(function (dispositivo) {
                    const tipo = dispositivo.kind;
                    if (tipo === "videoinput") {
                        dispositivosDeVideo.push(dispositivo);
                    }
                });

                // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
                // y le pasamos el id de dispositivo
                if (dispositivosDeVideo.length > 0) {
                    // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
                    mostrarStream(dispositivosDeVideo[0].deviceId);
                }
            });

        const mostrarStream = idDeDispositivo => {
            _getUserMedia({
                video: {
                    // Justo aquí indicamos cuál dispositivo usar
                    deviceId: idDeDispositivo,
                }
            },
                (streamObtenido) => {
                    // Aquí ya tenemos permisos, ahora sí llenamos el select,
                    // pues si no, no nos daría el nombre de los dispositivos
                    llenarSelectConDispositivosDisponibles();

                    // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
                    $listaDeDispositivos.onchange = () => {
                        // Detener el stream
                        if (stream) {
                            stream.getTracks().forEach(function (track) {
                                track.stop();
                            });
                        }
                        // Mostrar el nuevo stream con el dispositivo seleccionado
                        mostrarStream($listaDeDispositivos.value);
                    }

                    // Simple asignación
                    stream = streamObtenido;

                    // Mandamos el stream de la cámara al elemento de vídeo
                    $video.srcObject = stream;
                    $video.play();

                    //Escuchar el click del botón para tomar la foto
                    $boton.addEventListener("click", function () {

                        //Pausar reproducción
                        $video.pause();

                        //Obtener contexto del canvas y dibujar sobre él
                        let contexto = $canvas.getContext("2d");
                        $canvas.width = $video.videoWidth;
                        $canvas.height = $video.videoHeight;
                        contexto.drawImage($video, 0, 0, $canvas.width, $canvas.height);

                        var img = document.getElementById("imgFoto");

                        let foto = $canvas.toDataURL(); //Esta es la foto, en base 64

                        let enlace = document.createElement('a'); // Crear un <a>
                        //enlace.download = "foto_parzibyte.me.png";
                        enlace.href = foto;
                        img.src = enlace;
                        enlace.click();
                        document.getElementById("btnCancelar1").click();
                        FinalizarServicio();
                        //Reanudar reproducción
                        //$video.play();

                    });
                }, (error) => {
                    console.log("Permiso denegado o error: ", error);
                    $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
                });
        }
    })();
};

