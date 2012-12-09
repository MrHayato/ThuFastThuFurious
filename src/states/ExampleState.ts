///<reference path="../definitions/jaws.d.ts" />
///<reference path="../Constants.ts" />
///<reference path="../classes/Map.ts" />

module States
{
    export class ExampleState implements jaws.GameState
    {
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
            jaws.clear();
            this.fps.innerHTML = jaws.game_loop.fps.toString();
            this.map.draw();
        }
    }
}