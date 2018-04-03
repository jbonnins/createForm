function onInstall(e){
  onOpen(e);
}

//Creamos una opci�n para el men� (un submenu) para poder crear el formulario
function onOpen() {
  SpreadsheetApp.getUi().createAddonMenu()
         .addItem('Crear formulario', 'showSidebar')
         .addToUi();
}

//------------------------Creador de Formularios---------------------------------//
/** Esta plantilla ha sido reprogramada por PRINCIPPIA, INNOVACION EDUCATIVA (www.princippia.com / www.youtube.com/princippia)
*  apoy�ndose en la programacion realizada por John McGowan de Stamford American International School of Singapore.
 * S�lo es v�lida para formularios que dispongan de cuatro posibles respuestas para preguntas tipo test, validaci�n o lista. En caso contrario
 * ser� necesario reprogramar el c�digo por parte del usuario.
 
 * Abrimos la barra lateral en donde se ejecutar� el complemento
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Crear formulario');
  SpreadsheetApp.getUi().showSidebar(ui);
}

//Identificar el rango de celdas que se ha seleccionado
function findQuestionRange(){
 var questionRange = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
 var questionRangeNotation = questionRange.getA1Notation();
 var questionSheetName = questionRange.getSheet().getSheetName();
 return questionRangeNotation;
  
}



//Creamos el formulario con la informaci�n que tenemos en la hoja de c�lculo
function createQuickForm(){
 SpreadsheetApp.getActiveSpreadsheet().toast('Creando el formulario desde la hoja de c�lculo.','PROCESANDO...',10); //Nos permite saber si se est� ejecutando el c�digo

 var range = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange().getA1Notation(); //rango que he seleccionado
 var formTitle = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange("B2").getValue();
 var form = FormApp.create(formTitle);
 var formDescription = form.setDescription('Contesta a las siguientes preguntas del formulario');
 var formId = form.getId();
 var formEditUrl = form.getEditUrl();
 var formPublishedUrl = form.getPublishedUrl();
 var questionRange = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(range);//obtenemos el rango que ha sido salvado en la capa oculta (div)


 var ValoresParaFormulario = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(range).getValues();//Obtenemos los valores. No pueden ser una f�rmula.
 var NumeroFilas = SpreadsheetApp.getActiveSheet().getRange(range).getNumRows();
 var NumeroColumnas = SpreadsheetApp.getActiveSheet().getRange(range).getNumColumns();
  
  
  //Para cada fila creamos una pregunta
  for(var i=0;i<NumeroFilas;i++){
  if(NumeroColumnas>8){  
     var uiFormError = SpreadsheetApp.getUi();
     var responseFormError = uiFormError.alert('ERROR','Ha habido un error al crear el formulario. Por favor, selecciona un m�ximo de ocho columnas.', uiFormError.ButtonSet.OK);
  };
    
  
    
  var TipoPregunta = ValoresParaFormulario[i][2]; 
    if(TipoPregunta=='Texto'){
      //a�adir a text item
     form.addTextItem()  
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1]); 
    }
    else if(TipoPregunta=='Casilla_verificacion'){
      //a�adir una pregunta tipo casilla de verificaci�n
     var item = form.addCheckboxItem()
     item.setTitle(ValoresParaFormulario[i][0])
     item.setHelpText(ValoresParaFormulario[i][1])
     item.setChoices([
           item.createChoice(ValoresParaFormulario[i][3]),
           item.createChoice(ValoresParaFormulario[i][4]),
           item.createChoice(ValoresParaFormulario[i][5]),
           item.createChoice(ValoresParaFormulario[i][6]),
           ])
    //  .showOtherOption(true);
     }
    else if(TipoPregunta=='Seleccion_multiple'){
      //a�adir casillas de verificaci�n
     form.addMultipleChoiceItem()
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1])
     .setChoices([
           item.createChoice(ValoresParaFormulario[i][3]),
           item.createChoice(ValoresParaFormulario[i][4]),
           item.createChoice(ValoresParaFormulario[i][5]),
           item.createChoice(ValoresParaFormulario[i][6]),
           ])
    }
    
    else if(TipoPregunta=='Lista'){
      //A�adir una pregunta tipo lista
     form.addListItem()
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1])
     .setChoices([
           item.createChoice(ValoresParaFormulario[i][3]),
           item.createChoice(ValoresParaFormulario[i][4]),
           item.createChoice(ValoresParaFormulario[i][5]),
           item.createChoice(ValoresParaFormulario[i][6]),
           ])
      
    }
    else if(TipoPregunta=='Escala'){
      //A�adir una pregunta de Escala
     form.addScaleItem()
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1])
     .setBounds(ValoresParaFormulario[i][3], ValoresParaFormulario[i][4])
    }
       
    else if(TipoPregunta=='Imagen'){
      //A�adir una imagen
     var img = UrlFetchApp.fetch(ValoresParaFormulario[i][3])
     form.addImageItem()
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1])
     .setImage(img); 
    }
    
     else if(TipoPregunta=='V�deo'){
      //A�adir un v�deo 
     form.addVideoItem()
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1])
     .setVideoUrl(ValoresParaFormulario[i][3])
    }
    
    else if(TipoPregunta=='P�rrafo'){
      //A�adir una pregunta tipo p�rrafo
     form.addParagraphTextItem()
     .setTitle(ValoresParaFormulario[i][0]) 
     .setHelpText(ValoresParaFormulario[i][1]); 
    };
  };
    
  // Mensaje final
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Estupendo!!','Has creado correctamente el formulario. La direcci�n de tu nuevo formulario es: '+formEditUrl, ui.ButtonSet.OK);
  
  
}
