///<reference path="../definitions/jaws.d.ts" />
///<reference path="../interfaces/IPlayerEntity.ts" />
///<reference path="../Constants.ts" />
///<reference path="MathHelpers.ts" />

interface PlayerAnimationDefinition
{
    idle: number[];
    move: number[];
    run: number[];
}

interface PlayerDefinition
{
    name: string;
    type: string;
    health: number;
    sprite: jaws.Animation;
    animations: PlayerAnimationDefinition;
    assets: string[];
}

class PlayerAnimations
{
    constructor (
        public idle: jaws.Animation,
        public move: jaws.Animation,
        public run: jaws.Animation) { }
}

class Player extends jaws.Sprite implements IPlayerEntity
{
    hp: number;
    isDead: bool;
    isRunning: bool;
    godMode: bool;
    vx: number;
    vy: number;

    _loaded: bool = false;
    animations: PlayerAnimations;

    constructor (playerDef: PlayerDefinition)
    {
        super({ anchor: "center" });

        var self = this;

        AssetLoader.preload(playerDef.assets, function () { 
            self._loaded = true;
            self.init(playerDef); 
        });
    }

    init(playerDef: PlayerDefinition)
    {
        playerDef.sprite.sprite_sheet = AssetLoader.parseAsset(playerDef.sprite.sprite_sheet, playerDef.assets);
        var anim = new jaws.Animation(playerDef.sprite);

        this.animations = new PlayerAnimations(
            anim.slice(playerDef.animations.idle[0], playerDef.animations.idle[1]),
            anim.slice(playerDef.animations.move[0], playerDef.animations.move[1]),
            anim.slice(playerDef.animations.run[0], playerDef.animations.run[1])
        );

        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
    }

    takeDamage (amount: number) 
    {
        this.hp -= amount;
    }

    update()
    {
        if (!this._loaded) return;
        this.vx = 0;
        this.vy = 0;
        if (jaws.pressed(Keys.LEFT)) this.vx = -2;
        if (jaws.pressed(Keys.RIGHT)) this.vx = 2;
        if (jaws.pressed(Keys.UP)) this.vy = -2;
        if (jaws.pressed(Keys.DOWN)) this.vy = 2;
        this.isRunning = jaws.pressed(Keys.SHIFT);

        if (this.vx === 0 && this.vy === 0)
        {
            this.setImage(this.animations.idle.next());
        }
        else
        {
            this.flipped = this.vx > 0;

            if (this.isRunning)
            {
                this.move(this.vx * 2, this.vy * 2);
                this.setImage(this.animations.run.next());
            } 
            else
            {
                this.move(this.vx, this.vy);
                this.setImage(this.animations.move.next());
            }
        }

        //This needs to moved out and put into map logic
        this.y = MathHelpers.clamp(this.y, 360, Constants.VIEWPORT_HEIGHT - this.rect().height);
    }
}