///<reference path="../definitions/jaws.d.ts" />
///<reference path="../interfaces/IPlayerEntity.ts" />
///<reference path="../interfaces/IAttackInfo.ts" />
///<reference path="../Constants.ts" />
///<reference path="../classes/AssetLoader.ts" />
///<reference path="../helpers/Utilities.ts" />
///<reference path="MathHelpers.ts" />

interface AttackDefinition
{
    box: number[];
    knockback: number[];
    damage: number;
}

interface PlayerAnimation
{
    frames: number[];
    frame_duration?: number;
    loop?: bool;
    attack?: AttackDefinition;
    animation?: jaws.Animation;
}

interface PlayerAnimationDefinition
{
    idle: PlayerAnimation;
    move: PlayerAnimation;
    run: PlayerAnimation;
    jump: PlayerAnimation;
    crouch: PlayerAnimation;
    block: PlayerAnimation;
    punch: PlayerAnimation;
    kick: PlayerAnimation;
    uppercut: PlayerAnimation;
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
    public idle: PlayerAnimation;
    public move: PlayerAnimation;
    public run: PlayerAnimation;
    public jump: PlayerAnimation;
    public crouch: PlayerAnimation;
    public block: PlayerAnimation;
    public punch: PlayerAnimation;
    public kick: PlayerAnimation;
    public uppercut: PlayerAnimation;
}

class Player extends jaws.Sprite implements IPlayerEntity
{
    hp: number;
    isDead: bool;
    isRunning: bool;
    isAttacking: bool;
    godMode: bool;
    vx: number;
    vy: number;

    _loaded: bool = false;
    _animLocked: bool = false;
    _lockedAnimation: PlayerAnimation;
    _lastAttack: IAttackInfo;
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

        this.animations = new PlayerAnimations();
        for (var animationType in playerDef.animations)
        {
            this.animations[animationType] = this.sliceAnimation(anim, playerDef.animations[animationType]);
        }

        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
    }

    sliceAnimation(animation: jaws.Animation, animDef: PlayerAnimation): PlayerAnimation
    {
        animDef.animation = animation.slice(animDef.frames[0], animDef.frames[1]);
        animDef.animation.frame_duration = animDef.frame_duration
            ? animDef.frame_duration
            : animation.frame_duration;
        animDef.animation.loop = animDef.loop !== undefined
            ? animDef.loop
            : true;

        return animDef;
    }

    takeDamage(attackInfo: IAttackInfo)
    {
        this.hp -= attackInfo.damage;
    }

    attack(animation: PlayerAnimation, damage: number)
    {
        var self = this;

        this.vx = this.vy = 0;
        this._animLocked = true;
        this.isAttacking = true;
        this._lockedAnimation = animation;
        this._lockedAnimation.animation.index = 0;
        this._lockedAnimation.animation.on_end = function ()
        {
            self._animLocked = false;
            self._lockedAnimation = null;
            self._lastAttack = null;
            self.isAttacking = false;
        }
    }

    update()
    {
        if (!this._loaded) return;

        if (this._animLocked)
        {
            this.setImage(this._lockedAnimation.animation.next());
            return;
        }

        this.vx = 0;
        this.vy = 0;
        if (jaws.pressed(Keys.LEFT)) this.vx = -2;
        if (jaws.pressed(Keys.RIGHT)) this.vx = 2;
        if (jaws.pressed(Keys.UP)) this.vy = -1;
        if (jaws.pressed(Keys.DOWN)) this.vy = 1;
        if (jaws.pressed(Keys.Z)) this.attack(this.animations.punch, 5);
        if (jaws.pressed(Keys.X)) this.attack(this.animations.kick, 10);
        if (jaws.pressed(Keys.C)) this.attack(this.animations.uppercut, 15);

        this.isRunning = jaws.pressed(Keys.SHIFT);

        if (this.vx === 0 && this.vy === 0)
        {
            this.setImage(this.animations.idle.animation.next());
        }
        else
        {
            if (this.vx < 0) this.flipped = true;
            if (this.vx > 0) this.flipped = false;

            if (this.isRunning)
            {
                this.move(this.vx * 2, this.vy * 2);
                this.setImage(this.animations.run.animation.next());
            }
            else
            {
                this.move(this.vx, this.vy);
                this.setImage(this.animations.move.animation.next());
            }
        }

        //This needs to moved out and put into map logic
        this.y = MathHelpers.clamp(this.y, 360, Constants.VIEWPORT_HEIGHT - this.rect().height);
    }

    getAttackInfo(): IAttackInfo
    {
        if (!this.isAttacking)
        {
            return null;
        }

        if (this._lastAttack)
        {
            return this._lastAttack;
        }

        var kb = this.flipped
            ? [-this._lockedAnimation.attack.knockback[0], this._lockedAnimation.attack.knockback[1]]
            : this._lockedAnimation.attack.knockback;

        var attackInfo: IAttackInfo = {
            damage: this._lockedAnimation.attack.damage,
            knockback: kb,
            hitbox: Utilities.getSubRect(this.rect(), this._lockedAnimation.attack.box, this.flipped),
            handled: false
        };

        this._lastAttack = attackInfo;

        return attackInfo;
    }

    
}