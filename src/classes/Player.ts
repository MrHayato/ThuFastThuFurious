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
    isDead: bool;//Todo: Move to player state
    isRunning: bool;
    isAttacking: bool;
    isInAir: bool;
    godMode: bool;
    vx: number;
    vy: number;

    _loaded: bool = false;
    _animLocked: bool = false;
    _lockedAnimation: PlayerAnimation;
    _lastAttack: IAttackInfo;
    _startingY: number;
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

    attack(animation: PlayerAnimation)
    {
        var self = this;

        this.vx = 0; 
        
        if (!this.isInAir)
            this.vy = 0;

        this.isAttacking = true;
        this.lock(animation, function ()
        {
            self._lastAttack = null;
            self.isAttacking = false;
        });
    }

    jump()
    {
        this.vy = -Constants.PLAYER_JUMP_HEIGHT;
        if (this.isRunning)
        {
            this.vx *= Constants.PLAYER_RUN_MULTIPLIER;
            this.vy *= Constants.PLAYER_RUNNING_JUMP_MULTIPLIER;
        }
        this._startingY = this.y;
        this.isInAir = true;
    }

    lock(animation: PlayerAnimation, unlockCallback?: () => void = null, lockDuration?: number = 0)
    {
        var self = this;
        var onUnlock = function ()
        {
            self._animLocked = false;
            self._lockedAnimation = null;

            if (unlockCallback)
                unlockCallback();
        };

        this._animLocked = true;
        this._lockedAnimation = animation;
        this._lockedAnimation.animation.index = 0;

        if (lockDuration === 0)
            this._lockedAnimation.animation.on_end = onUnlock;
        else
            setTimeout(onUnlock, lockDuration);
    }

    update()
    {
        if (!this._loaded) return;

        if (this._animLocked)
        {
            this.setImage(this._lockedAnimation.animation.next());
            return;
        }

        if (!this.isInAir)
        {
            this.vx = 0;
            this.vy = 0;
            this.isRunning = jaws.pressed(Keys.SHIFT);
            if (jaws.pressed(Keys.LEFT)) this.vx = -Constants.PLAYER_WALK_SPEED_X;
            if (jaws.pressed(Keys.RIGHT)) this.vx = Constants.PLAYER_WALK_SPEED_X;
            if (jaws.pressed(Keys.UP)) this.vy = -Constants.PLAYER_WALK_SPEED_Y;
            if (jaws.pressed(Keys.DOWN)) this.vy = Constants.PLAYER_WALK_SPEED_Y;
            if (jaws.pressed(Keys.Z)) this.attack(this.animations.punch);
            if (jaws.pressed(Keys.X)) this.attack(this.animations.kick);
            if (jaws.pressed(Keys.C)) this.attack(this.animations.uppercut);
            if (jaws.pressed(Keys.S)) this.jump();
        }
        
        if (this.vx === 0 && this.vy === 0 && !this.isInAir)
        {
            this.setImage(this.animations.idle.animation.next());
        }
        else
        {
            if (this.vx < 0) this.flipped = true;
            if (this.vx > 0) this.flipped = false;

            if (this.isInAir)
            {
                if (this.y + this.vy >= this._startingY)
                {
                    this.y = this._startingY;
                    this.vx = 0;
                    this.vy = 0;
                    this.isInAir = false;
                    this.lock(this.animations.crouch, null, Constants.PLAYER_LANDING_DELAY);
                }
                else
                {
                    this.vy = this.vy + Constants.GRAVITY;
                    this.setImage(this.animations.jump.animation.next());
                }
            }
            else if (this.isRunning)
            {
                this.vx *= Constants.PLAYER_RUN_MULTIPLIER;
                this.vy *= Constants.PLAYER_RUN_MULTIPLIER;
                this.setImage(this.animations.run.animation.next());
            }
            else
            {
                this.setImage(this.animations.move.animation.next());
            }

        }

        //This needs to moved out and put into map logic
        if (!this.isInAir)
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