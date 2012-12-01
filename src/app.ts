///<reference path="definitions/jaws.d.ts" />
///<reference path="classes/AssetLoader.ts" />
///<reference path="classes/Map.ts" />
///<reference path="Constants.ts" />

module TFTF
{
    class ExampleState implements jaws.GameState
    {
        blocks: jaws.SpriteList;
        fps: HTMLElement;

        width: number;
        height: number;

        map: Map;

        constructor (map: Map)
        {
            this.map = map;
        }

        /* Called once when a game state is activated. Use it for one-time setup code. */
        setup()
        {
            this.width = Constants.VIEWPORT_WIDTH;
            this.height = Constants.VIEWPORT_HEIGHT;
            this.fps = document.getElementById("fps");

            jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        }

        /* update() will get called each game tick with your specified FPS. Put game logic here. */
        update()
        {
//            this.viewport.centerAround(this.player);
            this.map.update();
        }

        /* Directly after each update draw() will be called. Put all your on-screen operations here. */
        draw()
        {
            jaws.clear();
            this.map.draw();
            //if (jaws.pressed(Keys.LEFT)) this.background.camera_x += -20 * (this.player.isRunning ? 2 : 1);
            //if (jaws.pressed(Keys.RIGHT)) this.background.camera_x += 20 * (this.player.isRunning ? 2 : 1);
            //this.background.draw();
            //this.viewport.draw(this.player);
        }
    }

    jaws.onload = function ()
    {
        var onLevelLoad = function (map)
        {
            jaws.start(new ExampleState(map));
        }

        AssetLoader.load(AssetLoader.Types.Map, "level1", onLevelLoad);
    }
}