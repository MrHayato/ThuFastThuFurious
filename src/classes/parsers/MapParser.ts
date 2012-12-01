///<reference path="../Map.ts" />

module MapParser
{
    export function parse(assetString: string)
    {
        var mapObj = JSON.parse(assetString);
        return new Map(mapObj);
    }
}