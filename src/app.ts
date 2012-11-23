///<reference path="definitions/jaws.d.ts" />
///<reference path="classes/Thu.ts" />

module TFTF
{
    class ExampleState implements jaws.GameState
    {
        player: Thu;
        blocks: jaws.SpriteList;
        fps: HTMLElement;
        width: number;
        height: number;

        viewport: jaws.Viewport;
        background: jaws.Parallax;
        sky: jaws.Animation;

        /* Called once when a game state is activated. Use it for one-time setup code. */
        setup()
        {
            this.width = Constants.VIEWPORT_WIDTH;
            this.height = Constants.VIEWPORT_HEIGHT;

            this.fps = document.getElementById("fps");

            this.player = new Thu();
            this.sky = new jaws.Animation({ sprite_sheet: "/assets/backgrounds/nightsky.png", frame_size: [1024, 512], frame_duration: 100 });
            this.background = new jaws.Parallax({ repeat_x: true, repeat_y: false });
            this.background.addLayer({ image: "/assets/backgrounds/nightsky.png", damping: 50 });
            this.background.addLayer({ image: "/assets/backgrounds/bg_trees.png", damping: 35 });
            this.background.addLayer({ image: "/assets/backgrounds/foreground.png", damping: 15 });

            this.viewport = new jaws.Viewport({ max_x: this.width * 32, max_y: this.height, width: this.width, height: this.height });

            jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        }

        /* update() will get called each game tick with your specified FPS. Put game logic here. */
        update()
        {
            this.player.update();
            this.background.layers[0].setImage(this.sky.next());
            this.viewport.centerAround(this.player);
            this.fps.innerHTML = jaws.game_loop.fps + ". player: " + this.player.x + "/" + this.player.y;
        }

        /* Directly after each update draw() will be called. Put all your on-screen operations here. */
        draw()
        {
            jaws.clear();
            if (jaws.pressed(Keys.LEFT)) this.background.camera_x += -20;
            if (jaws.pressed(Keys.RIGHT)) this.background.camera_x += 20;
            this.background.draw();
            this.viewport.draw(this.player);
        }
    }

    jaws.onload = function ()
    {
        //jaws.unpack()
        jaws.assets.add([
            "/assets/sprites/chrono.png", "/assets/sprites/block.bmp", "/assets/sprites/grass.png",
            //backgrounds
            "/assets/backgrounds/nightsky.png", "/assets/backgrounds/bg_trees.png", "/assets/backgrounds/foreground.png"
            ]);
        
        jaws.start(new ExampleState());  // Our convenience function jaws.start() will load assets, call setup and loop update/draw in 60 FPS
    }
}