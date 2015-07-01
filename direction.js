/*! direction.js (c) 2015 Oluwaseun Ogedengbe, MIT seun40.github.io/direction.js/*/
//GLOBALS >_>
var pack = {};
var pages = 0;
var pageC = 0;
var loaded = 0;
var init = function() {
    var cnvasi = [document.createElement("canvas"), document.createElement("canvas")];
    /*loading spinner - This is kept in the background*/
    cnvasi[0].height=480;
    cnvasi[0].width=640;
    cnvasi[0].style.background="#FFF";
    cnvasi[0].style.zIndex=1;
    cnvasi[0].style.position="absolute";
    var object = {
        context: cnvasi[0].getContext('2d'),
        start: Date.now(),
        lines: 16
    }
    object.cW=250;
    object.cH=250;
    object.acW=object.context.canvas.width;
    object.acH=object.context.canvas.height;
    //console.log(object.cW,object.cH,canvas.style);
    document.body.appendChild(cnvasi[0]);
    window.setInterval(loadD, 1000 / 30, object);
    /*carousel*/
    var imageFiles = ["img/oots0001.gif","img/oots0002.gif","img/oots0003.gif","img/oots0004.gif","img/oots0005.gif","img/oots0006.gif","img/oots0007.gif","img/oots0008.gif","img/oots0009.gif","img/oots0010.gif","img/oots0011.gif","img/oots0012.gif","img/oots0013.gif","img/oots0014.gif","img/oots0015.gif","img/oots0016.gif","img/oots0017.gif","img/oots0018.gif","img/oots0019.gif","img/oots0020.gif"];
    var images = [];
    pages = imageFiles.length;
    cnvasi[1].height=480;
    cnvasi[1].width=640;
    cnvasi[1].style.zIndex=2;
    cnvasi[1].style.position="absolute";
    var context = cnvasi[1].getContext('2d');
    document.body.appendChild(cnvasi[1]);
    for(i=0; i<imageFiles.length; i++){
        images.push(new Image());
        images[i].src = imageFiles[i];
        images[i].addEventListener("load", loadI, false);
    }
    pack={images:images,context:context,canvas:cnvasi[1]};
}
var loadI = function(){
    loaded++;
    if(loaded==pages) proceed();
}
var loadD = function(a) {/*don't really care what happens here*/
    var rotation = parseInt(((new Date() - a.start) / 1000) * a.lines) / a.lines;
    a.context.save();
    a.context.clearRect(0, 0, a.acW, a.acH);
    a.context.translate(a.acW / 2, a.acH / 2);
    a.context.rotate(Math.PI * 2 * rotation);
    for (var i = 0; i < a.lines; i++) {
        a.context.beginPath();
        a.context.rotate(Math.PI * 2 / a.lines);
        a.context.moveTo(a.cW / 10, 0);
        a.context.lineTo(a.cW / 4, 0);    
        a.context.lineWidth = a.cW / 30;
        a.context.strokeStyle = "rgba(55,55,55," + i / a.lines + ")";
        a.context.stroke();
    }
    a.context.restore();
};
var nextPage = function(){  
	pageC++;
    if (pageC >= pages) pageC = 0;
    //console.log(pack.images[pageC].height,pack.images[pageC].width);
    pack.canvas.width = pack.images[pageC].width;
    pack.canvas.height = pack.images[pageC].height;
    pack.context.clearRect(0, 0, pack.canvas.width, pack.canvas.height);
	pack.context.drawImage(pack.images[pageC],0,0);
}
var proceed = function(){
    pack.canvas.width = pack.images[pageC].width;
    pack.canvas.height = pack.images[pageC].height;
    pack.context.drawImage(pack.images[pageC],0,0);//init
    if ("ontouchstart" in document.documentElement)
        pack.canvas.addEventListener("touchstart", nextPage, false);
    else pack.canvas.addEventListener("mousedown", nextPage, false);
}
if (window.addEventListener) window.addEventListener("load", init, false);
else if (window.attachEvent) window.attachEvent("onload", init);
else window.onload = init;