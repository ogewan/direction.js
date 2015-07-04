/*! direction.js (c) 2015 Oluwaseun Ogedengbe, MIT seun40.github.io/direction.js/*/
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
    //PROPERTIES
    var self = this;//that
    this.iimg = input.pages;
    this.count= input.pages.length;
    this.current= -1;//-1 for unset, corresponds to current page
    this.spinner = input.loading;
    this.config = input.config;
    this.parent = input.parent;
    this.offset = input.offset;
    this.pstload = [];
    this.preload = [];
    this.master = new Image();
    var objref = {acW:300,acH:300};
    this.layers = [document.createElement("canvas"), document.createElement("canvas")];//By default, we have the display layer and the loading layer
    //console.log(this.layers[1]);
    this.context = this.layers[1].getContext('2d');//display context for drawing
    //METHODS
    this.spin = function(a){//handles spinner(Loader)
        var rotation = parseInt(((Date.now() - a.start) / 1000) * a.lines) / a.lines;
        a.context.save();
        a.context.clearRect(0, 0, a.acW, a.acH);
        //console.log(a.acW, a.acH,arguments.callee);
        a.context.translate(a.acW /2, a.acH /2);
        a.context.rotate(Math.PI * 2 * rotation);
        //console.log(a.color);
        var c = a.color.substr(1);
        if(c.length==3) c = c[0]+C[0]+c[1]+c[1]+c[2]+c[2];//duplicate as per spec
        var red = parseInt(c.substr(0,2),16).toString();
        var green = parseInt(c.substr(2,2),16).toString();
        var blue = parseInt(c.substr(4,2),16).toString();
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
    }
    this.preloadGeneric = function(){
        self.iimg[this.imaginaryID].loaded = true;
        /*possible implementation - Delete it when we are done, possibly saves memory, since its been cached?
        this.imaginaryID=-1;
        this.src="";*/
    }
    this.preloadMaster = function(){//actually a misnomer, master doesnt actually preload, it loads and draws
        if(self.iimg[this.imaginaryID].loaded) self.context.clearRect(0, 0, this.width, this.height);
        else self.iimg[this.imaginaryID].loaded = true;
        //conviently, this callback draws the image as soon as master's src is changed and image loaded
        self.layers[1].width = self.layers[0].width = objref.acW = this.width;
        self.layers[1].height = self.layers[0].height = objref.acH = this.height;
        self.context.drawImage(this,0,0);
        self.current = this.imaginaryID;
    }
    var assign = function(imagething,idd){//assign helper, assigns an src and iid according to given id
        //console.log("World");
        if(!self.iimg[idd].loaded) self.context.clearRect(0, 0, self.layers[1].width, self.layers[1].height);
        imagething.imaginaryID = idd;
        imagething.src = self.iimg[idd].url;
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
        for(var q = idd-1;q>idd-self.config.imgprebuffer-1&&q>=0;q--){
            if(self.iimg[q].loaded) continue;
            self.preload[r].imaginaryID = q;
            self.preload[r].src = self.iimg[q].url;
            r++;
        }
        r = 0;
        for(var q = idd+1;q<self.config.imgpostbuffer+idd+1&&q<self.count;q++){
            if(self.iimg[q].loaded) continue;
            self.pstload[r].imaginaryID = q;
            self.pstload[r].src = self.iimg[q].url;
            r++;
        }
    }
    this.go = function(to){
        var sre = parseInt(to);
        sre = (isNaN(sre))?0:sre;
        assign(self.master,(Math.floor(Math.max(0,Math.min(self.count-1,sre)))));
        return sre;
    }
    this.prev = function(){
        var sre = self.count-1;//avoids possible race condition, assign loads in new image which can call preloadMaster which can change self.current before it gets to the return call. storing it premptively will preserve the value
        if(sre>=0) assign(self.master,sre);
        return sre;
    }
    this.next = function(){
        //console.log("Hello");
        var sre = self.current+1;
        if(sre<self.count) assign(self.master,sre);
        return sre;
    }
    this.frst = function(){
        if(self.current>=0) assign(self.master,0);
        return 0;
    }
    this.last = function(){
        assign(self.master,self.count-1);
        return self.count-1;
    }
    this.rand = function(){
        var sre = Math.floor(Math.random() * self.count-1);
        assign(self.master,sre);
        return sre;
    }
    //LOADER - setup
    this.layers[0].height=480;
    this.layers.width=640;
    this.layers[0].style.background=this.spinner.back;
    this.layers[0].style.zIndex=0;
    this.layers[0].style.position="absolute";
    
    var object = {
        context: this.layers[0].getContext('2d'),
        color: this.spinner.color,
        start: Date.now(),
        lines: this.spinner.lines,
        cW: this.spinner.width,
        cH: this.spinner.height,
        acW: this.layers[1].width,
        acH: this.layers[1].height
    };
    objref = object;
    //console.log(this.layers[1]);
    if(anchor) anchor.appendChild(this.layers[0]);
    else document.body.appendChild(this.layers[0]);
    //console.log(object);
    window.setInterval(this.spin, this.spinner.rate, object);
    //DISPLAY - setup
    this.master = new Image();
    this.master.imaginaryID = -1;//unset to an imaginary image
    this.master.addEventListener("load", this.preloadMaster, false);
    //console.log(this.master);
    for(var q = 0;q<this.iimg.length;q++){
        //this.iimg[q].btog = 0; a holdover from the old html based canvas
        this.iimg[q].desig = (q)?(q==this.iimg.length-1)?1:0:-1;//-1 means first, 0 means middle, 1 means last: true if endpoint, false if middle
        this.iimg[q].loaded = false;
    }
    for(var q = 0;q<input.config.imgprebuffer;q++){
        this.preload.push(new Image());
        this.preload[q].imaginaryID = -1;//unset to an imaginary image
        this.preload[q].addEventListener("load", this.preloadGeneric, false);
    }
    for(var q = 0;q<input.config.imgpostbuffer;q++){
        this.pstload.push(new Image());
        this.pstload[q].imaginaryID = -1;//unset to an imaginary image
        this.pstload[q].addEventListener("load", this.preloadGeneric, false);
    }
    //this.preload[0].imaginaryID = 0;
    //this.preload[0].src = input.pages[0].url;
    this.layers[1].height=480;
    this.layers[1].width=640;
    this.layers[1].background = this.config.back;
    this.layers[1].style.zIndex=1;
    this.layers[1].style.position="absolute";
    if(anchor) anchor.appendChild(this.layers[1]);
    else document.body.appendChild(this.layers[1]);
}