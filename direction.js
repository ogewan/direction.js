    /** @preserve direction.js (c) 2015 Seun Ogedengbe, MIT*/
    /**
     * @suppress {globalThis}
     */
    direction = function(input,anchor,owrite,c){
        //input - an object, list, or string
        //anchor - the html object to append
        //INITIAL SETUP - Ensures input is the correct format, or dies trying
        c=c||{};
        var holdr = {parent:null,offset:0,loading:{lines:c.lines||16,rate:c.rate||1000 / 30,diameter:c.diameter||250,/*xpos:1/2,ypos:1/2,*/back:c.loaderback||"#FFF",color:c.color||"#373737"/*back:"#000",color:"#3737FF"*/},config:{dir:c.dir||"assets/",pagestartnum:!1,chapterstartnum:!1,imgprebuffer:c.imgprebuffer||5,imgpostbuffer:c.imgpostbuffer||5,startpage:0,back:c.back||"#FFF"},pages:[]};
        if(void 0===input){
            return -1;
        } else if(typeof input==='string'){
            holdr.pages.push({alt:"",hover:"",title:"",url:[input],release:0,note:"",perm:!1,anim8:!1});
            input = holdr;
        } else if(Array.isArray(input)){
            for(var q = 0;q<input.length;q++){
                holdr.pages.push({alt:"",hover:"",title:"",url:[],release:0,note:"",perm:!1,anim8:!1});
                if(Array.isArray(input[q])){
                    for(var w = 0;w<input[q].length;w++){
                        holdr.pages[q].url.push(input[q][w]);
                    }
                } else holdr.pages[q].url.push(input[q]);
            }
            input = holdr;
        } else if(void 0 === input.pages[0].url) return -1;
        if(void 0 === anchor||anchor == null) anchor = 0;
        //PROPERTIES - private
            //self = this,//we don't need self anymore because, the public methods that require it aren't utlized in private methods //that
        var internal = input,
            a = {
                cur: -1,
                psl: [],
                prl: [],
                mas: new Image(),
                spn: true,
                skl: true,
                lay: [document.createElement("canvas"), document.createElement("canvas")],
                n: function(){return 0},//this null fuction save us some bytes
                col: internal.loading.color,
                str: Date.now(),
                lin: internal.loading.lines,
                dia: internal.loading.diameter,
                rte: internal.loading.rate
            };
        a.ctx=a.lay[1].getContext('2d');
        a.btx=a.lay[0].getContext('2d');
        a.slidestart=a.n;
        a.sliding=a.n;
        a.slidend=a.n;
        var spin = function() {
                a.lay[0].style.paddingLeft=((a.lay[1].width-300)/2)+"px";
                var rotation = Math.floor(((Date.now() - a.str) / 1000) * a.lin) / a.lin,
                    c = a.col.substr(1);
                a.btx.save();
                a.btx.clearRect(0, 0, 300, a.lay[1].height);
                a.btx.translate(150, a.lay[1].height/2);
                a.btx.rotate(Math.PI * 2 * rotation);
                if (c.length == 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
                var red = parseInt(c.substr(0, 2), 16).toString(),
                    green = parseInt(c.substr(2, 2), 16).toString(),
                    blue = parseInt(c.substr(4, 2), 16).toString();
                for (var i = 0; i < a.lin; i++) {
                    a.btx.beginPath();
                    a.btx.rotate(Math.PI * 2 / a.lin);
                    a.btx.moveTo(a.dia / 10, 0);
                    a.btx.lineTo(a.dia / 4, 0);
                    a.btx.lineWidth = a.dia / 30;
                    a.btx.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + i / a.lin + ")";
                    a.btx.stroke();
                }
                a.btx.restore();
                if(a.spn) window.setTimeout(spin, a.rte);
                else a.btx.clearRect(0, 0, 300, a.btx.height);
            },
            scrollit = function(to,time){
                //format inputs
                if(to===null||void 0===to) to={x:0,y:0};
                else if (!isNaN(to)) to={x:0,y:to};//if to is num assume its y
                else {
                    if(to.y===null||void 0===to.y) to.y=0;
                    if(to.x===null||void 0===to.x) to.x=0;
                }
                if(time===null||void 0===time||time<=0) time=400;//ignore given zero time
                //if x or y is less than 0 then go to the bottom
                if(to.y<0) to.y=window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
                if(to.x<0) to.x=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
                //calculate distance needed to travel
                var dis = {x:(window.pageXOffset!==void 0)?to.x-window.pageXOffset:to.x-document.documentElement.scrollLeft,y:(window.pageYOffset!==void 0)?to.y-window.pageYOffset:to.y-document.documentElement.scrollTop};
                if(dis=={x:0,y:0}) return dis;//if that distance is 0 on both x and y, no scrolling required
                var clock = function(c,b,a){
                    window.scrollBy(Math.floor(c.x)/b, Math.floor(c.y)/b);
                    if(a+1<b*5) window.setTimeout(clock,5,c,b,a+1);
                }
                window.setTimeout(clock,5,dis,Math.floor(time/5),0);
                //window.clearInterval(clock);
                return dis;
            },
            preloadGeneric = function(){
                internal.pages[this.imaginaryID].loaded = true;
                /*possible implementation - Delete it when we are done, possibly saves memory, since its been cached?
            this.imaginaryID=-1;
            this.src="";*/
            },
            preloadMaster = function(){//actually a misnomer, master doesnt actually preload, it loads and draws
                if(internal.pages[this.imaginaryID].loaded) a.ctx.clearRect(0, 0, this.width, this.height);
                else internal.pages[this.imaginaryID].loaded = true;
                a.sliding();
                //conviently, this callback draws the image as soon as master's src is changed and image loaded
                a.lay[1].width /*= layers[0].width = objref.acW */= this.width;
                a.lay[1].height = a.lay[0].height /*= objref.acH*/ = this.height;
                a.ctx.drawImage(this,0,0);
                //current = this.imaginaryID;//do not wait on load for page change, do not change page on page load
                /*console.log("killing",intervall);
                window.clearInterval(intervall);
                intervall=-1;*/
                a.spinning=0;
                if(a.skl) scrollit();
                a.slidend();
            },
            assign = function(imagething,idd){//assign helper, assigns an src and iid according to given id
                a.spn=true;
                window.setTimeout(spin, internal.loading.rate);
                a.slidestart();
                if(idd<0) idd=0;//if lower than zero set to zero
                if(idd>=count) idd=count-1; //can not be equal to our higher than the amount of pages
                if(!internal.pages[idd].loaded) a.ctx.clearRect(0, 0, a.lay[1].width, a.lay[1].height);
                imagething.imaginaryID = idd;
                imagething.src = internal.config.dir+internal.pages[idd].url[0];
                a.cur = idd;//we change page as soon as it is assigned, so that page still changes even if it never loads
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
                for(var q = idd-1;q>idd-internal.config.imgprebuffer-1&&q>=0;q--){
                    if(internal.pages[q].loaded) continue;
                    a.prl[r].imaginaryID = q;
                    a.prl[r].src = config.dir+internal.pages[q].url;
                    r++;
                }
                r = 0;
                for(var q = idd+1;q<internal.config.imgpostbuffer+idd+1&&q<internal.pages.length;q++){
                    if(internal.pages[q].loaded) continue;
                    a.psl[r].imaginaryID = q;
                    a.psl[r].src = internal.config.dir+internal.pages[q].url;
                    r++;
                }
            }/*,
            jq = function(){
                if(window.jQuery===void 0) return window.setTimeout(jq,300);
                jQuery.fn.direction = function(a,b,c) {
                    return this.each( function() {
                        direction(a,$(this),b,c);
                    });
                }
            }
        if(c.jq) jq();*/
        //METHODS - public
        this.count = function(){return internal.pages.length;}
        this.current = function(){return a.cur;}
        this.callback = function(type,callback){
            if(type===null||void 0===type) return sliding;
            if(callback===null||void 0===callback) return (type)?(type>0)?a.slidend:a.slidestart:a.sliding;
            if(type)
                if(type>0) a.slidend = callback;
                else a.slidestart = callback;
            else a.sliding = callback;
            return 1;
        }
        this.go = function(to){
            var sre = (to===null||void 0===to)?0:parseInt(to,10);
            //console.log(sre);
            sre = (isNaN(sre))?0:sre;
            assign(a.mas,(Math.floor(Math.max(0,Math.min(internal.pages.length-1,sre)))));
            return sre;
        }
        this.prev = function(){
            var sre = internal.pages.length-1;//avoids possible race condition, assign loads in new image which can call preloadMaster which can change self.current before it gets to the return call. storing it premptively will preserve the value
            if(sre>=0) assign(a.mas,sre);
            return sre;
        }
        this.next = function(){
            //console.log("Hello");
            var sre = a.cur+1;
            if(sre<internal.pages.length) assign(a.mas,sre);
            return sre;
        }
        this.frst = function(){
            if(a.cur>=0) assign(a.mas,0);
            return 0;
        }
        this.last = function(){
            assign(a.mas,internal.pages.length-1);
            return internal.pages.length-1;
        }
        this.rand = function(){
            var sre = Math.floor(Math.random() * (internal.pages.length-1));
            //console.log(sre);
            assign(a.mas,sre);
            return sre;
        }
        this.data = function(to){//returns info about slide
            var sre = (to===null||void 0===to)?current:parseInt(to,10);
            return (isNaN(sre))?internal.pages[current]:internal.pages[sre];
        }
        this.scroll = function(bool){//toggles Auto Scrolling
            if(bool===null||void 0===bool) return a.skl;
            return a.skl=bool;
        }
        this.scrollTo = function(to,time){return scrollit(to,time);}//public wrapper for scrollit
        //LOADER - setup
        a.lay[0].height=480;
        //layers[0].width=640;
        a.lay[0].style.background=internal.config.back;
        a.lay[0].style.paddingLeft="170px";
        a.lay[0].style.zIndex=0;
        a.lay[0].style.position="absolute";

        //objref = object;
        //console.log(layers[1]);
        if(anchor) anchor.appendChild(a.lay[0]);
        else document.body.appendChild(a.lay[0]);
        //console.log(object);
        //intervall=window.setInterval(spin, spinner.rate, object);
        window.setTimeout(spin, internal.loading.rate);
        //DISPLAY - setup
        a.mas = new Image();
        a.mas.imaginaryID = -1;//unset to an imaginary image
        a.mas.addEventListener("load", preloadMaster, false);
        //console.log(this.a.mas);
        for(var q = 0;q<internal.pages.length;q++){
            //internal.pages[q].btog = 0; a holdover from the old html based canvas
            internal.pages[q].desig = (q)?(q==internal.pages.length-1)?1:0:-1;//-1 means first, 0 means middle, 1 means last: true if endpoint, false if middle
            internal.pages[q].loaded = false;
        }
        for(var q = 0;q<input.config.imgprebuffer;q++){
            a.prl.push(new Image());
            a.prl[q].imaginaryID = -1;//unset to an imaginary image
            a.prl[q].addEventListener("load", preloadGeneric, false);
        }
        for(var q = 0;q<input.config.imgpostbuffer;q++){
            a.psl.push(new Image());
            a.psl[q].imaginaryID = -1;//unset to an imaginary image
            a.psl[q].addEventListener("load", preloadGeneric, false);
        }
        //preload[0].imaginaryID = 0;
        //preload[0].src = input.pages[0].url;
        //init
        assign(a.mas,(owrite===void 0||owrite===null||isNaN(owrite))?config.startpage:owrite);
        //end init
        a.lay[1].height=480;
        a.lay[1].width=640;
        a.lay[1].background = internal.config.back;
        a.lay[1].style.zIndex=1;
        a.lay[1].style.position="relative";
        //layers[1].style.visibility="hidden";
        if(anchor) anchor.appendChild(a.lay[1]);
        else document.body.appendChild(a.lay[1]);
        this.canvi=a.lay;
        this.internals = internal;
    }