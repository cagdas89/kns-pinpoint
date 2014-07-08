// When dom ready fire this.
var canvas;
var ctx;
var listOfLines = [];
var checkKeyPressed = false;
var background;
var completionNumber = 30;
var keyAcounter = 1;
var line;
var keyAblocker=false;

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
        pinpoint();
    };
});

var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

var LineClass = function () {
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


function deleteAllLines() {  //canvasda olan bütün çizgileri temizleyip arraylerde tutulan koordinatları da siliyor
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    line.points = [];
    listOfLines = [];


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

function pinpoint() {


    line = new LineClass();
    var nameofLine = prompt("enter the new line name: ");
    line.name = nameofLine;


    $("#floor-plan-canvas").click(function (e) {
        if (checkKeyPressed == false) {
            var element = canvas;
            var offsetX = 0, offsetY = 0;

            if (element.offsetParent) {   //
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
                console.log("ilk if e giren x ve y" + x + " " + y);

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


        if (event.which == 65) {   //"A" tuşuna basıldığı zaman

          if(keyAblocker==false) {
              keyAcounter++;

              event.preventDefault();


              checkKeyPressed = true;


              //line.toString();

              checkKeyPressed = false;


              var nameofLine = prompt("enter the" + keyAcounter + ". line name: ");
              line = new LineClass();
              line.name = nameofLine;
          }

              keyAblocker==true;


        }


        else if (event.which == 83) {   //"S" tuşuna basıldığı zaman line'ı array'e atıyor.





                listOfLines.push(line);

               alert("Line has been saved");

                for (var i = 0; i < listOfLines.length; i++) {
                    console.log(listOfLines[i].name);
                }


            checkKeyPressed = true;
            keyAblocker==false;

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


        }


        else if (event.which == 68) {   //"D" tuşuna basıldığı zaman

            deleteAllLines();
            keyAcounter = 0;

        }

    });
}
