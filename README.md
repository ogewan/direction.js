# direction.js
MicroLib Canvas Carousel built for [comix-ngn] as smaller, canvas only alternative to [Swipe], [Slick], [Bootstrap Carousel], and [other carousels]. < 5 KB or your money back!

***Since its Canvas only, it doesn't require any CSS***
## Installation
* via script: 
  
```<script src="http://ogewan.github.io/direction.js/direction.min.js"></script>```

* [download](http://ogewan.github.io/direction.js/direction.min.js)

## Usage
* You can set the constructor to any dang var you want, by default it is "direction". Simply use new "direction"(input, config) to create the carousel.

``` js
var input = ["0.png","1.png","2.png","3.png"];
var config = {
	color: "#373737",
	anchor = document.body,
	overwrite = 1
}
var foo = new direction(input, config);
```
* input - *OPTIONAL* - an array of image sources or a string of image sources seperated by spaces.
* config - *OPTIONAL* - Unless you supply a formatted object, direction will use default settings. To customize these settings without a formatted object, supply this configuration object.
  * overwrite* - {number} Integer ID of starting page. [1].
  * anchor* - {HTMLElement} HTMLElement to append the carousel to**. [document.body]
  * dir - {string} The directory containing the images.
  * imgprebuffer - {number} The # of images to preload that precede the displayed image. [5]
  * imgpostbuffer - {number} The # of images to preload that follow the displayed image. [5]
  * back - {string} Hexstring for the display canvas's color. ["#373737"]
  * hideSpin* - {boolean} Remove the spinner from the page temporarily. [false]
  * disableSpin* - {boolean} Deactivate the spinner forever. [false]
  * lines - {number} The # of lines for the spinner. [16]
  * rate - {number} Speed of spinner relative to refresh rate. [1000/30]
  * diameter - {number} The diameter of the spinner. [250]
  * loaderback - {string} Hexstring for the spinner background's color. ["#FFF"]
  * color - {string} Hexstring for the spinner's color. ["#FFF"]

_*Not supported by swap_

_**Because it attaches to an element in the DOM, please make sure that the DOM is loaded/ready before you call direction(). If you don't , you will immediately get a "[cannot call method 'appendChild' of null]" error._
****

Now at this point, you'd probably be wondering why it isn't doing anything. All the other carousels, you've tried moved around fancily flipping through images and stuff. You might even be prompted to ask, "Ogewan, why isn't it doing anything?". And to that I answer, that's what it's supposed to do.

This carousel is pretty **barebones**. If you want it to do something, you'll probably have to write a little script to do it for you. But fear not, it's easy peasy, in theory.

Example: 
``` js 
window.setInterval(foo.next,1000);//Auto scrolls through Webcomic from first to last page
```

## API

`go(index)` - go to the slide at index, goes to first slide by default

`frst()` - go to the first slide

`prev()` - go back a slide

`next()` - go forward a slide

`last()` - go to the last slide

`rand()` - go to a random slide

`current()` - gets the current slide

`count()` - gets the total amount of slides

`data(index)` - gets information about the slide at index, such as name and url, defaults to current page.

`scroll()` - gets/sets the status of the auto scroll. To auto scroll to the top of the page on slide change, set to true. To disable, set it to false. It is true by default

`scrollTo(place, time)` - scroll to place in given time (milliseconds)
* if no arguments are given, it scrolls to the top left (0,0) in default time

* if given a place that is a number, it will assume that place is a vertical coordinate

* place can also be an object with x and y properties corresponding to horizontal and vertical position respectively

* if not given a time, the default duration is 400 milliseconds

* if a negative value is given for place, it scrolls to the opposite position.
  
I.E ```scrollTo({-1, -1});``` will scroll to the bottom right in default time

`swap(input, config, start)` - changes the input array and config options at runtime.
* input - **REQUIRED** - an array of images sources.
* config - configuration settings for direction. The names are abbreviated from the standard configuragtion. 
  * dir
  * irb = imgprebuffer
  * itb = imgpostbuffer
  * bck = back
  * clr = color
  * lne = lines
  * rte = rate
  * dia = diameter
  * lbk = loaderback
* start - starting page number.

`callback(type, function, index, remove)` - gets/sets slide transition callbacks.
* type - ID corresponding to a slide state.
* slides/pages have three states:
  * slidestart (type: -1) - called when at the beginning of a slide transition
  * sliding (type: 0) - called in the middle of a slide transition [Default]
  * slidend (type: 1) - called once a slide transition finishes
* function - Callback function to add. If not given, the coressponding callback list of selected type.
* index - Select a specific callback of selected type at a given index ID.
* remove - If true, remove the callback from the lists of the selected type.
``` js
//Assigns images to various buffers
assign = function() {
  //Activate Loading Spinner
  slidestart();//Called as soon as slide transition has begun
  //Check if image is loaded, if not wait till it loads
  //assign master to image so canvas can draw it, calls preloadMaster
  //preload neighbor images
}
preloadMaster = function() { //loads and draws images to Canvas
  //waits for image to download, if not preloaded
  //clear canvas for new drawing
  sliding();//Called right before drawing, waits til the image is loaded
  //draw image
  //adjust canvas size to fit image
  //Pause Loading Spinner
  //Auto Scroll, if enabled
  slidend();//Called after slide transition finishes
},

```

I.E ```callback(-1, foo, 1);``` will set the second callback of slidestart to foo

## Browser Support
requestAnimationFrame has replaced setTimeout, so this is now the major limiting factor.

See https://caniuse.com/#feat=requestanimationframe/.

## TODO
* ~~Secure variables and methods that don't need to be public, i.e replacing current and count with getter functions.~~
* ~~Scrollto implementation~~
* ~~Efficient spinner, currently spinner is always animated, since it uses setInterval, using requestAnimationFrame alone would cut my userbase so I need the fallback, but the first issue is getting the fallback to work.~~
  * ~~Addendum: setInterval replaced with setTimeout, so now the spinner pauses when a slide is displayed. Granted, requestAnimationFrame should theoretically do better than setTimeout, setTimeout preserves compatibility and only active when no slides are visible, which is when they are loading, so in this case the costs are much greater than the benefits.~~
* Add support for manual sizing and scaling.
* Add video and animated gif support, because this will violate the size constraints of a MicroLib, this functionality will only be present in an alternate file called directionpl.js
* Adding video and animated gif support while keeping min file under 5KB.
* integrate infinite into direction

[comix-ngn]: http://comixngn.js.org/
[Slick]: http://kenwheeler.github.io/slick/
[Google's Closure Compiler]: https://developers.google.com/closure/compiler/
[Swipe]: https://github.com/thebird/swipe
[Bootstrap Carousel]: http://getbootstrap.com/javascript/
[other carousels]: https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=carousels&es_th=1
[cannot call method 'appendChild' of null]: http://stackoverflow.com/questions/8670530/javascript-error-cannot-call-method-appendchild-of-null
