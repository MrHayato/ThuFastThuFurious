///<reference path="../definitions/jquery-1.8.d.ts" />
///<reference path="Entity.ts" />
///<reference path="Player.ts" />

module AssetLoader
{
    export var Types = {
        "Map": "maps",
        "Player": "players",
        "Entity": "entities"
    };

    export function preload(files: string[], callback: () => void)
    {
        var numFilesLoaded = 0;

        function onComplete() {
            numFilesLoaded++;
            if (numFilesLoaded >= files.length)
            {
                callback();
            }
        }

        for (var i = 0; i < files.length; i++)
        {
            jaws.assets.getOrLoad(files[i], onComplete);
        }
    }

    export function load(assetType: string, file: string, callback: (asset: any) => void)
    {
        var onDownload = function (result)
        {
            var asset;

            switch (assetType)
            {
                case Types.Map:
                    asset = new Map(result);
                    break;
                case Types.Player:
                    asset = new Player(result);
                    break;
                case Types.Entity:
                    asset = new Entity(result);
                    break;
            }

            callback(asset);
        };

        getFile(file, assetType, onDownload);
    }

    export function parseAsset(assetTag: string, assets: string[])
    {
        if (assetTag.charAt(0) !== "{") return;
        var num = parseInt(assetTag.match(/{assets:(\d+)}/i)[1]);
        return assets[num];
    }

    function getFile(file: string, type: string, callback: (content: string) => void)
    {
        var content: string = "";

        $.ajax({
            url: "/assets/" + type + "/" + file + ".json",
            dataType: "json",
            success: function (data)
            {
                callback(data);
            }
        });
    }
}