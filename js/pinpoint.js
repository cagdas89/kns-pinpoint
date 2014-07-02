// When dom ready fire this.
var canvas;
var ctx;
var nodes = new Array();
var clickCounter=0;

$(function () {

    // Döküman yüklendiği zaman direkt bunu çağırıyor.
    canvas = document.getElementById("floor-plan-canvas");
    ctx = canvas.getContext("2d");

  /*  canvas = document.getElementById("floor-plan-canvas");
    var context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(150, 150);
    context.lineTo(150, 200);
    context.lineWidth = 10;
    context.strokeStyle = '#ff0000';
    context.stroke();
*/
    // HTML dökümanındaki canvas elementine bir tane kat planı resmini
    // background olarak atıyoruz.
    var background = new Image();
    background.src = "http://sypiazza.s3.amazonaws.com/images/floors/16_original.png?1391002511";

    background.onload = function() {
        // Resim browser tarafından indirilince fire edildiği
        // için burda background 'ı set edip, pinpoint fonksiyonunu
        // yani asıl işi yapacak fonksiyonu çağırabiliriz.
        ctx.drawImage(background,0,0);
        pinpoint();
    };


});



function pinpoint() {

         $("#floor-plan-canvas").click(function (e) {


                 var element = canvas;
                 var offsetX = 0, offsetY = 0

                 if (element.offsetParent) {
                     do {
                         offsetX += element.offsetLeft;
                         offsetY += element.offsetTop;
                     } while ((element = element.offsetParent));
                 }

                var x = e.pageX - offsetX;
                var y = e.pageY - offsetY;

                nodes.push(x);
                nodes.push(y);

                ctx.beginPath();
                ctx.moveTo(nodes[0],nodes[1]);
             ctx.lineTo(nodes[2], nodes[3]);
             ctx.lineTo(nodes[4], nodes[5]);
             ctx.lineTo(nodes[6], nodes[7]);
             ctx.lineTo(nodes[8], nodes[9]);
                //ctx.lineTo(nodes[nodes.length-2], nodes[nodes.length-1]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();


                  clickCounter++;

                        /*
                if (nodes.length == 11) {
                    nodes.length = 0
                    clickCounter = 0;
                }

                */
            });


       if ((clickCounter == 5) && (nodes[0] == nodes[8]) && (nodes[1] == nodes[9])) {

           var x0 = nodes[0];
           var y0 = nodes[1];
           var x1 = nodes[2];
           var y1 = nodes[3];
           var x2 = nodes[4];
           var y2 = nodes[5];
           var x3 = nodes[6];
           var y3 = nodes[7];

           //quadrilateral area formula:
           var area = ((x0 * y1 - x1 * y0) + (x1 * y2 - x2 * y1) + (x2 * y3 - x3 * y2) + (x3 * y0 - x0 * y3)) / 2;
            console.log(area);

       }
    else{console.log("aaaa");}


};



