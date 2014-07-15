// When dom ready fire this.
var canvas;
var ctx;
var listOfLines = [];
var linesFromJSON=[];
var checkKeyPressed = true;
var background;
var completionNumber = 30;
var keyAcounter = 1;
var line;
var keyAblocker=false;
var keySblocker=false;
var keyLblocker=false;
var JsonObj = null;


$(function () {

    // Döküman yüklendiği zaman direkt bunu çağırıyor.
    canvas = document.getElementById("floor-plan-canvas");
    ctx = canvas.getContext("2d");

    // HTML dökümanındaki canvas elementine bir tane kat planı resmini
    // background olarak atıyoruz.
    background = new Image();
    background.src = "http://sypiazza.s3.amazonaws.com/images/floors/16_original.png?1391002511";

    background.onload = function () {
        // Resim browser tarafından indirilince fire edildiği
        // için burda background 'ı set edip, pinpoint fonksiyonunu
        // yani asıl işi yapacak fonksiyonu çağırabiliriz.
        ctx.drawImage(background, 0, 0);

        alert("To draw json data press L, to draw new line press A ");
        parseFromJson();
        pinpoint();

    };
});

var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

var Polygon = function () {
    this.name = "";
    this.points = [];
    this.addLine = function (x, y) {
        this.points.push(new Point(x, y));
    };
    this.toString = function () {
        console.log("Name of line: " + this.name);
        for (var i = 0; i < this.points.length; i++) {
            console.log((i + 1) + ". coordinate of the line: " + this.points[i].x + ", " + this.points[i].y);

        }

    };

};
function parseFromJson (){

      $.getJSON( "test.json", function( data ) {

           var polygons = data.polygons;

          for(var i = 0; i< polygons.length ; i++) {

              var polygon = polygons[i];
              line = new Polygon();
              line.name=polygon.name;

              for(var j=0; j < polygon.points.length; j++) {

                  var point = polygon.points[j];
                  line.addLine(point.x, point.y);
              }
              linesFromJSON.push(line);
          }
          });

    }

function drawAllLines (){


console.log(linesFromJSON.join());
    console.log("----------------------");
    console.log(listOfLines.join());
    console.log("----------------------");
    //console.log(line.points.join());

    for (var j = 0; j < listOfLines.length; j++) {

        for (var i = 0; i < listOfLines[j].points.length; i++) {
            if (i == 0) {

                var a = listOfLines[j].points[0];
                ctx.moveTo(a.x, a.y);
            }

            else {
                fnc(listOfLines[j].points[i]);
            }
            function fnc(point) {
                // ctx.moveTo(a.x, a.y);
                //console.log("move to ya giren a ile b: " + a.x + " " + a.y);
                ctx.lineTo(point.x, point.y);
                //console.log("line to ya giren x ile y: " + point.x + " " + point.y);
                ctx.lineWidth = 2;

                ctx.stroke();

            }
        }

    }

    for (var j = 0; j < linesFromJSON.length; j++) {

        for (var i = 0; i < linesFromJSON[j].points.length; i++) {
            if (i == 0) {

                var a = linesFromJSON[j].points[0];
                ctx.moveTo(a.x, a.y);
            }

            else {
                fnc(linesFromJSON[j].points[i]);
            }
            function fnc(point) {
                // ctx.moveTo(a.x, a.y);
                //console.log("move to ya giren a ile b: " + a.x + " " + a.y);
                ctx.lineTo(point.x, point.y);
                //console.log("line to ya giren x ile y: " + point.x + " " + point.y);
                ctx.lineWidth = 2;

                ctx.stroke();

            }
        }

    }

}


function deleteAllLines() {  //canvasda olan bütün çizgileri temizleyip arraylerde tutulan koordinatları da siliyor
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    line.points = [];
    listOfLines = [];
    redrawStoredLines();
}

function redrawStoredLines() { //canvas'a yeni eklenen bir çizgiyi silmek için bütün canvas'ı temizleyip geri kalanı yeniden yazdırmak gerekiyor.


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    ctx.beginPath();

    for (var j = 0; j < listOfLines.length; j++) {

        for (var i = 0; i < listOfLines[j].points.length; i++) {

            if (i == 0) {

            var a = listOfLines[j].points[0];
            ctx.moveTo(a.x, a.y);
        }

            else {
                fnc(listOfLines[j].points[i]);
            }
            function fnc(point) {


               // ctx.moveTo(a.x, a.y);
                //console.log("move to ya giren a ile b: " + a.x + " " + a.y);
                ctx.lineTo(point.x, point.y);
                //console.log("line to ya giren x ile y: " + point.x + " " + point.y);
                ctx.lineWidth = 2;

                ctx.stroke();

            }
        }

    }

}


function openWindow()
{
    var myWindow = window.open("", "myWindow", "width=500, height=800");    // Opens a new window

    var outputData = {
        polygons: listOfLines
    };


        myWindow.document.write("<pre>" + JSON.stringify(outputData, null, 2) + "</pre>");


}


