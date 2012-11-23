var Keys;
(function (Keys) {
    Keys.LEFT = "left";
    Keys.RIGHT = "right";
    Keys.UP = "up";
    Keys.DOWN = "down";
})(Keys || (Keys = {}));

var Constants;
(function (Constants) {
    Constants.VIEWPORT_WIDTH = 900;
    Constants.VIEWPORT_HEIGHT = 500;
})(Constants || (Constants = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Thu = (function (_super) {
    __extends(Thu, _super);
    function Thu() {
        var anim = new jaws.Animation({
            sprite_sheet: "/assets/sprites/droid_11x15.png",
            frame_size: [
                11, 
                15
            ],
            frame_duration: 100
        });
        this.animIdle = anim.slice(0, 5);
        this.animMove = anim.slice(6, 8);
        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
        _super.call(this, {
    anchor: "center",
    scale: 2,
    x: 0,
    y: 0
});
    }
    Thu.prototype.takeDamage = function (amount) {
        this.hp -= amount;
    };
    Thu.prototype.update = function () {
        this.vx = 0;
        this.vy = 0;
        if(jaws.pressed(Keys.LEFT)) {
            this.vx = -2;
        }
        if(jaws.pressed(Keys.RIGHT)) {
            this.vx = 2;
        }
        if(jaws.pressed(Keys.UP)) {
            this.vy = -2;
        }
        if(jaws.pressed(Keys.DOWN)) {
            this.vy = 2;
        }
        if(this.vx === 0 && this.vy === 0) {
            this.setImage(this.animIdle.next());
        } else {
            this.flipped = this.vx > 0;
            this.move(this.vx, this.vy);
            this.setImage(this.animMove.next());
        }
    };
    return Thu;
})(jaws.Sprite);
var TFTF;
(function (TFTF) {
    var ExampleState = (function () {
        function ExampleState() { }
        ExampleState.prototype.setup = function () {
            this.width = Constants.VIEWPORT_WIDTH;
            this.height = Constants.VIEWPORT_HEIGHT;
            this.fps = document.getElementById("fps");
            this.player = new Thu();
            this.sky = new jaws.Animation({
                sprite_sheet: "/assets/backgrounds/nightsky.png",
                frame_size: [
                    1024, 
                    512
                ],
                frame_duration: 100
            });
            this.background = new jaws.Parallax({
                repeat_x: true,
                repeat_y: false
            });
            this.background.addLayer({
                image: "/assets/backgrounds/nightsky.png",
                damping: 50
            });
            this.viewport = new jaws.Viewport({
                max_x: this.width * 32,
                max_y: this.height * 32,
                width: this.width,
                height: this.height
            });
            jaws.preventDefaultKeys([
                "up", 
                "down", 
                "left", 
                "right", 
                "space"
            ]);
        };
        ExampleState.prototype.update = function () {
            this.player.update();
            this.background.layers[0].setImage(this.sky.next());
            this.viewport.centerAround(this.player);
            this.fps.innerHTML = jaws.game_loop.fps + ". player: " + this.player.x + "/" + this.player.y;
        };
        ExampleState.prototype.draw = function () {
            jaws.clear();
            if(jaws.pressed(Keys.LEFT)) {
                this.background.camera_x += -20;
            }
            if(jaws.pressed(Keys.RIGHT)) {
                this.background.camera_x += 20;
            }
            this.background.draw();
            this.viewport.draw(this.player);
        };
        return ExampleState;
    })();    
    jaws.onload = function () {
        jaws.assets.add([
            "/assets/sprites/droid_11x15.png", 
            "/assets/sprites/block.bmp", 
            "/assets/sprites/grass.png", 
            "/assets/backgrounds/nightsky.png"
        ]);
        jaws.start(new ExampleState());
    };
})(TFTF || (TFTF = {}));

