var Scribble = function(){
  var s = this || {};
  var def = {
    id: 'canvas',
    canvas: 0,
    alert: 0,
    alerts: {
      error: 0,
      undo: 0,
      redo: 0
    },
    line: 5,
    color: '#000',
  }
  s.data = {
    raw: [],
    cache: [],
    context: [],
    latest: function(){
      return this.cache[this.cache.length-1];
    }
  };
  var ctx;
  var geom = new Geometry();
  s.init = function(){
    def.canvas = document.getElementById(def.id);
    def.canvas.width = def.canvas.clientWidth;
    def.canvas.height = def.canvas.clientHeight;
    ctx = def.canvas.getContext('2d');

    def.alert = document.createElement('div');
    def.alert.className = 'scribble-alert';
    def.alert.setAttribute('style','z-index:-100');
    for (var each in def.alerts){
      console.log(each);
      def.alerts[each] = document.createElement('div');
      def.alerts[each].className = 'scribble-alert-'+each;
      def.alerts[each].setAttribute('style','opacity:0;z-index:-100');
      def.alert.append(def.alerts[each]);
    }
    def.canvas.parentNode.insertBefore(def.alert, def.canvas);

    def.canvas.addEventListener('mousedown', ready);
    window.addEventListener('mouseup', waiting);
    window.addEventListener('keydown', keyboard);
  }

  var ready = function(e){
    s.data.cache.push([]);
    drawing(e);
    def.canvas.addEventListener('mousemove', drawing);
  }

  var drawing = function(e){
    var cache = s.data.latest();
    var point = {
      x: e.clientX,
      y: e.clientY
    }
    var segment = [point,point];
    if (cache.length > 0){
      segment[0] = cache[cache.length-1];
      cache.push(point);
    } else {
      cache.push(point,point);
    }
    render(segment,def.color,def.line);
  }

  var waiting = function(e){
    process.linear();
    s.data.raw.push(s.data.latest());
    reset.cache();
    def.canvas.removeEventListener('mousemove', drawing);
  }

  var keyboard = function(e){
    var ctrl = e.ctrlKey;
    if (ctrl){
      switch (e.key){
        case 'z':
          s.undo();
          break;
        case 'y':
          s.redo();
          break;
      }
    }
  }

  /**
  * Render drawing to canvas
  * @param {array} data - slice of point data from data in form [{x,y},{x,y}...]
  * @param {string} color - canvas color value (RGB,HEX)
  * @param {number} stroke - thickness of the line
  */
  var render = function(data,color,stroke){
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    var radius = stroke/2 - 0.25;
    var dot = 2*Math.PI;
    var i = 0;
    while(i < data.length-1){
      ctx.beginPath();
      ctx.moveTo(data[i].x, data[i].y);
      ctx.lineTo(data[i+1].x, data[i+1].y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(data[i+1].x, data[i+1].y, radius, 0, dot, false);
      ctx.fill();
      i++;
    }
  }
  var rerender = function(){
    for (var i in s.data.raw){
      render(s.data.raw[i],def.color,def.line);
    }
  }
  var process = {
    linear: function(){
      var i = 0;
      var j = i+1;
      var cache = s.data.latest();
      s.data.cache.push([cache[0]]);
      var data = s.data.latest();
      var direction = 0;

      while(i < cache.length-2){
        var dir = geom.direction(cache[i], cache[j]);
        if (direction != dir.compass){
          render([cache[j],cache[j]],'#FA0',10);
          data.push(cache[j]);
          direction = dir.compass;
        } else {
          var k = 0;
        }
        i++;
        j = i+1;
      }

      data.push(cache[cache.length-1]);
      render(data,'#0FA',2);
      reset.cache();
    }
  }

  s.alertTimer;
  s.alert = function(type){
    def.alert.setAttribute('style','z-index:100');
    def.alerts[type].setAttribute('style','transform:scale(1) translate(-50%, -50%);opacity:0');
    def.alerts[type].setAttribute('style','transform:scale(2) translate(-50%, -50%);opacity:1');
    window.clearTimeout(s.alertTimer);
    s.alertTimer = window.setTimeout(function(){
      def.alerts[type].setAttribute('style','opacity:0');
      def.alert.setAttribute('style','z-index:-100');
    }, 200);
  }
  s.undo = function(){
    var undo = s.data.raw.length-1;
    if (undo > -1){
      var latest = s.data.raw[undo];
      s.data.cache.push(latest);
      s.data.raw.pop();
      reset.canvas();
      s.alert('undo');
      rerender();
    } else {
      s.alert('error');
    }
  }
  s.redo = function(){
    var redo = s.data.cache.length-1;
    if (redo > -1){
      var latest = s.data.cache[redo];
      s.data.raw.push(latest);
      reset.cache();
      s.alert('redo');
      render(latest,def.color,def.line);
    } else {
      s.alert('error');
    }
  }
  var reset = {
    canvas: function(){
      ctx.clearRect(0,0,def.canvas.width,def.canvas.height);
    },
    cache: function(){
      s.data.cache.pop();
    }
  }
}
