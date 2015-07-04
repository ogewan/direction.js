# direction.js
MicroLib Canvas Carousel built for [comix-ngn] as smaller, canvas only alternative to [Swipe], [Slack], [Bootstrap Carousel], and [other carousels].

***Since its Canvas only, it doesn't require any CSS***
##Usage
* You can set the constructor to any dang var you want, by default it is "direction". Simply use new "direction"(input, anchor) to create the carousel.

``` js
var input = ["0.png","1.png","2.png","3.png"];
var anchor = document.body;
var foo = new direction(input,anchor);
```
  * input - **REQUIRED** - can either be a single image source, an array of image sources, or a correctly formatted object.*
  * anchor - *OPTIONAL* - an HTMLelement to append the carousel to. By default it will attach to the body.**

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

`.current` - gives the current slide, **PLEASE DON'T MODIFY IT**

`.count` - gives the total amount of slides, **PLEASE DON'T MODIFY IT**

## Browser Support
Although I haven't tested it in anything but my browser, cause I'm bad at programming :P, It requires **requires** canvas so...
[![Modern Browsers][2]][1]
is a good guide

## TODO
* Secure variables and methods that don't need to be public, i.e replacing current and count with getter functions.
* Scrollto implementation

_*I say direction can take an object as an argument, but __DO NOT USE AN OBJECT__. I only included the object parameter for completeness. Unlike the string and array of strings, the object is assumed to be correct, but only works correctly for the formatted JSON objects in [comix-ngn]. Unless your object is formatted exactly the same, it will break the function._

_**Because it attaches to an element in the DOM, please make sure that the DOM is loaded/ready before you call direction(). If you don't it will immediately hit a "[cannot call method 'appendChild' of null]" error._


[comix-ngn]: http://comixngn.js.org/
[Swipe]: http://kenwheeler.github.io/slick/
[Slack]: https://github.com/thebird/swipe
[Bootstrap Carousel]: http://getbootstrap.com/javascript/
[other carousels]: https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=carousels&es_th=1
[cannot call method 'appendChild' of null]: http://stackoverflow.com/questions/8670530/javascript-error-cannot-call-method-appendchild-of-null
[1]: http://caniuse.com/#feat=canvas
[2]: http://i.snag.gy/TG0rl.jpg
