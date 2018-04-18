# Infinite direction.js
Infinite Scrolling Carousel based off of [direction.js] for [comix-ngn]

***Since its Canvas only, it doesn't require any CSS***
## Usage
* First, your gonna want to import it. You can do this with your typical: 
   
  ```<script src="infdirection.min.js"></script>```
  
  But I actually recommend **deferring** it with [Patrick Sexton's method on feedthebot]:

  ``` html
  <script>
  function defer() {
	var element = document.createElement("script");
	element.src = "infdirection.js";
	document.body.appendChild(element);
  }
  if (window.addEventListener)
	window.addEventListener("load", defer, false);
  else if (window.attachEvent)
    window.attachEvent("onload", defer);
  else window.onload = defer;
  </script>
  ```
  Like [direction.js] it comes in three flavors:
  * infdirection.js - the uncompressed file, for development and debugging
  * infdirection.min.js - the minified file, for production **[Recommended]**
  * direction.nan.js - the nanofied file, experimental
  * There is no plus edition because this is not a microlib.

* You can set the constructor to any dang var you want, by default it is "infinite". Simply use new "infinite"(input, anchor) to create the carousel.

``` js
var input = ["0.png","1.png","2.png","3.png"];
var anchor = document.body;
var overwrite = 1;
var config = {color:"#373737"}
var foo = new infinite(input,anchor,overwrite,config,xpercent,ypercent);
```
  * input - **REQUIRED** - can either be a single image source, an array of image sources, or a correctly formatted object.*
  * anchor - *OPTIONAL* - an HTMLelement to append the carousel to. By default, it will attach to the body.**
  * overwrite - *OPTIONAL* - By default, direction will show the first page. To show a different page on load add this argument.
  * config - *OPTIONAL* - Unless you supply a formatted object, direction will use default settings. To customize these settings without a formatted object, supply this configuration object.
  * xpercent - *OPTIONAL* - Controls the width in relation to a percentage of the parent object alias for manually adjusting style properties, but will reset on resize.
  * ypercent - *OPTIONAL* - Same as xpercent but for height.
``` js
{
	dir: string				//the directory that contains the images,
	//it defaults to "assets/" not ""
	lines: int				//how many lines the spinner is made of
	rate: int/float			//the rate at which the animation plays
	diameter: int			//the diameter of the spinner
	loaderback: hexstring	//the color of the back of the loading screen
	color: hextring			//the color of the spinner
	imgprebuffer: int		//the # of images before the currently displayed on to preload
	imgpostbuffer: int		//the # of images after the currently displayed on to preload
	back: hexstring			//the color of the back of the display canvas
	jq: bool(true/false)	//jQuery plugin, allows the use of direction anchored to
	//the elements of a jQuery selector. The anchor argument is ommitted. Only works with Plus.
	$("#mycarousel").direction(input,overwrite,config)
}
```
There are some slight functionality difference between infinite and direction such as:
* infinite comes with a resize event handler and on keypress event handlers. Pressing the arrows while having the canvas selected will disable not only scrolling, but everything else.
* all slide commands: go, frst, prev, next, last, and rand, will change the center slide, and place it at the top instead of scrolling it.
* scroll is completely changed. It controls the speed of scrolling.
* scrollto now only works on the canvas, scrolling by command but not the page.

##API

`go(index)` - go to the slide at index, goes to first slide by default

`frst()` - go to the first slide

`prev()` - go back a slide

`next()` - go forward a slide

`last()` - go to the last slide

`rand()` - go to a random slide

`current()` - gets the current slide

`count()` - gets the total amount of slides

`data(index)` - gets information about the slide at index, such as name and url, defaults to current page.

`scroll(iteration, duration)` - controls scrolling speed. Iteration controls the amount of pixels scrolled per frame, and duration controls the amount of time between frame in milliseconds. The default is (1,1).

`scrollTo(place,time)` - scroll to place in given time (milliseconds) ***in the canvas***
* if no arguments are given, it scrolls to the top left (0,0) in default time

* if given a place that is a number, it will assume that place is a vertical coordinate

* place can also be an object with x and y properties corresponding to horizontal and vertical position respectively

* if not given a time, the default duration is 400 milliseconds

* if a negative value is given for place, it scrolls to the opposite position.
  
   I.E ```scrollTo({-1,-1});``` will scroll to the bottom right in default time

`callback(type,function)` - gets/sets a slide transition callback
* slides/pages have three states:
  * slidestart (type: -1) - called when at the beginning of a slide transition
  * sliding (type: 0) - called in the middle of a slide transition
  * slidend (type: 1) - called once a slide transition finishes
* When called with no arguments, callback **gets** the sliding callback
* When called with one argument, type, it **gets** the corresponding callback of that type
* When called with a type and a function, it **sets** the callback of the state of given type
  
   I.E ```canvas(-1,foo);``` will set the callback of slidestart to foo

## Browser Support
Same as [direction.js]

[![Modern Browsers][2]][1]
is a good guide

## TODO
* find suspected race conditions on scrolling.
* enable scrollTo method
* size reduction
* make demo

[comix-ngn]: http://comixngn.js.org/
[direction.js]: http://ogewan.github.io/direction.js/
[Patrick Sexton's method on feedthebot]: https://www.feedthebot.com/pagespeed/defer-loading-javascript.html
[Google's Closure Compiler]: https://developers.google.com/closure/compiler/
[Slack]: https://github.com/thebird/swipe
[Bootstrap Carousel]: http://getbootstrap.com/javascript/
[other carousels]: https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=carousels&es_th=1
[cannot call method 'appendChild' of null]: http://stackoverflow.com/questions/8670530/javascript-error-cannot-call-method-appendchild-of-null
[1]: http://caniuse.com/#feat=canvas
[2]: http://i.snag.gy/VcmK1.jpg