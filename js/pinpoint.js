// When dom ready fire this.
var canvas;
var ctx;
var nodes = new Array();
var xCo=new Array();
var yCo=new Array();
var clickCounter = 0;
var xTriggered = 0;
var checkKeyPressed = false;
var nameOfContext;
var removeLastLine=false;
var area;
var background;


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


/*
function polygonArea(X, Y)
{
   area = 0;
   var j = nodes.length-1;

    for (var i=0; i<numPoints; i++){
     area = area +  (X[j]+X[i]) * (Y[j]-Y[i]);
        j = i;  //j is previous vertex to i
    }
    return area/2;
}
*/
function redrawStoredLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


        ctx.drawImage(background, 0, 0);


      if (nodes.length == 0) {
        return;
    }

    // redraw each stored line
    for (var i = 0; i < nodes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(xCo[i], yCo[i]);
        ctx.lineTo(xCo[i+1], yCo[i+1]);
        ctx.stroke();
    }
}

function pinpoint() {


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

            if(((x-nodes[0]<50 && x-nodes[0]>0)||(x-nodes[0]<0 && x-nodes[0]>-50)) && ((y-nodes[1]<50 && y-nodes[1]>0)||(y-nodes[1]<0 && y-nodes[1]>-50)) ){

                x=nodes[0];
                y=nodes[1];

            }


            nodes.push(x);
            nodes.push(y);
            xCo.push(x);
            yCo.push(y);

            ctx.beginPath();
            ctx.moveTo(nodes[nodes.length - 4], nodes[nodes.length - 3]);
            ctx.lineTo(nodes[nodes.length - 2], nodes[nodes.length - 1]);

           /* ctx.moveTo(xCo[counter], yCo[counter]);
            ctx.lineTo(xCo[counter+1], yCo[counter+1]);*/


            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

            clickCounter++;

        }
    });


    $("body").keydown(function (event) {

        xTriggered++;
        if (event.which == 65) {   //65: key "A"

            event.preventDefault();
            checkKeyPressed = true;
            nameOfContext=prompt("Enter the name: ");
            console.log(nodes.join());
            console.log(nameOfContext);
            checkKeyPressed = false;
            nodes.length=0;
        }


       else if (event.which == 83) {   //83: key "S"

            event.preventDefault();
            nodes.pop();
            nodes.pop();
            xCo.pop();
            yCo.pop();

            redrawStoredLines();
            removeLastLine = true;
        }

    });
};



