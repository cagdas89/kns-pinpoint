// When dom ready fire this.
var canvas;
var ctx;

$(function () {

    // Döküman yüklendiği zaman direkt bunu çağırıyor.
    canvas = document.getElementById("floor-plan-canvas");
    ctx = canvas.getContext("2d");

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

}