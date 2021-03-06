//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Relación vendedores') {
      if (acciones[i]['acc_descripcion'] == 'Crear') {
        invalidCreate = false;
      }
    }
  }
  if (invalidCreate === true) {
    $.notify({
      message: 'Error! Usted no posee permisos para ejecutar esta acción.'
    },{
      type: 'danger',
      delay: 1000,
      placement: {
        align: 'center'
      },
      z_index: 1000
    })
  } else {
    $(".has-error").removeClass("has-error");
    $('[name=modalDocumentos]').modal();
    limpiar_documento();
  }
})
//Fin mostrar modal registro familias

//Inicio funcion guardar familia
var guardarDocumento = function(){
  var btnSavingDocumentos = $(this);
  var datos_documento = $('[name=formSaveFamily]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos_documento.length; i++) {
    var label = datos_documento[i]['name'];
    var valor = datos_documento[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'vendedor1':
        if (valor.trim() == ''){
          mensajeError = 'Ingrese el cliente .';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
      case 'vendedorid1':
        if (valor.trim() == ''){
          mensajeError = 'Error! El cliente número uno (1) no se encuentra registrado.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
      case 'vendedor2':
      if (valor.trim() == ''){
        mensajeError = 'Ingrese el vendedor .';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_documento.length + 100;
        break;
      }
      break;
      case 'vendedorid2':
        if (valor.trim() == ''){
          mensajeError = 'Error! El vendedor no se encuentra registrado.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
    }
  }
  var vendedorid1 = $('[name=modalDocumentos]').find('[name=vendedorid1]').val()
  var vendedorid2 = $('[name=modalDocumentos]').find('[name=vendedorid2]').val()
  var vendedor1 = $('[name=modalDocumentos]').find('[name=vendedor1]').val()
  var vendedor2 = $('[name=modalDocumentos]').find('[name=vendedor2]').val()
  if (vendedor1 !== '' && vendedor2 !== '') {
    if (vendedorid1 == vendedorid2) {
      error = true;
      mensajeError = 'Error! Los vendedores son los mismos.'
    }
  }
  if (error === true) {
    $.notify({
      message: mensajeError
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
    return;
  } else {
    var fd = new FormData(document.getElementById('formSaveFamily'));
    //waitingDialog.show('Guardando los datos, por favor espere...',{dialogSize: 'm', progressType:''});
    btnSavingDocumentos.attr('disabled', 'disabled');
    $.ajax({
      url: 'relcli_ven_controller/guardar_tipodocumentos',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
    success: function(data){
      var resp = $.parseJSON(data)
      //waitingDialog.hide();
      btnSavingDocumentos.removeAttr('disabled');
      $.notify({
        message: resp.msg
      }, {
        type: resp.type,
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
        onClosed: function(){
          if (resp.success !== false) {
            $('[name=modalDocumentos]').modal('hide');
            obtener_documentos()
          }
        }
      })
    }
  })
}
}
//fin funcion guardar familia
//Llamado a funcion guardar familia.
$('[name=btnSavingDocumentos]').on('click', guardarDocumento);
//fin llamar funcion guardar familia


//Inicio obtener familias
var componenteListarDocumentos = $('[name=listar_rel]');
debugger
var obtener_documentos = function(){
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="editar_familia"'+
      '              codigo="{0}" vendedor1="{1}" vendedor2="{2}" vendedorid1="{5}" vendedorid2="{6}"'+
      '              observacion="{4}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" codigo="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{4}</td>'+
      //'        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'relcli_ven_controller/obtener_tipodocumentos',
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarDocumentos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            debugger
            for (var i = 0; i < datos.length; i++) {
              componenteListarDocumentos.append(modelFila.format(
                datos[i]['relvencodigo'], //0
                datos[i]['ternombre'], //1
                datos[i]['vendedor'], //2
                datos[i]['relcliestado'], //3
                datos[i]['relcliobservacion'], //4
                datos[i]['relclicliente'],//5
                datos[i]['relclivendedor'],//6
              ));
            }
            $('[name=btnEliminar]').on('click', eliminar_documento);
            $('[name=btnEditar]').on('click', modificar_documento);
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener familias

//Llamado a la funcion obtener familias
obtener_documentos();
//Fin llamado a la funcion obtener familias

//Inicio mostrar ayuda
function mostrarAyuda(msg) {
  $.notify({
    message: msg
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin mostrar ayuda


//Inicio mostrar ayuda
function mostrarAyudacli(msg) {
  $.notify({
    message: 'Ingrese Nombre o Documento del cliente'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin mostrar ayuda

//Inicio funcion convertir a mayusculas
function aMayusculas(obj,id){
  obj = obj.toUpperCase();
  document.getElementById(id).value = obj;
}
//Fin funcion convertir a mayusculas

//Inicio funcion buscar
function doSearch(){
    var tableReg = document.getElementById('datos');
    var searchText = document.getElementById('searchTerm').value.toLowerCase();
    var cellsOfRow="";
    var found=false;
    var compareWith="";
    // Recorremos todas las filas con contenido de la tabla
    for (var i = 1; i < tableReg.rows.length; i++)
    {
        cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
        found = false;
        // Recorremos todas las celdas
        for (var j = 0; j < cellsOfRow.length && !found; j++)
        {
            compareWith = cellsOfRow[j].innerHTML.toLowerCase();
            // Buscamos el texto en el contenido de la celda
            if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
            {
                found = true;
            }
        }
        if(found)
        {
            tableReg.rows[i].style.display = '';
        } else {
            // si no ha encontrado ninguna coincidencia, esconde la
            // fila de la tabla
            tableReg.rows[i].style.display = 'none';
        }
    }
}

//Fin funcion buscar

//Inicio funcion eliminar_documento

var eliminar_documento = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Relación vendedores') {
      if (acciones[i]['acc_descripcion'] == 'Eliminar') {
        invalidDelete = false;
      }
    }
  }
  if (invalidDelete === true) {
    $.notify({
      message: 'Error! Usted no posee permisos para ejecutar esta acción.'
    },{
      type: 'danger',
      delay: 1000,
      placement: {
        align: 'center'
      },
      z_index: 1000
    })
  } else {
    var codigo = $(this).attr("codigo");
    bootbox.confirm({
      title: 'Confirmación',
      message: "¿Está seguro que desea eliminar el registro?",
      buttons: {
        confirm: {
          label: "Si",
          className: "btn-"
        },
        cancel: {
          label: "No",
          className: "btn-danger"
        }
      },
      callback: function(result){
        if (result === true) {
          $.ajax({
            url: 'relvendedores_controller/inactivar_tipodocumentos',
            type: 'POST',
            data:{
              codigo: codigo
            },
            success: function(response){
              var respuesta = $.parseJSON(response);
              if (respuesta.success === true) {
                $.notify({
                  message: 'Eliminado correctamente.'
                },{
                  type: 'success',
                  delay: 1000,
                  placement: {
                    align: 'center'
                  },
                  z_index: 1000,
                  onClosed: function(){
                    obtener_documentos()
                  }
                })
              }
            }
          })
        }
      }
    })
  }
}

//Fin funcion eliminar

//Autocompletado vendedores
$(function() {
  $.ajax({
    url: 'facturacion_controller/obtener_clientes',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      $('[name=modalDocumentos]').find("#vendedor1").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $('[name=modalDocumentos]').find("#vendedor1").val(event.value);
          $('[name=modalDocumentos]').find("#vendedorid1").val(event.id);
        }
      });
    }
  })
});

$(function() {
  $.ajax({
    url: 'facturacion_controller/obtener_vendedores',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      $('[name=modalDocumentos]').find("#vendedor2").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $('[name=modalDocumentos]').find("#vendedor2").val(event.value);
          $('[name=modalDocumentos]').find("#vendedorid2").val(event.id);
        }
      });
    }
  })
});
//Fin autocompletado vendedores

//Inicio funcion modificar familia

var modificar_documento = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Relación vendedores') {
      if (acciones[i]['acc_descripcion'] == 'Modificar') {
        invalidChange = false;
      }
    }
  }
  if (invalidChange === true) {
    $.notify({
      message: 'Error! Usted no posee permisos para ejecutar esta acción.'
    },{
      type: 'danger',
      delay: 1000,
      placement: {
        align: 'center'
      },
      z_index: 1000
    })
  } else {
    var codigo = $(this).attr("codigo");
    var vendedor1 = $(this).attr("vendedor1");
    var vendedor2 = $(this).attr("vendedor2");
    var vendedorid1 = $(this).attr("vendedorid1");
    var vendedorid2 = $(this).attr("vendedorid2");
    var observacion = $(this).attr("observacion");
    if (observacion == 'Información no suministrada.') {
      observacion = '';
    }
    $('[name=modalDocumentos]').modal();
    $('[name=modalDocumentos]').find('.modal-title').text('Modificar familias');
    $('[name=modalDocumentos]').find('[name=codigo_documento]').val(codigo_documento);
    $('[name=modalDocumentos]').find('[name=vendedor1]').val(vendedor1);
    $('[name=modalDocumentos]').find('[name=vendedor2]').val(vendedor2);
    $('[name=modalDocumentos]').find('[name=vendedorid1]').val(vendedorid1);
    $('[name=modalDocumentos]').find('[name=vendedorid2]').val(vendedorid2);
    $('[name=modalDocumentos]').find('[name=observacion]').val(observacion);
    $('[name=modalDocumentos]').find('[name=tipo]').val('2');
  }
}
//Fin funcion modificar familia

//Inicio funcion limpiar familia

var limpiar_documento = function(){
  $('[name=modalDocumentos]').find('[name=codigo_documento]').val("");
  $('[name=modalDocumentos]').find('[name=vendedor1]').val("");
  $('[name=modalDocumentos]').find('[name=vendedor2]').val("");
  $('[name=modalDocumentos]').find('[name=vendedorid1]').val("");
  $('[name=modalDocumentos]').find('[name=vendedorid2]').val("");
  $('[name=modalDocumentos]').find('[name=observacion]').val("");
  $('[name=modalDocumentos]').find('[name=tipo]').val('1');
}

function verificar_escritura(data, combo){
  if (data == '' || data.length == 0) {
    combo.val("")
  }
}
//Fin funcion limpiar familia
