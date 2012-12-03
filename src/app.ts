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

        setup()
        {
            this.width = Constants.VIEWPORT_WIDTH;
            this.height = Constants.VIEWPORT_HEIGHT;
            this.fps = document.getElementById("fps");

            jaws.preventDefaultKeys(["up", "down", "left", "right", "space"]);
        }

        update()
        {
            this.map.update();
        }

        draw()
        {
            this.fps.innerHTML = jaws.game_loop.fps.toString();
            jaws.clear();
            this.map.draw();
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