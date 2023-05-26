function CerraSesion() {
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
      document.location.href ='@Url.Action("Salir","Home")';
    });

};
   
