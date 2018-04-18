    /** @preserve infinite(direction).js (c) 2015 Seun Ogedengbe, MIT*/
    /**
     * @suppress {globalThis}
     */
    infinite = function(input,anchor,owrite,c,xper,yper){
        //input - an object, list, or string
        //anchor - the html object to append
        //INITIAL SETUP - Ensures input is the correct format, or dies trying
        c=c||{};
        var holdr = {parent:null,offset:0,loading:{lines:c.lines||16,rate:c.rate||1000 / 30,diameter:c.diameter||250,back:c.loaderback||"#FFF",color:c.color||"#373737"},config:{dir:c.dir||"assets/",pagestartnum:!1,chapterstartnum:!1,imgprebuffer:c.imgprebuffer||5,imgpostbuffer:c.imgpostbuffer||5,startpage:0,back:c.back||"#FFF"},pages:[]};
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
        } else if(!input.pages.length) input.pages.push({alt:"",hover:"",title:"",url:[],release:0,note:"",perm:!1,anim8:!1});
        else if(void 0 === input.pages[0].url) return -1;
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
            keis = {UP:false,DOWN:false,LEFT:false,RIGHT:false},
            trnity = [],
            skroll = {increment:1,duration:1},
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
                if(spinning) window.setTimeout(spin, a.rate, object);
                else a.context.clearRect(0, 0, 300, layers[1].height);
            },
            draw = function(pre,src,nxt) {
                //console.log(pre.imaginaryID,pre.src,pre)
                //console.log(src.imaginaryID,src.src,src)
                //console.log(nxt.imaginaryID,nxt.src,nxt)
                spinning=0;
                context.clearRect(0, 0, layers[1].width, layers[1].height);
                var x=src.dx;
                var y=src.dy;
                //console.log(nxt,x+src.height,y,layers[1].width,nxt.height)
                if(pre) context.drawImage(pre,x,y-pre.height,layers[1].width,pre.height);
                if(src) context.drawImage(src,x,y,layers[1].width,src.height);
                if(nxt) context.drawImage(nxt,x,y+src.height,layers[1].width,nxt.height);
                //console.log(layers[1].height,y,y+src.height)
                if(y>=layers[1].height){
                    //out of bounds
                    var sre = current-1;
                    trnity[1].dx=0;
                    trnity[1].dy=y-pre.height;
                    if(sre>=0) assign(trnity,sre);
                    return sre;
                }
                else if(y+src.height<0){
                    var sre = current+1;
                    trnity[1].dx=0;
                    trnity[1].dy=0;
                    if(sre<count) assign(trnity,sre);
                    return sre;
                }
            },
            scrollit = function(to,time){
                return -1;
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
                /*dis.x=(window.pageXOffset===void 0)?to.x-window.pageXOffset:to.x-document.documentElement.scrollLeft;
                dis.y=(window.pageYOffset===void 0)?to.y-window.pageYOffset:to.y-document.documentElement.scrollTop;*/
                //console.log("to",to,"dis",dis,"(x",window.pageXOffset,document.documentElement.scrollLeft,"| y",window.pageYOffset,document.documentElement.scrollTop,")",time,time/5);
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
                        //if(skroll) scrollit();
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
                    if((idd-1+y)<count&&(idd-1+y)>=0){
                        imagething[y].src = config.dir+iimg[idd-1+y].url[0];
                        //console.log(imagething[y].src)
                    }
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
            },
            pushUP = function(i){
                if(!(current<=0&&trnity[1].dy+i>0)){
                    trnity[1].dy+=i;
                    context.clearRect(0, 0, layers[1].width, layers[1].height);
                    draw(
                        (trnity[0].imaginaryID>=0)?trnity[0]:0,
                        trnity[1],
                        (trnity[2].imaginaryID>=0)?trnity[2]:0
                    )
                }
            },
            pushDOWN = function(i){
                if(!(current>=count-1&&trnity[1].dy-i<(0-trnity[1].height+layers[1].height))){
                    trnity[1].dy-=i;
                    context.clearRect(0, 0, layers[1].width, layers[1].height);
                    draw(
                        (trnity[0].imaginaryID>=0)?trnity[0]:0,
                        trnity[1],
                        (trnity[2].imaginaryID>=0)?trnity[2]:0
                    )
                }
            },
            pushRESET = function(){
                trnity[1].dx=0;
                trnity[1].dy=0;
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
            pushRESET();
            assign(trnity,(Math.floor(Math.max(0,Math.min(count-1,sre)))));
            return sre;
        }
        this.prev = function(){
            var sre = current-1;//avoids possible race condition, assign loads in new image which can call preloadMaster which can change self.current before it gets to the return call. storing it premptively will preserve the value
            if(sre>=0){
                pushRESET();
                assign(trnity,sre);
            }
            return sre;
        }
        this.next = function(){
            //console.log("Hello");
            var sre = current+1;
            if(sre<count){
                pushRESET();
                assign(trnity,sre);
            }
            return sre;
        }
        this.frst = function(){
            if(current>=0){
                pushRESET();
                assign(trnity,0);
            }
            return 0;
        }
        this.last = function(){
            pushRESET();
            assign(trnity,count-1);
            return count-1;
        }
        this.rand = function(){
            var sre = Math.floor(Math.random() * (count-1));
            //console.log(sre);
            pushRESET();
            assign(trnity,sre);
            return sre;
        }
        this.data = function(to){//returns info about slide
            var sre = (to===null||void 0===to)?current:parseInt(to,10);
            return (isNaN(sre))?iimg[current]:iimg[(Math.floor(Math.max(0,Math.min(count-1,sre))))];
        }
        this.scroll = function(incre,dur){
            return skroll = {increment:incre||1,duration:dur||1};
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
            trnity[q].dx = 0;
            trnity[q].dy = 0;
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
            //context.clearRect(0, 0, layers[1].width, layers[1].height);
            layers[1].height=(yper/100||.7)*(window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight);
            layers[1].width=(xper/100||.7)*(window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth);
            draw(
                (trnity[0].imaginaryID>=0)?trnity[0]:0,
                trnity[1],
                (trnity[2].imaginaryID>=0)?trnity[2]:0
            )
        };
        layers[1].onkeydown = function(e){
            e = e || window.event;
            e.preventDefault();
            //console.log(current,trnity[1].dy)
            /*if ((e.keyCode == '38'&&!keis.UP)||e.keyCode == '40'&&!keis.DOWN)
                console.log(trnity[0].imaginaryID,trnity[0],'|',
                            trnity[1].imaginaryID,trnity[1],'|',
                            trnity[2].imaginaryID,trnity[2])*/
            if (e.keyCode == '38'&&!keis.UP) {
                var automanUP = function(){
                    pushDOWN(skroll.increment);
                    if(keis.UP) window.setTimeout(automanUP,skroll.duration);
                }
                keis.UP = true;
                window.setTimeout(automanUP,skroll.duration);
            }
            else if (e.keyCode == '40'&&!keis.DOWN) {
                var automanDOWN = function(){
                    pushUP(skroll.increment);
                    if(keis.DOWN) window.setTimeout(automanDOWN,skroll.duration);
                }
                keis.DOWN = true;
                window.setTimeout(automanDOWN,skroll.duration);
            }
            return 0;
        };
        layers[1].onkeyup = function(e){
            e = e || window.event;
            //e.preventDefault();
            if (e.keyCode == '38') keis.UP=false;
            else if (e.keyCode == '40') keis.DOWN=false;
        }
        //init
        assign(trnity,(owrite===void 0||owrite===null||isNaN(owrite))?config.startpage:owrite);
        //end init
        layers[1].height=(yper/100||.7)*(window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight);
        layers[1].width=(xper/100||.7)*(window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth);
        layers[1].background = config.back;
        layers[1].style.zIndex=1;
        layers[1].style.position="relative";
        layers[1].tabIndex=1000;
        layers[1].style.outline = "none";
        //layers[1].style.visibility="hidden";
        if(anchor) anchor.appendChild(layers[1]);
        else document.body.appendChild(layers[1]);
        this.canvi=layers;
        this.internals = input;
    }