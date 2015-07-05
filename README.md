# direction.js
MicroLib Canvas Carousel built for [comix-ngn] as smaller, canvas only alternative to [Swipe], [Slack], [Bootstrap Carousel], and [other carousels].

***Since its Canvas only, it doesn't require any CSS***
##Usage
* First, your gonna want to import it. You can do this with your typical: 
   
  ```<script src="direction.min.js"></script>```
  
  But I actually recommend **deferring** it with [Patrick Sexton's method on feedthebot]:

  ``` html
  <script>
  function defer() {
	var element = document.createElement("script");
	element.src = "direction.js";
	document.body.appendChild(element);
  }
  if (window.addEventListener)
	window.addEventListener("load", defer, false);
  else if (window.attachEvent)
    window.attachEvent("onload", defer);
  else window.onload = defer;
  </script>
  ```
  Oh and almost forgot, direction.js comes in three flavors:
  * direction.js - the uncompressed file, for development and debugging
  * direction.min.js - the minified file, for production **[Recommended]**
  * direction.nan.js - the wild child, I mean *nanofied* file, mainly proof of concept. Uses [Google's Closure Compiler] Advanced Optimizations. It has been tested to work and *should* perform exactly like its big sisters, but I make no promises. It is ~858 bytes smaller than min, so you gain that for its *creativity* ;).
* You can set the constructor to any dang var you want, by default it is "direction". Simply use new "direction"(input, anchor) to create the carousel.

``` js
var input = ["0.png","1.png","2.png","3.png"];
var anchor = document.body;
var foo = new direction(input,anchor);
```
  * input - **REQUIRED** - can either be a single image source, an array of image sources, or a correctly formatted object.*
  * anchor - *OPTIONAL* - an HTMLelement to append the carousel to. By default, it will attach to the body.**

Now at this point, you'd probably be wondering why it isn't doing anything. All the other carousels, you've tried did moved around fancily flipping through images and stuff. You might even be prompted to ask, "Seun40, why isn't it doing anything?". And to that I answer, that's what it's supposed to do.

This carousel is pretty **barebones**. If you want it to do something, you'll probably have to write a lil script to do it for you. But fear not, its easy peasy.

Example: 
``` js 
window.setInterval(foo.next,1000);//Auto scrolls through Webcomic from first to last page
```

##API

`go(index)` - go to the slide at index

`frst()` - go to the first slide

`prev()` - go back a slide

`next()` - go forward a slide

`last()` - go to the last slide

`rand()` - go to a random slide

`current()` - gets the current slide

`count()` - gets the total amount of slides

`scroll()` - gets/sets the status of the auto scroll. To auto scroll to the top of the page on slide change, set to true,. To disable, set it to false. It is true by default

`scrollTo(place,time)` - scroll to place in given time (milliseconds)
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
Although I haven't tested it in anything but my browser, cause I'm bad at programming :P, It requires **requires** canvas so...
[![Modern Browsers][2]][1]
is a good guide

## TODO
* ~~Secure variables and methods that don't need to be public, i.e replacing current and count with getter functions.~~
* ~~Scrollto implementation~~
* Efficient spinner, currently spinner is always animated, since it uses setInterval, using requestAnimationFrame alone would cut my userbase so I need the fallback, but the first issue is getting the fallback to work.

_*I say direction can take an object as an argument, but_ **_DO NOT USE AN OBJECT_** _. I only included the object parameter for completeness. Unlike the string and array of strings, the object is assumed to be correct, but only works correctly for the formatted JSON objects in [comix-ngn]. Unless your object is formatted exactly the same, it will break the function._

_**Because it attaches to an element in the DOM, please make sure that the DOM is loaded/ready before you call direction(). If you don't it will immediately hit a "[cannot call method 'appendChild' of null]" error._


[comix-ngn]: http://comixngn.js.org/
[Swipe]: http://kenwheeler.github.io/slick/
[Patrick Sexton's method on feedthebot]: https://www.feedthebot.com/pagespeed/defer-loading-javascript.html
[Google's Closure Compiler]: https://developers.google.com/closure/compiler/
[Slack]: https://github.com/thebird/swipe
[Bootstrap Carousel]: http://getbootstrap.com/javascript/
[other carousels]: https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=carousels&es_th=1
[cannot call method 'appendChild' of null]: http://stackoverflow.com/questions/8670530/javascript-error-cannot-call-method-appendchild-of-null
[1]: http://caniuse.com/#feat=canvas
[2]: http://i.snag.gy/VcmK1.jpg