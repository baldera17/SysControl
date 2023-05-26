$(document).ready(function () {
    var events = [];
    var selectedEvent = null;
    FetchEventAndRenderCalendar();
    function FetchEventAndRenderCalendar() {
        var id = document.getElementById("txtIdUsuario").value;
        events = [];
        $.ajax({
            url:"/Horario/GetEvents/?id="+ id,
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                //var events = [];
                $.each(data, function (i, data) {
                    events.push(
                        {
                            id: data.IdEvento,
                            title: data.Empresa,
                            start: moment(data.Inicio).format(),
                            end: data.Fin != null ? moment(data.Fin).format() : null,
                            color: data.Color,
                            allDay: data.Todo_Dia
                        }
                    );
                });
                GenerateCalender(events);
            },
            error: function (error) {
                alert('failed');
            }
        })
    }

    function GenerateCalender(events) {

        var Calendar = FullCalendar.Calendar;

        var calendarEl = document.getElementById('calendar');

        var calendar = new Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            //contentHeight: 500,
            locale: 'es',
            events: events,
            eventClick: function (eventClickInfo) {
                // alert('View: ' + eventClickInfo.el.description);
                $('#myModal #eventTitle').text(eventClickInfo.event.title);
                $('#txtIdEvento').val(eventClickInfo.event.id);
                var descripcion = $('<div/>');
                descripcion.append($('<p/>').html('<b>Inicio: </b> ' + moment(eventClickInfo.event.start).format("DD-MMM-YYYY HH:mm a")));
                if (eventClickInfo.event.end != null) {
                    descripcion.append($('<p/>').html('<b>Fin: </b> ' + moment(eventClickInfo.event.end).format("DD-MMM-YYYY HH:mm a")));
                }
                $('#myModal #pDetails').empty().html(descripcion);

                DesactivarBtnAprobar();

                function DesactivarBtnAprobar() {
                    var id = document.getElementById("txtIdEvento").value;
                    $.get("/Horario/RecuperarDatos/?id=" + id, function (data) {
                        var des = document.getElementById("txtColor").value = data[0].Color;
                        if (des == "red") {
                            $('#btnEdit').prop('disabled', false);
                            $('#btnDelete').prop('disabled', false);
                        } else {
                            $('#btnEdit').prop('disabled', true);
                            $('#btnDelete').prop('disabled', true);
                        }

                    });
                }
                $('#myModal').modal('show');
            },
            dateClick: function (selectionInfo) {
                selectedEvent = {
                    id: 0,
                    title: '',
                    description: '',
                    start: moment(selectionInfo.startStr).format('YYYY-MM-DD HH:mm A'),
                    end: moment(selectionInfo.endStr).format('YYYY-MM-DD HH:mm A'),
                    allDay: false,
                    color: ''
                };
                Nuevo();
            },
            selectable: true,
            select: function (selectionInfo) {
                selectedEvent = {
                    id: 0,
                    title: '',
                    description: '',
                    start: moment(selectionInfo.startStr).format('YYYY-MM-DD HH:mm A'),
                    end: moment(selectionInfo.endStr).format('YYYY-MM-DD HH:mm A'),
                    allDay: false,
                    color: ''
                };
                Nuevo();
            },
            //editable: true,
            eventDrop: function (event) {
                var data = {
                    IdEvento: event.eventID,
                    Empresa: event.title,
                    Inicio: event.start.format('YYYY-MM-DD HH:mm A'),
                    Fin: event.end != null ? event.end.format('YYYY-MM-DD HH:mm A') : null,
                    Color: event.color,
                    Todo_Dia: event.allDay
                };
                SaveEvent(data);
            }
        })
        calendar.render();
    }

    $('#btnEdit').click(function () {
        abrir();

    })
    $('#btnCancelar').click(function () {
        $('#btncerrar').click()
    })



    $('#btnDelete').click(function () {
        if (selectedEvent != null && confirm('Desea eliminar?')) {
            $.ajax({
                type: "POST",
                url:'/Horario/DeleteEvent',
                data: { 'IdEvento': selectedEvent.eventID },
                success: function (data) {
                    if (data.status) {
                        //Refresh the calender
                        FetchEventAndRenderCalendar();
                        $('#myModal').modal('hide');
                    }
                },
                error: function () {
                    alert('Failed');
                }
            })
        }
    })

    $('#dtp1,#dtp2').datetimepicker({
        format: 'YYYY-MM-DD HH:mm A'
    });

    $('#chkIsFullDay').change(function () {
        if ($(this).is(':checked')) {
            $('#divEndDate').hide();
        }
        else {
            $('#divEndDate').show();
        }
    });


    $('#btnSave').click(function () {
        //Validation/
        if ($('#txtSubject').val().trim() == "") {
            alert('Subject required');
            return;
        }
        if ($('#txtStart').val().trim() == "") {
            alert('Start date required');
            return;
        }
        if ($('#chkIsFullDay').is(':checked') == false && $('#txtEnd').val().trim() == "") {
            alert('End date required');
            return;
        }
        else {
            var startDate = moment($('#txtStart').val(), "YYYY-MM-DD HH:mm A").toDate();
            var endDate = moment($('#txtEnd').val(), "YYYY-MM-DD HH:mm A").toDate();
            if (startDate > endDate) {
                alert('Invalid end date');
                return;
            }
        }

        var data = {
            IdEvento: $('#hdEventID').val(),
            Empresa: $('#txtSubject').val().trim(),
            Inicio: $('#txtStart').val().trim(),
            Fin: $('#chkIsFullDay').is(':checked') ? null : $('#txtEnd').val().trim(),
            Color: $('#ddThemeColor').val(),
            Todo_Dia: $('#chkIsFullDay').is(':checked'),
            IdUsuario: $('#txtIdUsuario').val()
        }
        SaveEvent(data);
        // call function for submit data to the server 
    })

    function SaveEvent(data) {
        $.ajax({
            type: "POST",
            url:'/Horario/SaveEvent',
            data: data,
            success: function (data) {
                if (data.status) {
                    //Refresh the calender
                    swal("Mensaje", "Se Ejecutó Correctamente.", "success");
                    FetchEventAndRenderCalendar();
                    $('#myModalSave').modal('hide');
                    $('#btncerrar').click()
                }
            },
            error: function () {
                alert('Failed');
            }
        })
    }
    function abrir() {
        var id = document.getElementById("txtIdEvento").value;
      abrirPopUpForm(id);  
    }

    function abrirPopUpForm(id) {
      
            $.get("/Horario/RecuperarDatos/?id="+ id, function (data) {
                document.getElementById("hdEventID").value = data[0].IdEvento;
                document.getElementById("txtSubject").value = data[0].Empresa;
                document.getElementById("txtStart").value = moment(data[0].Inicio).format("YYYY-MM-DD HH:mm A");
                $('#chkIsFullDay').prop("checked", data[0].Todo_Dia || false);
                $('#chkIsFullDay').change();
                document.getElementById("txtEnd").value = moment(data[0].Fin).format("YYYY-MM-DD HH:mm A");
                document.getElementById("ddThemeColor").value = data[0].Color;
            });
        
        $('#myModalSave').modal('show');
    }

    function Nuevo() {
        if (selectedEvent != null) {
            $('#hdEventID').val(selectedEvent.id);
            $('#txtSubject').val(selectedEvent.title);
            $('#txtStart').val(selectedEvent.start);
            $('#chkIsFullDay').prop("checked", selectedEvent.allDay || false);
            $('#chkIsFullDay').change();
            $('#txtEnd').val(selectedEvent.end != null ? selectedEvent.end : '');
        }
        $('#myModalSave').modal('show');
    }


    ListarEmpresas();
    function ListarEmpresas() {
        var id = document.getElementById("txtIdUsuario").value;
        ListarEmpresa(id);

    }
    function ListarEmpresa(id) {
        $.get("/Marcador/ListarEmpresa/?id=" + id, function (data) {
            LlenarCombo(data, document.getElementById("txtSubject"), true);
        });

    }

    function LlenarCombo(data, control, primerElemento) {
        var contenido = "";

        if (primerElemento == true) {
            contenido += "<option value=''> --Seleccione--</option>";
        }

        for (var i = 0; i < data.length; i++) {
            contenido += "<option value='" + data[i].Nombre + "'>";
            contenido += data[i].Nombre;
            contenido += "</option>";
        }
        control.innerHTML = contenido;
    }
})




