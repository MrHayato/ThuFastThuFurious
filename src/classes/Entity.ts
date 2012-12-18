///<reference path="../definitions/jaws.d.ts" />
///<reference path="AssetLoader.ts" />
///<reference path="../Constants.ts" />

interface EntityDefinition
{
    name: string;
    damage: number;
    sprite: string;
    assets: string[];
}

class Entity extends jaws.Sprite implements IEntity
{
    damage: number;
    vx: number;
    vy: number;
    vz: number;

    _loaded: bool = false;

    constructor (entityDef: EntityDefinition)
    {
        super({ anchor: "center" });

        var self = this;

        AssetLoader.preload(entityDef.assets, function () { 
            self._loaded = true;
            self.init(entityDef); 
        });
    }

    init(entityDef: EntityDefinition)
    {
        this.damage = entityDef.damage;
        this.setImage(AssetLoader.parseAsset(entityDef.sprite, entityDef.assets));
    }

    update()
    {
        if (!this._loaded) return;
    }
}