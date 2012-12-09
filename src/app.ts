///<reference path="definitions/jaws.d.ts" />
///<reference path="classes/AssetLoader.ts" />
///<reference path="classes/Map.ts" />
///<reference path="states/ExampleState.ts" />

module Game
{
    jaws.onload = function ()
    {
        AssetLoader.load(AssetLoader.Types.Map, "bridge", function (map)
        {
            jaws.start(new States.ExampleState(map));
        });
    }
}