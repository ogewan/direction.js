/** @preserve direction.js (c) 2015 Oluwaseun Ogedengbe, MIT seun40.github.io/direction.js/*/
/**
 * @suppress {globalThis}
 */
var direction = function(input,anchor){
    //input - an object, list, or string
    //anchor - the html object to append
    //INITIAL SETUP - Ensures input is the correct format, or dies trying
    if(void 0===input){
        return -1;
    } else if(typeof input==='string'){
        input = {parent:null,offset:0,loading:{lines:16,rate:1000 / 30,width:250,height:250,xpos:1/2,ypos:1/2,back:"#FFF",color:"#373737"},config:{dir:"assets/",pagestartnum:!1,chapterstartnum:!1,imgprebuffer:5,imgpostbuffer:5,startpage:0,back:"#FFF"},pages:[{alt:"",hover:"",title:"",url:[input],release:0,note:"",perm:!1,anim8:!1}],chapters:[]};
    } else if(Array.isArray(input)){
        var holdr = {parent:null,offset:0,loading:{lines:16,rate:1000 / 30,width:250,height:250,xpos:1/2,ypos:1/2,back:"#FFF",color:"#373737"/*back:"#000",color:"#3737FF"*/},config:{dir:"assets/",pagestartnum:!1,chapterstartnum:!1,imgprebuffer:5,imgpostbuffer:5,startpage:0,back:"#FFF"},pages:[],chapters:[]};
        for(var q = 0;q<input.length;q++){
            holdr.pages.push({alt:"",hover:"",title:"",url:input[q],release:0,note:"",perm:!1,anim8:!1});
        }
        input = holdr;
    } else if(void 0 === input.pages[0].url) return -1;
    if(void 0 === anchor||anchor == null) anchor = 0;
    //PROPERTIES - private
        //self = this,//we don't need self anymore because, the public methods that require it aren't utlized in private methods //that
    var iimg = input.pages,
        count= input.pages.length,
        current= -1,//-1 for unset, corresponds to current page,
        spinner = input.loading,
        config = input.config,
        parent = input.parent,
        offset = input.offset,
        pstload = [],
        preload = [],
        master = new Image(),
        objref = {acW:300,acH:300},//the purpose of objref, is to allow dynamic canvas resizing in layer 0
        layers = [document.createElement("canvas"), document.createElement("canvas")],//By default, we have the display layer and the loading layer
        //console.log(this.layers[1]);
        context = layers[1].getContext('2d'),//display context for drawing
    //METHODS - private
        n = function(){return 0},//this null fuction save us some bytes
        slidestart=n,
        sliding=n,
        slidend=n,
        spin = function(a){//handles spinner(Loader)
            //var rotation = ((Date.now() - a.start) / 1000) * a.lines / a.lines,
            var rotation = Math.floor(((Date.now() - a.start) / 1000) * a.lines)/a.lines,
                c = a.color.substr(1);
            a.context.save();
            a.context.clearRect(0, 0, a.acW, a.acH);
            //console.log(rotation,rrotation, a.start,a.lines);
            a.context.translate(a.acW /2, a.acH /2);
            a.context.rotate(Math.PI * 2 * rotation);
            //console.log(a.color);
            if(c.length==3) c = c[0]+C[0]+c[1]+c[1]+c[2]+c[2];//duplicate as per spec
            var red = parseInt(c.substr(0,2),16).toString(),
                green = parseInt(c.substr(2,2),16).toString(),
                blue = parseInt(c.substr(4,2),16).toString();
            for (var i = 0; i < a.lines; i++) {
                a.context.beginPath();
                a.context.rotate(Math.PI * 2 / a.lines);
                a.context.moveTo(a.cW / 10, 0);
                a.context.lineTo(a.cW / 4, 0);    
                a.context.lineWidth = a.cW / 30;
                a.context.strokeStyle = "rgba("+red+","+green+","+blue+"," + i / a.lines + ")";
                a.context.stroke();
            }
            a.context.restore();
        },
        preloadGeneric = function(){
            iimg[this.imaginaryID].loaded = true;
            /*possible implementation - Delete it when we are done, possibly saves memory, since its been cached?
        this.imaginaryID=-1;
        this.src="";*/
        },
        preloadMaster = function(){//actually a misnomer, master doesnt actually preload, it loads and draws
            if(iimg[this.imaginaryID].loaded) context.clearRect(0, 0, this.width, this.height);
            else iimg[this.imaginaryID].loaded = true;
            sliding();
            //conviently, this callback draws the image as soon as master's src is changed and image loaded
            layers[1].width = layers[0].width = objref.acW = this.width;
            layers[1].height = layers[0].height = objref.acH = this.height;
            context.drawImage(this,0,0);
            current = this.imaginaryID;
            slidend();
        },
        assign = function(imagething,idd){//assign helper, assigns an src and iid according to given id
            //console.log("World");
            slidestart();
            if(!iimg[idd].loaded) context.clearRect(0, 0, layers[1].width, layers[1].height);
            imagething.imaginaryID = idd;
            imagething.src = iimg[idd].url;
            /*console.log("----");
        for(var q = idd-1;q>idd-self.config.imgprebuffer-1&&q>=0;q--){
            console.log(q);
        }
        console.log("//");
        for(var q = idd+1;q<self.config.imgpostbuffer+idd+1&&q<self.count;q++){
            console.log(q);
         continue;

        console.log("----");*/
            var r = 0;
            for(var q = idd-1;q>idd-config.imgprebuffer-1&&q>=0;q--){
                if(iimg[q].loaded) continue;
                preload[r].imaginaryID = q;
                preload[r].src = iimg[q].url;
                r++;
            }
            r = 0;
            for(var q = idd+1;q<config.imgpostbuffer+idd+1&&q<count;q++){
                if(iimg[q].loaded) continue;
                pstload[r].imaginaryID = q;
                pstload[r].src = iimg[q].url;
                r++;
            }
        }
    //METHODS - public
    this.count = function(){return count;}
    this.current = function(){return current;}
    this.callback = function(type,callback){
        if(type===null||void 0===type) return sliding;
        if(callback===null||void 0===callback) return (type)?(type>0)?slidestart:slidend:sliding;
        if(type)
            if(type>0) slidestart = callback;
            else slidend = callback;
        else sliding = callback;
        return 1;
    }
    this.go = function(to){
        var sre = parseInt(to,1);
        sre = (isNaN(sre))?0:sre;
        assign(master,(Math.floor(Math.max(0,Math.min(count-1,sre)))));
        return sre;
    }
    this.prev = function(){
        var sre = count-1;//avoids possible race condition, assign loads in new image which can call preloadMaster which can change self.current before it gets to the return call. storing it premptively will preserve the value
        if(sre>=0) assign(master,sre);
        return sre;
    }
    this.next = function(){
        //console.log("Hello");
        var sre = current+1;
        if(sre<count) assign(master,sre);
        return sre;
    }
    this.frst = function(){
        if(current>=0) assign(master,0);
        return 0;
    }
    this.last = function(){
        assign(master,count-1);
        return count-1;
    }
    this.rand = function(){
        var sre = Math.floor(Math.random() * (count-1));
        //console.log(sre);
        assign(master,sre);
        return sre;
    }
    //LOADER - setup
    layers[0].height=480;
    layers.width=640;
    layers[0].style.background=spinner.back;
    layers[0].style.zIndex=0;
    layers[0].style.position="absolute";
    
    var object = {
        context: layers[0].getContext('2d'),
        color: spinner.color,
        start: Date.now(),
        lines: spinner.lines,
        cW: spinner.width,
        cH: spinner.height,
        acW: layers[1].width,
        acH: layers[1].height
    };
    objref = object;
    //console.log(layers[1]);
    if(anchor) anchor.appendChild(layers[0]);
    else document.body.appendChild(layers[0]);
    //console.log(object);
    window.setInterval(spin, spinner.rate, object);
    //DISPLAY - setup
    master = new Image();
    master.imaginaryID = -1;//unset to an imaginary image
    master.addEventListener("load", preloadMaster, false);
    //console.log(this.master);
    for(var q = 0;q<iimg.length;q++){
        //iimg[q].btog = 0; a holdover from the old html based canvas
        iimg[q].desig = (q)?(q==iimg.length-1)?1:0:-1;//-1 means first, 0 means middle, 1 means last: true if endpoint, false if middle
        iimg[q].loaded = false;
    }
    for(var q = 0;q<input.config.imgprebuffer;q++){
        preload.push(new Image());
        preload[q].imaginaryID = -1;//unset to an imaginary image
        preload[q].addEventListener("load", preloadGeneric, false);
    }
    for(var q = 0;q<input.config.imgpostbuffer;q++){
        pstload.push(new Image());
        pstload[q].imaginaryID = -1;//unset to an imaginary image
        pstload[q].addEventListener("load", preloadGeneric, false);
    }
    //preload[0].imaginaryID = 0;
    //preload[0].src = input.pages[0].url;
    layers[1].height=480;
    layers[1].width=640;
    layers[1].background = config.back;
    layers[1].style.zIndex=1;
    layers[1].style.position="absolute";
    if(anchor) anchor.appendChild(layers[1]);
    else document.body.appendChild(layers[1]);
}