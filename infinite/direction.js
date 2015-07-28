    /** @preserve infinite(direction).js (c) 2015 Seun Ogedengbe, MIT*/
    /**
     * @suppress {globalThis}
     */
    infinite = function(input,anchor,owrite,c){
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
        var iimg = input.pages,
            count= input.pages.length,  
            spinning=true,//is the spinner spinning?
            current= -1,//-1 for unset, corresponds to current page,
            spinner = input.loading,
            config = input.config,
            parent = input.parent,
            offset = input.offset,
            pstload = [],
            preload = [],
            //master = new Image(),
            trnity = [],
            skroll = false,
            layers = [document.createElement("canvas"), document.createElement("canvas")],//By default, we have the display layer and the loading layer
            context = layers[1].getContext('2d'),//display context for drawing
            //METHODS - private
            n = function(){return 0},//this null fuction save us some bytes
            slidestart=n,
            sliding=n,
            slidend=n,
            object = {
                context: layers[0].getContext('2d'),
                color: spinner.color,
                start: Date.now(),
                lines: spinner.lines,
                diameter: spinner.diameter,
                rate: spinner.rate
            },
            spin = function(a) {
                layers[0].style.paddingLeft=((layers[1].width-300)/2)+"px";
                var rotation = Math.floor(((Date.now() - a.start) / 1000) * a.lines) / a.lines,
                    c = a.color.substr(1);
                a.context.save();
                a.context.clearRect(0, 0, 300, layers[1].height);
                a.context.translate(150, layers[1].height/2);
                a.context.rotate(Math.PI * 2 * rotation);
                if (c.length == 3) c = c[0] + C[0] + c[1] + c[1] + c[2] + c[2];
                var red = parseInt(c.substr(0, 2), 16).toString(),
                    green = parseInt(c.substr(2, 2), 16).toString(),
                    blue = parseInt(c.substr(4, 2), 16).toString();
                for (var i = 0; i < a.lines; i++) {
                    a.context.beginPath();
                    a.context.rotate(Math.PI * 2 / a.lines);
                    a.context.moveTo(a.diameter / 10, 0);
                    a.context.lineTo(a.diameter / 4, 0);
                    a.context.lineWidth = a.diameter / 30;
                    a.context.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + i / a.lines + ")";
                    a.context.stroke();
                }
                a.context.restore();
                if(spinning||1) window.setTimeout(spin, a.rate, object);
                else a.context.clearRect(0, 0, 300, layers[1].height);
            },
            draw = function(pre,src,nxt) {
                //console.log(pre,src,nxt)
                context.clearRect(0, 0, layers[1].width, layers[1].height);
                var x=src.x;
                var y=src.y;
                if(pre) context.drawImage(pre,x-pre.height,y,layers[1].width,pre.height);
                if(src) context.drawImage(src,x,y,layers[1].width,src.height);
                if(nxt) context.drawImage(nxt,x+src.height,y,layers[1].width,nxt.height);
            },
            scrollit = function(to,time){
                return {x:(window.pageXOffset!==void 0)?to.x-window.pageXOffset:to.x-document.documentElement.scrollLeft,y:(window.pageYOffset!==void 0)?to.y-window.pageYOffset:to.y-document.documentElement.scrollTop};
            },
            preloadGeneric = function(){
                iimg[this.imaginaryID].loaded = true;
                /*possible implementation - Delete it when we are done, possibly saves memory, since its been cached?
            this.imaginaryID=-1;
            this.src="";*/
            },
            preloadTrnity = [
                function(){
                    if(this.imaginaryID<0||this.imaginaryID>=count||this.imaginaryID===void 0||this.src===void 0) return 0;
                    if(iimg[this.imaginaryID].loaded) context.clearRect(0, 0, layers[1].width, layers[1].height);
                    else iimg[this.imaginaryID].loaded = true;
                    draw(
                        (trnity[0].imaginaryID>=0)?trnity[0]:0,
                        this,
                        (trnity[2].imaginaryID>=0)?trnity[2]:0
                        )
                },
                function(){
                    if(this.imaginaryID<0||this.imaginaryID>=count||this.imaginaryID===void 0||this.src===void 0) return 0;
                    if(iimg[this.imaginaryID].loaded) context.clearRect(0, 0, layers[1].width, layers[1].height);
                    else iimg[this.imaginaryID].loaded = true;
                    sliding();
                    draw(
                        (trnity[0].imaginaryID>=0)?trnity[0]:0,
                        this,
                        (trnity[2].imaginaryID>=0)?trnity[2]:0
                        )
                        spinning=0;
                        if(skroll) scrollit();
                    slidend();
                }, function(){preloadTrnity[0]()}],
            assign = function(imagething,idd){//assign helper, assigns an src and iid according to given id
                //console.log("World");
                /*console.log("dead",intervall);
                if(intervall<0) intervall = window.setInterval(spin, spinner.rate, object);
                console.log("started",intervall);*/
                spinning=true;
                window.setTimeout(spin, spinner.rate, object);
                slidestart();
                if(idd<0) idd=0;//if lower than zero set to zero
                if(idd>=count) idd=count-1; //can not be equal to our higher than the amount of pages
                if(!iimg[idd].loaded) context.clearRect(0, 0, layers[1].width, layers[1].height);
                for(var y=0;y<3;y++){
                    imagething[y].imaginaryID = idd-1+y;
                    if((idd-1+y)<count&&(idd-1+y)>=0) imagething[y].src = config.dir+iimg[idd-1+y].url[0];
                    else{
                        imagething[y].imaginaryID = -1;
                        imagething[y].src = '';
                    }
                }
                current = idd;//we change page as soon as it is assigned, so that page still changes even if it never loads
                var r = 0;
                for(var q = idd-1;q>idd-config.imgprebuffer-1&&q>=0;q--){
                    if(iimg[q].loaded) continue;
                    preload[r].imaginaryID = q;
                    preload[r].src = config.dir+iimg[q].url;
                    r++;
                }
                r = 0;
                for(var q = idd+1;q<config.imgpostbuffer+idd+1&&q<count;q++){
                    if(iimg[q].loaded) continue;
                    pstload[r].imaginaryID = q;
                    pstload[r].src = config.dir+iimg[q].url;
                    r++;
                }
            }/*,
            jq = function(){
                this.attempts = 0||this.attempts+1;
                if(window.jQuery===void 0&&this.attempts<10) return window.setTimeout(jq,300);
                jQuery.fn.direction = function(a,b,c) {
                    return this.each( function() {
                        direction(a,$(this),b,c);
                    });
                }
            }
        if(c.jq) jq();*/
        //METHODS - public
        this.count = function(){return count;}
        this.current = function(){return current;}
        this.callback = function(type,callback){
            if(type===null||void 0===type) return sliding;
            if(callback===null||void 0===callback) return (type)?(type>0)?slidend:slidestart:sliding;
            if(type)
                if(type>0) slidend = callback;
                else slidestart = callback;
            else sliding = callback;
            return 1;
        }
        this.go = function(to){
            var sre = (to===null||void 0===to)?0:parseInt(to,10);
            //console.log(sre);
            sre = (isNaN(sre))?0:sre;
            assign(master,(Math.floor(Math.max(0,Math.min(count-1,sre)))));
            return sre;
        }
        this.prev = function(){
            var sre = current-1;//avoids possible race condition, assign loads in new image which can call preloadMaster which can change self.current before it gets to the return call. storing it premptively will preserve the value
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
        this.data = function(to){//returns info about slide
            var sre = (to===null||void 0===to)?current:parseInt(to,10);
            return (isNaN(sre))?iimg[current]:iimg[sre];
        }
        this.scroll = function(bool){//toggles Auto Scrolling
            if(bool===null||void 0===bool) return skroll;
            return skroll=bool;
        }
        this.scrollTo = function(to,time){return scrollit(to,time);}//public wrapper for scrollit
        //LOADER - setup
        layers[0].height=480;
        //layers[0].width=640;
        layers[0].style.background=spinner.back;
        layers[0].style.paddingLeft="170px";
        layers[0].style.zIndex=0;
        layers[0].style.position="absolute";

        //objref = object;
        //console.log(layers[1]);
        if(anchor) anchor.appendChild(layers[0]);
        else document.body.appendChild(layers[0]);
        //console.log(object);
        //intervall=window.setInterval(spin, spinner.rate, object);
        window.setTimeout(spin, spinner.rate, object);
        //DISPLAY - setup
        for(var q = 0;q<3;q++){
            trnity.push(new Image());
            trnity[q].imaginaryID = -1;//unset to an imaginary image
            trnity[q].x = 0;
            trnity[q].y = 0;
            trnity[q].addEventListener("load", preloadTrnity[q], false);
        }
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
        //eventListeners
        window.onresize=function(){
            layers[1].height=.7*(window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight);
            layers[1].width=.7*(window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth);
            draw(
                (trnity[0].imaginaryID>=0)?trnity[0]:0,
                this,
                (trnity[2].imaginaryID>=0)?trnity[2]:0
            )
        };
        //init
        assign(trnity,(owrite===void 0||owrite===null||isNaN(owrite))?config.startpage:owrite);
        //end init
        layers[1].height=.7*(window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight);
        layers[1].width=.7*(window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth);
        layers[1].background = config.back;
        layers[1].style.zIndex=1;
        layers[1].style.position="relative";
        //layers[1].style.visibility="hidden";
        if(anchor) anchor.appendChild(layers[1]);
        else document.body.appendChild(layers[1]);
        this.canvi=layers;
        this.internals = input;
    }