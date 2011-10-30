/**
 * Dots Attack - HTML5 game
 * User: ivanlazarevic
 * Date: 10/29/11
 * Time: 11:33 PM
 */


var settings = {};

settings.levels = {
    0: {
        message: 'they are slow and big',
        size: 100,
        pause: 2000,
        score: 20,
        interval: 3000,
        flood: 50
    },
    1: {
        message: 'oO, faster and smaller',
        size: 70,
        pause: 1500,
        score: 50,
        interval: 2000,
        flood: 40
    },
    2: {
        message: 'now you have to concentrate',
        size: 30,
        pause: 1000,
        score: 100,
        interval: 1500,
        flood: 40
    },
    3: {
        message: 'it seems that you are hard player',
        size: 30,
        pause: 1000,
        score: 150,
        interval: 1000,
        flood: 20
    },
    4: {
        message: 'no way you can handle this',
        size: 20,
        pause: 1000,
        score: 2000,
        interval: 500,
        flood: 10
    }
};


/**
 * Dots manager
 */
var dots = {};


/**
 * One dot method
 */
var dot = function(){};

dot.prototype.maxSize =  50;
dot.prototype.currSize = 0;
dot.prototype.elem = {};
dot.prototype.status = 1;

/**
 * create one dot
 */
dot.prototype.create = function(){

    var elem = document.createElement('div');
    elem.style.top = Math.random() * (window.innerHeight - flood.size - 50)+ 'px';
    elem.style.left = Math.random() * window.innerWidth - this.maxSize + 'px';
    elem.className = "dot";
    this.elem = elem;
    this.maxSize = settings.levels[game.level].size;
    document.getElementsByTagName('body')[0].appendChild(elem);
    this.appear(elem);
    this.attachClick();
};
/**
 * attach click event
 */
dot.prototype.attachClick = function(){
    var that = this;
    this.elem.addEventListener('click', function(){
        that.kill(true);
    } );
};
/**
 * what happen on kill
 */
dot.prototype.kill = function(kill){
    document.getElementsByTagName('body')[0].removeChild(this.elem);
    this.status = 0;
    if(kill){
        dashboard.updateScore();
    }
};
/**
 * Animated appearance
 */
dot.prototype.appear = function(){
    var that = this;

    var t = setInterval( function(){
        if(that.status == 0){
            clearInterval(t);
        }
        that.elem.style.width = that.elem.style.height =  that.currSize + 'px';
        that.currSize += 5;
        if(that.currSize > that.maxSize){
            setTimeout( function(){
                that.drop();
            }, settings.levels[game.level].pause);
            clearInterval(t);
        }
    }, 50);

};
/**
 * When dot get full size we will drop it down to flood bar
 */
dot.prototype.drop = function(){
    var that = this;
    var t = setInterval( function(){
        if(that.status == 0){
            clearInterval(t);
        }
        var top = parseInt(that.elem.style.top);
        var left = parseInt(that.elem.style.left);

        that.elem.style.top = top + 10 + 'px';
        that.elem.style.left = left + -10+(Math.random()*(20))  + 'px';

        if (top > window.innerHeight - flood.size - that.maxSize){
            flood.size += settings.levels[game.level].flood;
            flood.level();
            clearInterval(t);
            that.kill(false);
        }

    }, 30);
};


/**
 * Flood bar
 */
var flood = {};
flood.size = 20;
flood.level = function(){
    document.getElementById('flood').style.height = this.size + 'px';
    if(this.size > window.innerHeight - 50){
       clearInterval(game.t);
       document.getElementById('message').innerHTML = "GAME OVER";
       document.getElementById('message').style.display = "block";
    }
};

/**
 * Dashboard
 */
var dashboard = {};
dashboard.score = 0;
dashboard.updateScore = function(){
    this.score += 10;
    document.getElementById('score').innerHTML = this.score;
    if(settings.levels[game.level].score < this.score && game.level <= 5 ){
        game.level++;
        game.interval();
    }
};

/**
 * Game init
 */
var game = {};
game.t = {};
game.level = 0;
game.init = function(){
    flood.level();
    this.interval();
};

game.interval = function(){
    
    var sets = settings.levels[game.level];
    var message = document.getElementById('message');
    message.innerHTML = sets.message;
    message.style.display = 'block';
    setTimeout(function(){
        message.style.display = 'none';
    }, sets.interval + 500);

    if(flood.size > 50){
        flood.size -= 50;
        flood.level();
    }

    clearInterval(this.t);
    this.t = setInterval( function(){
        var x = new dot();
        x.create();
    }, sets.interval);
};


game.init();