window.onload = function() {


    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function(event) {

            var files = event.target.files;
            var output = document.getElementById("result");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];


                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {

                    var textFile = event.target;

                    var div = document.createElement("div");

                    div.innerText = textFile.result;

                    output.insertBefore(div, null);

                    var obj=textFile.result;
                    listOfLines = JSON.parse(obj).polygons;
                    console.log(JSON.stringify(JSON.parse(obj), null, 2));


                });

                picReader.readAsText(file);


            }

        });
    }
    else {
        console.log("Your browser does not support File API");
    }
}




function pinpoint() {


    line = new Polygon();
   // var nameofLine = prompt("enter the new line name: ");
   // line.name = nameofLine;


    $("#floor-plan-canvas").click(function (e) {
        if (checkKeyPressed == false) {
            var element = canvas;
            var offsetX = 0, offsetY = 0;

            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }

            var x = e.pageX - offsetX - 3;
            var y = e.pageY - offsetY - 3;

            //ilk tıklanan noktaya yakın bir yere tıklanınca otomatik tamamlama
            if (line.points.length > 0 && (((x - line.points[0].x < completionNumber && x - line.points[0].x > 0) || (x - line.points[0].x < 0 && x - line.points[0].x > -completionNumber)) && ((y - line.points[0].y < completionNumber && y - line.points[0].y > 0) || (y - line.points[0].y < 0 && y - line.points[0].y > -completionNumber)) )) {
                x = line.points[0].x;
                y = line.points[0].y;

                }

            /*
            else if ((line.points.length == 1) && ((x - line.points[0].x < completionNumber && x - line.points[0].x > 0) || (x - line.points[0].x < 0 && x - line.points[0].x > -completionNumber))) {
                x = line.points[0].x;
                console.log("ikinci e giren x ve y" + x + " " + y);

            }

            else if ((line.points.length == 1) && ((y - line.points[0].y < completionNumber && y - line.points[0].y > 0) || (y - line.points[0].y < 0 && y - line.points[0].y > -completionNumber))) {
                y = line.points[0].y;
                console.log("üçüncü if e giren x ve y" + x + " " + y);

            }

                else if((line.points.length>1) && ((x - line.points[line.points.length-1].x < completionNumber && x - line.points[line.points.length-1].x > 0) || (x - line.points[line.points.length-1].x < 0 && x - line.points[line.points.length-1].x > -completionNumber))){
             x = line.points[line.points.length-2].x;
             console.log("dördüncü if e giren x ve y"+x+" "+y);
             for(var i=0;i<line.points.length;i++){
             console.log("dördüncü coo: "+line.points[i].x+" "+line.points[i].y);

             }
             }

             else if((line.points.length>1) && ((y - line.points[line.points.length-1].y < completionNumber && y - line.points[line.points.length-1].y > 0) || (y - line.points[line.points.length-1].y < 0 && y - line.points[line.points.length-1].y > -completionNumber))){
             y = line.points[line.points.length-2].y;
             console.log("sonuncu if e giren x ve y"+x+" "+y);
             for(var i=0;i<line.points.length;i++){
             console.log("sonuncu coo: "+line.points[i].x+" "+line.points[i].y);

             }
             }

             */

            line.addLine(x, y);//line'ın koordinatlarını vererek canvas'a çizdirme
            if(line.points.length>1) {

                ctx.beginPath();
                ctx.moveTo(line.points[line.points.length - 2].x, line.points[line.points.length - 2].y); //çizginin başladığı nokta
                ctx.lineTo(line.points[line.points.length - 1].x, line.points[line.points.length - 1].y); //çizginin bittiği nokta
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
            }

        }


    });


    $("body").keydown(function (event) {


        if (event.which == 65 && keyAblocker==false) {   //"A" tuşuna basıldığı zaman

              keyAcounter++;

              event.preventDefault();

              //line.toString();

              checkKeyPressed = false;


              var nameofLine = prompt("enter the new line name: ");
              line = new Polygon();
              line.name = nameofLine;
              keyAblocker=true;
              keySblocker=false;

        }


        else if (event.which == 83 && keySblocker==false && line.points.length != 0) {   //"S" tuşuna basıldığı zaman line'ı array'e atıyor.

                listOfLines.push(line);

                alert("Line has been saved");

                for (var i = 0; i < listOfLines.length; i++) {
                    console.log(listOfLines[i].name);
                }

                checkKeyPressed = true;
                keyAblocker = false;
                keySblocker=true;

        }

        else if (event.which == 90) {   //"Z" tuşuna basıldığı zaman son eklenen line'ı siliyo
            if(line){
                line=null;
            }
            else {
                listOfLines.pop();
            }
            redrawStoredLines();
            keyAcounter = listOfLines.length;
            keyAblocker=false;
            keyLblocker=false;
        }


        else if (event.which == 68) {   //"D" tuşuna basıldığı zaman

            deleteAllLines();
            keyAcounter = 0;
            keyAblocker=false;
            keyLblocker=false;
        }


        else if (event.which == 76 && keyLblocker == false) {   //"L" tuşuna basıldığı zaman

                console.log("l pressed");
                drawAllLines();
                checkKeyPressed = true;
                keyLblocker=true;

        }

        else if (event.which == 87) {   //"W" tuşuna basıldığı zaman

            openWindow();
            handleFileSelect();
        }
    });
}


