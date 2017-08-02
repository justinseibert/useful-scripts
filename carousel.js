var Carousel = function(args){
  var C = this || {};
  C.arg = args;
  C.def = {
    /**
    * The id of the element containing the carousel slides
    * @param {string} id
    * @default #Carousel
    */
    id : (C.arg.id == undefined) ? 'Carousel' : C.arg.id,

    /**
    * The number of the slide to show first
    * @param {number} current - ordered as in DOM, count from 1
    * @default 0 - first slide
    */
    current : (C.arg.current == undefined) ? 0 : C.arg.current-1,
    count : 0,
    ratio : (C.arg.ratio == undefined) ? -1 : C.arg.ratio,
    width : (C.arg.width == undefined) ? 0 : C.arg.width,
    height : (C.arg.height == undefined) ? 0 : C.arg.height,
    elements : {
      container: 0,
      slides : 0,
      left : 0,
      right : 0,
      buttons : 0,
    },
    slides : [],
    buttons: [],
  },
  C.init = function(){
    var elem = C.def.elements;
    for (var i in elem){
      if (i == 'container'){
        elem.container = document.getElementById(C.def.id);
        elem.container.className = 'carousel-container';
        C.def.count = elem.container.children.length;
      } else {
        elem[i] = document.createElement('div');
        elem[i].className = 'carousel-'+i;
      }
    }
    var i = 0;
    while (elem.container.firstChild){
      var slide = elem.container.firstChild;
      if (C.def.ratio == -1 && slide.nodeType == 1){
        console.log(slide.clientWidth, slide.clientHeight);
        C.def.ratio = slide.clientWidth/slide.clientHeight;
      }
      elem.slides.appendChild(slide);
      if (slide.nodeType == 1){
        this.def.slides.push(slide);
        var button = document.createElement('div')
        button.className = 'carousel-button';
        button.setAttribute('style', 'width:'+(100-C.def.count+1)/C.def.count+'%');
        button.order = i;
        button.addEventListener('click', C.capture);
        C.def.buttons.push(button);
        elem.buttons.id = C.def.id+'-buttons'
        elem.buttons.appendChild(button);
        i++;
      }
    }
    elem.container.appendChild(elem.slides);
    elem.left.order = 'left';
    elem.left.addEventListener('click', C.capture);
    elem.container.appendChild(elem.left);
    elem.right.order = 'right';
    elem.right.addEventListener('click', C.capture);
    elem.container.appendChild(elem.right);
    elem.container.parentNode.insertBefore(elem.buttons, elem.container.nextSibling);
    C.resize();
  },
  /**
  * Not automatic
  * Set up event listener for window resize events
  * @see useful-scripts/listener.js
  */
  C.resize = function(){
    var width = C.def.elements.container.clientWidth;
    var height = width/C.def.ratio;

    C.def.elements.container.setAttribute('style', 'height:'+height+'px');
    for (var i = 0; i < C.def.count; i++){
      C.def.slides[i].setAttribute('style', 'width:'+width+'px;height:'+height+'px;left:'+width*i+'px;');
    }
    C.def.width = width;
    C.shift(C.def.current);
  }
  C.capture = function(evt){
    C.shift(evt.target.order);
  },
  C.shift = function(shift){
    if (shift >= 0 && shift < C.def.count){
      var amount = shift * C.def.width;
      C.def.elements.slides.setAttribute('style','left:'+(0-amount)+'px;');
      for (var i in C.def.buttons){
        C.def.buttons[i].className = 'carousel-button';
        if (i == shift){
          C.def.buttons[i].className = 'carousel-button selected';
        }
      }
      C.def.current = shift;
    } else if (shift <= 0){
      C.shift(C.def.count-1);
    } else if (shift >= C.def.count){
      C.shift(0);
    } else if (shift == 'right'){
      C.shift(C.def.current+1);
    } else if (shift == 'left'){
      C.shift(C.def.current-1);
    }
  },
  /**
  * Not in use, may use it to create infinite looping of slides
  */
  C.place = function(request,direction){
    var left,right;
    var center = C.def.slides[request];
    if (request == 0){
      left = C.def.slides[C.def.count-1];
      right = C.def.slides[1];
    } else if (request == C.def.count-1){
      left = C.def.slides[request-1];
      right = C.def.slides[0];
    } else {
      left = C.def.slides[request-1];
      right = C.def.slides[request+1];
    }
    left.setAttribute('style','left:'+(C.def.width*-2)+'px');
    center.setAttribute('style','left:0px;z-index:10');
    right.setAttribute('style','left:'+C.def.width+'px');
  },
  C.init();
};
Carousel.prototype.define = function(arg,def){
  return (this.arg[arg] == undefined) ? def : this.arg[arg];
}
