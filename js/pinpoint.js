// When dom ready fire this.
var canvas;
var ctx;
var listOfLines=new Array();
var checkKeyPressed = false;
var background;
var completionNumber=30;
var keyAcounter=1;

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


var LineClass = function () {
    this.name=name;
    this.points = new Array();
    this.addLine= function(x,y){
      this.points.push(x);
        this.points.push(y);
     };

};


function deleteAllLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    line.points.length=0;
    listOfLines.length=0;


}

function redrawStoredLines() {


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0);



        console.log(listOfLines[0].points[0]);

/*
        for (var j=0;j<line.length;j+=2){

            ctx.beginPath();
            ctx.moveTo(line.points[j], line.points[j+1]);
            ctx.lineTo(line.points[j+2], line.points[j+3]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
        }
*/

}

function pinpoint() {

    var nameofLine=prompt("enter the new line name: ");
    line=new LineClass();
    line.name=nameofLine;


    $("#floor-plan-canvas").click(function (e) {
        if (checkKeyPressed == false) {
            var element = canvas;
            var offsetX = 0, offsetY = 0

            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }

            var x = e.pageX- offsetX;
            var y = e.pageY - offsetY;

            if(((x-line.points[0]<completionNumber && x-line.points[0]>0)||(x-line.points[0]<0 && x-line.points[0]>-completionNumber)) && ((y-line.points[1]<completionNumber && y-line.points[1]>0)||(y-line.points[1]<0 && y-line.points[1]>-completionNumber)) ){
                x=line.points[0];
                y=line.points[1];
            }

            line.addLine(x,y)
            ctx.beginPath();
            ctx.moveTo(line.points[line.points.length - 4], line.points[line.points.length - 3]);
            ctx.lineTo(line.points[line.points.length - 2], line.points[line.points.length - 1]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

        }
    });


    $("body").keydown(function (event) {


        if (event.which == 65) {   //65: key "A"

            keyAcounter++;

            event.preventDefault();

            listOfLines.push(line);


            checkKeyPressed = true;
            //nameOfContext=prompt("Enter the name: ");

            console.log(line.name);
            console.log(line.points.join());
            //console.log(nameOfContext);
            checkKeyPressed = false;

   /*         for(var i=0;i<listOfLines.length;i++) {
                console.log(i +". line name is :"+ listOfLines[i].name);
                console.log(i+". line has "+ (listOfLines[i].points.length)/2+" points");
                console.log(i+". line has "+ (listOfLines[0].points.length)/2+" points");
                console.log(listOfLines[i].points[i]);

            } */

            var nameofLine=prompt("enter the"+keyAcounter+". line name: ");
            line=new LineClass();
            line.name=nameofLine;
        }


       else if (event.which == 83) {   //83: key "S" ---kaos

            event.preventDefault();
            line.points.pop();
            line.points.pop();
            redrawStoredLines();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0);



            console.log("aaaaaaaaaaaa"+listOfLines[0].points[0]);


            for (var j=0;j<line.length;j+=2){

                ctx.beginPath();
                ctx.moveTo(line.points[j], line.points[j+1]);
                ctx.lineTo(line.points[j+2], line.points[j+3]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
            }



        }

        else if (event.which == 68) {   //68: key "D"

             deleteAllLines();

        }

    });
};



