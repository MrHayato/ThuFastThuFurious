var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var TFTF;
(function (TFTF) {
    var Roboto = (function (_super) {
        __extends(Roboto, _super);
        function Roboto() {
            _super.apply(this, arguments);

        }
        return Roboto;
    })(jaws.Sprite);    
    var ExampleState = (function () {
        function ExampleState() { }
        ExampleState.prototype.setup = function () {
            this.width = 700;
            this.height = 700;
            this.fps = document.getElementById("fps");
            this.blocks = new jaws.SpriteList();
            for(var i = 0; i < this.width; i++) {
                for(var i2 = 0; i2 < this.height; i2++) {
                    this.blocks.push(new jaws.Sprite({
                        image: "/assets/sprites/grass.png",
                        x: i * 32,
                        y: i2 * 32
                    }));
                }
            }
            this.viewport = new jaws.Viewport({
                max_x: this.width * 32,
                max_y: this.height * 32
            });
            this.tileMap = new jaws.TileMap({
                size: [
                    this.width, 
                    this.height
                ],
                cell_size: [
                    32, 
                    32
                ]
            });
            this.tileMap.push(this.blocks);
            this.player = new Roboto({
                x: 10,
                y: 10,
                scale: 2,
                anchor: "center"
            });
            var anim = new jaws.Animation({
                sprite_sheet: "/assets/sprites/droid_11x15.png",
                frame_size: [
                    11, 
                    15
                ],
                frame_duration: 100
            });
            this.player.anim_default = anim.slice(0, 5);
            this.player.anim_up = anim.slice(6, 8);
            this.player.anim_down = anim.slice(8, 10);
            this.player.anim_left = anim.slice(10, 12);
            this.player.anim_right = anim.slice(12, 14);
            this.player.setImage(this.player.anim_default.next());
            jaws.preventDefaultKeys([
                "up", 
                "down", 
                "left", 
                "right", 
                "space"
            ]);
        };
        ExampleState.prototype.update = function () {
            this.player.setImage(this.player.anim_default.next());
            if(jaws.pressed("left")) {
                this.player.move(-2, 0);
                this.player.setImage(this.player.anim_left.next());
            }
            ; ;
            if(jaws.pressed("right")) {
                this.player.move(2, 0);
                this.player.setImage(this.player.anim_right.next());
            }
            ; ;
            if(jaws.pressed("up")) {
                this.player.move(0, -2);
                this.player.setImage(this.player.anim_up.next());
            }
            ; ;
            if(jaws.pressed("down")) {
                this.player.move(0, 2);
                this.player.setImage(this.player.anim_down.next());
            }
            ; ;
            this.viewport.centerAround(this.player);
            this.fps.innerHTML = jaws.game_loop.fps + ". player: " + this.player.x + "/" + this.player.y;
        };
        ExampleState.prototype.draw = function () {
            jaws.clear();
            this.viewport.drawTileMap(this.tileMap);
            this.viewport.draw(this.player);
        };
        return ExampleState;
    })();    
    jaws.onload = function () {
        jaws.assets.add([
            "/assets/sprites/droid_11x15.png", 
            "/assets/sprites/block.bmp", 
            "/assets/sprites/grass.png"
        ]);
        jaws.start(new ExampleState());
    };
})(TFTF || (TFTF = {}));

