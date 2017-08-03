var Geometry = function(){
  /**
  * Find angle C between vector lines a and b in triangle (a-b-c)
  * @param {number} a - vector length between point B and C
  * @param {number} b - vector length between point C and A
  * @param {number} c - vector length between point A and B
  */
  this.lawofcosines = function(a,b,c){
    return Math.acos((a*a + b*b - c*c)/(2*a*b));
  },
  /**
  * Find hypotenuse vector c of right triangle (a-b-c)
  * @param {number} a - vector length
  * @param {number} b - vector length
  * @return {number}
  */
  this.hypotenuse = function(a,b){
		return Math.sqrt(a*a + b*b);
	},
  /**
  * Find change in x and y coordinates, respectively between two points a and b
  * @param {object} a - {x,y} coordinates for point a
  * @param {object} b - {x,y} coordinates for point b
  */
	this.delta = function(a,b){
		return {
				'x' : a.x - b.x,
				'y' : a.y - b.y,
		}
	},
  /**
  * Find length of vector between points a and b
  * @param {object} a - {x,y} coordinates for point a
  * @param {object} b - {x,y} coordinates for point b
  * @return {number}
  */
	this.distance = function(a,b){
		var d = this.delta(a,b);
		return this.hypotenuse(d.x,d.y);
  },
  /**
  * Find direction of vector a -> b
  * @param {object} a - {x,y} coordinates for point a
  * @param {object} b - {x,y} coordinates for point b
  * @returns {object} direction - cartesian information about vector
  * @returns {string} direction.compass - geographic direction of vector
  * @returns {number} direction.x - cartesian sign of x direction (+/-1)
  * @returns {number} direction.y - cartesian sign of y direction (+/-1)
  */
  this.direction = function(a,b){
    var compass = '',
        d = this.delta(a,b),
        x = d.x / Math.abs(d.x) || 0,
        y = d.y / Math.abs(d.y) || 0;
    if (y > 0){
      compass += 'north';
    } else if (y < 0) {
      compass += 'south';
    }
    if (x > 0){
      compass += 'west';
      x *= -1;
    } else if (x < 0) {
      compass += 'east';
      x *= -1;
    }
    return {
      'compass' : compass,
      'x'       : x,
      'y'       : y,
    };
  },
  /**
  * Convert point array to vector object
  * @param {array} p - [x,y] coordinates for point p
  */
  this.vector = function(p){
    return {
      x: p[0],
      y: p[1],
    }
  },
  /**
  * Converts radians to degrees
  * @param {number} radian - a radian value to convert
  */
  this.degree = function(radian){
		return radian * (180 / Math.PI);
	},
  /**
  * Converts degrees to radians
  * @param {number} degrees - a degree value to convert
  */
	this.radian = function(degree){
		return degree * (Math.PI / 180);
	}
}
