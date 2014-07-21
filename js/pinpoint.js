// When dom ready fire this.
var canvas;
var ctx;
var listOfLines = [];
var linesFromLocal=[];
var checkKeyPressed = true;
var background;
var completionNumber = 30;
var line;
var keyAblocker = false;
var keySblocker = false;
var keyLblocker = false;


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
        alert("To create new line press A, to load existed lines choose a Text or JSON file");
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


function drawAllLines() {

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

                ctx.lineTo(point.x, point.y);

                ctx.lineWidth = 2;

                ctx.stroke();
            }
        }
        ctx.moveTo(listOfLines[j].points[listOfLines[j].points.length - 1].x, listOfLines[j].points[listOfLines[j].points.length - 1].y);
        ctx.lineTo(listOfLines[j].points[0].x, listOfLines[j].points[0].y);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}


function deleteAllLines() {  //canvasda olan bütün çizgileri temizleyip arrayde tutulan koordinatları da siliyor
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
   // line.points = [];
    listOfLines = [];
    redrawStoredLines();
    $("#list").empty();
}


function redrawStoredLines() { //canvas'a yeni eklenen bir çizgiyi silmek için bütün canvas'ı temizleyip geri kalanı yeniden yazdırıyor.

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

                ctx.lineTo(point.x, point.y);

                ctx.lineWidth = 2;

                ctx.stroke();
            }
        }
        ctx.moveTo(listOfLines[j].points[listOfLines[j].points.length - 1].x, listOfLines[j].points[listOfLines[j].points.length - 1].y);
        ctx.lineTo(listOfLines[j].points[0].x, listOfLines[j].points[0].y);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

}


function checkNames(vrb) { //Line lara aynı ismin verilmemesi için
    for (var i = 0; i < listOfLines.length; i++) {
        if (vrb) {
            if (vrb == listOfLines[i].name || vrb.length == 0) {
                alert("The name you entered is not available. Enter a diffrent name");
                checkKeyPressed = true;
                keyAblocker = false;
                return false;
            }
        }
    }
    return true;
}


function openWindow() { //listOfLines daki koordinatları yeni bir pencerede açıp JSON formatında yazdırıyor

    var myWindow = window.open("", "myWindow", "width=500, height=800");    // Opens a new window
    var outputData = {
        polygons: listOfLines
    };
    myWindow.document.write("<pre>" + JSON.stringify(outputData, null, 2) + "</pre>");
}


function writingAllLinesToDiv() {

    var container = document.getElementById("list");
    var div;

    for (var i = 0; i < listOfLines.length; i++) {
        div = document.createElement('div');
        div.innerHTML = listOfLines[i].name;
        div.style.color = "white";
        container.appendChild(div);
    }
}


window.onload = function () { //file api kullanarak localden text veya JSON dosyasını parse edip çizdiriyor


    if (window.File && window.FileList && window.FileReader) {

        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function (event) {

            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var picReader = new FileReader();

                picReader.addEventListener("load", function (event) {

                    var textFile = event.target;

                    var obj = textFile.result;
                    linesFromLocal = JSON.parse(obj).polygons;
                    listOfLines= listOfLines.concat(linesFromLocal);
                    drawAllLines();
                    $("#list").empty();
                    writingAllLinesToDiv();
                });
                picReader.readAsText(file);
            }
        });
    }
    else {
        alert("Your browser does not support File API");
    }
}


function writingNamestoDiv() {

    var container = document.getElementById("list");
    var div;
    div = document.createElement('div');
    div.innerHTML = listOfLines[listOfLines.length - 1].name;
    div.style.color = "white";
    container.appendChild(div);
}


function pinpoint() {

    line = new Polygon();

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
            /*


             if (line.points.length > 0 && (((x - line.points[0].x < completionNumber && x - line.points[0].x > 0) || (x - line.points[0].x < 0 && x - line.points[0].x > -completionNumber)) && ((y - line.points[0].y < completionNumber && y - line.points[0].y > 0) || (y - line.points[0].y < 0 && y - line.points[0].y > -completionNumber)) )) {
             x = line.points[0].x;
             y = line.points[0].y;
             }


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

            if (line.points.length > 1) {

                ctx.beginPath();
                ctx.moveTo(line.points[line.points.length - 2].x, line.points[line.points.length - 2].y);
                ctx.lineTo(line.points[line.points.length - 1].x, line.points[line.points.length - 1].y);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
            }
        }
    });


    $("body").keydown(function (event) {

        if (event.which == 65 && keyAblocker == false) {   //"A" tuşuna basıldığı zaman

            // event.preventDefault();

            checkKeyPressed = false;
            keyAblocker = true;

            var nameofLine = prompt("enter the new line name: ");

            if (checkNames(nameofLine) == true) {
                line = new Polygon();
                line.name = nameofLine;
            }

            keySblocker = false;
        }

        else if (event.which == 83 && keySblocker == false && line.points.length != 0) {   //"S" tuşuna basıldığı zaman line'ı array'e atıyor.

            listOfLines.push(line);
            ctx.beginPath();
            ctx.moveTo(line.points[line.points.length - 1].x, line.points[line.points.length - 1].y);
            ctx.lineTo(line.points[0].x, line.points[0].y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

            alert("Line has been saved");

            writingNamestoDiv();

            checkKeyPressed = true;
            keyAblocker = false;
            keySblocker = true;
            line = null;

        }

        else if (event.which == 90) {   //"Z" tuşuna basıldığı zaman son eklenen line'ı siliyo

            line = null;
            listOfLines.pop();
            redrawStoredLines();
            $("#list").empty();
            writingAllLinesToDiv();
            keyAblocker = false;
            keyLblocker = false;
        }

        else if (event.which == 68) {   //"D" tuşuna basıldığı zaman
            listOfLines = [];
            $("#list").empty();
            deleteAllLines();
            keyAblocker = false;
            keyLblocker = false;
        }

        else if (event.which == 87) {   //"W" tuşuna basıldığı zaman
            openWindow();
        }
    });
}