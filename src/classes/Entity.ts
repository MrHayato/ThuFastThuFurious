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
    isInAir: bool;
    damage: number;
    vx: number;
    vy: number;

    _loaded: bool = false;
    _animLocked: bool = false;

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
        this.vx = 0;
        this.vy = 0;
    }

    update()
    {
        if (!this._loaded) return;

        this.px += this.vx;
        this.vx *= Constants.FRICTION;

        if (this.vx < 0.05 && this.vx > 0) this.vx = 0;
        if (this.vx > -0.05 && this.vx < 0) this.vx = 0;
        if (this.vy < 0.05) this.vy = 0;

        if (this.vx === 0 && this.vy === 0) this._animLocked = false;
    }

    takeDamage(attackInfo: IAttackInfo)
    {
        if (attackInfo.handled)
            return;

        this.vx = attackInfo.knockback[0];
        attackInfo.handled = true;

        this._animLocked = true;
    }
}