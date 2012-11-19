///<reference path="definitions/jaws.d.ts" />

module TFTF {
    class Roboto extends jaws.Sprite {
        anim_default: jaws.Animation;
        anim_up: jaws.Animation;
        anim_down: jaws.Animation;
        anim_left: jaws.Animation;
        anim_right: jaws.Animation;
    }

    class ExampleState implements jaws.GameState {
        player: Roboto;
        blocks: jaws.SpriteList;
        fps: HTMLElement;
        width: number;
        height: number;
        tileMap: jaws.TileMap;
        viewport: jaws.Viewport;

        /* Called once when a game state is activated. Use it for one-time setup code. */
        setup() {
            this.width = 700;
            this.height = 700;
            this.fps = document.getElementById("fps");
            this.blocks = new jaws.SpriteList();

            for (var i = 0; i < this.width; i++) {
                for (var i2 = 0; i2 < this.height; i2++) {
                    this.blocks.push( new jaws.Sprite({image: "/assets/sprites/grass.png", x: i*32, y: i2*32}) );
                }
            }

            //blocks.push( new Sprite({image: "/assets/sprites/grass.png", x: 0, y: 0}) )
            this.viewport = new jaws.Viewport({max_x: this.width*32, max_y: this.height*32});

            // A tilemap, each cell is 32x32 pixels. There's 10 such cells across and 10 downwards.
            this.tileMap = new jaws.TileMap({size: [this.width, this.height], cell_size: [32,32]});

            // Fit all items in array blocks into correct cells in the tilemap
            // Later on we can look them up really fast (see player.move)
            this.tileMap.push(this.blocks);

            this.player = new Roboto({x:10, y:10, scale: 2, anchor: "center"});

            var anim = new jaws.Animation({sprite_sheet: "/assets/sprites/droid_11x15.png", frame_size: [11,15], frame_duration: 100});
            this.player.anim_default = anim.slice(0,5);
            this.player.anim_up = anim.slice(6,8);
            this.player.anim_down = anim.slice(8,10);
            this.player.anim_left = anim.slice(10,12);
            this.player.anim_right = anim.slice(12,14);

            this.player.setImage( this.player.anim_default.next() );
            jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        }

        /* update() will get called each game tick with your specified FPS. Put game logic here. */
        update() {
            this.player.setImage( this.player.anim_default.next() );
            if(jaws.pressed("left"))  { this.player.move(-2,0);  this.player.setImage(this.player.anim_left.next()) };
            if(jaws.pressed("right")) { this.player.move(2,0);   this.player.setImage(this.player.anim_right.next()) };
            if(jaws.pressed("up"))    { this.player.move(0, -2); this.player.setImage(this.player.anim_up.next()) };
            if(jaws.pressed("down"))  { this.player.move(0, 2);  this.player.setImage(this.player.anim_down.next()) };

            this.viewport.centerAround(this.player);
            this.fps.innerHTML = jaws.game_loop.fps + ". player: " + this.player.x + "/" + this.player.y;
        }

        /* Directly after each update draw() will be called. Put all your on-screen operations here. */
        draw() {
            jaws.clear()
            /* 
            * blocks & tileMap  = ~500.000 sprites 
            */

            // Slow
            // viewport.apply( function() { blocks.draw(); this.player.draw(); });

            // Faster:  checks if sprites are with within viewport before calling draw
            // viewport.draw( blocks )


            // Fastest: Use optimized viewport.drawTileMap() */
            this.viewport.drawTileMap( this.tileMap )
            this.viewport.draw( this.player )
        }
    }

    jaws.onload = function() {
        //jaws.unpack()
        jaws.assets.add(["/assets/sprites/droid_11x15.png","/assets/sprites/block.bmp","/assets/sprites/grass.png"]);
        jaws.start(new ExampleState());  // Our convenience function jaws.start() will load assets, call setup and loop update/draw in 60 FPS
    }
}