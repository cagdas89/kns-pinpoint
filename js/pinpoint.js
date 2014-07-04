// When dom ready fire this.
var canvas;
var ctx;
var nodes = new Array();
var listOfLines=new Array();
var checkKeyPressed = false;
var removeLastLine=false;
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
   // this.xCoC=new Array();
   // this.yCoC=new Array();

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
    //line.xCoC.length=0;
    //line.yCoC.length=0;
}

function redrawStoredLines() {


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0);


    ctx.moveTo(listOfLines[0].points[i], listOfLines[i].points[i]);
    ctx.lineTo(listOfLines[i].points[i], listOfLines[i].points[i]);

    for(var i=0;i<listOfLines.length;i++){
       /* var connector=connectors[i];
        var box1=boxes[connector.box1];
        var box2=boxes[connector.box2];*/
        for (var j=0;j<listOfLines[i].points.length;j++){

            ctx.beginPath();
            ctx.moveTo(line.points[i], line.points[i]);
            ctx.lineTo(box2.x + box2.w / 2, box2.y + box2.h / 2);
            ctx.stroke();
        }
    }

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
            nodes.length=0;


            for(var i=0;i<listOfLines.length;i++) {
                console.log(i +". line name is :"+ listOfLines[i].name);
                console.log(i+". line has "+ (listOfLines[i].points.length)/2+" points");
                console.log(i+". line has "+ (listOfLines[0].points.length)/2+" points");
                console.log(listOfLines[i].points[i]);

            }

            var nameofLine=prompt("enter the"+keyAcounter+". line name: ");
            line=new LineClass();
            line.name=nameofLine;
        }


       else if (event.which == 83) {   //83: key "S"

            event.preventDefault();
            nodes.pop();
            nodes.pop();
            redrawStoredLines();
            removeLastLine = true;
        }

        else if (event.which == 68) {   //63: key "D"

             deleteAllLines();

        }

    });
};



