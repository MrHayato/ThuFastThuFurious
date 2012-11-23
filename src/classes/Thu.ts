///<reference path="../definitions/jaws.d.ts" />
///<reference path="../interfaces/IPlayerEntity.ts" />
///<reference path="Constants.ts" />
///<reference path="MathHelpers.ts" />

class Thu extends jaws.Sprite implements IPlayerEntity
{
    hp: number;
    isDead: bool;
    isRunning: bool;
    godMode: bool;
    vx: number;
    vy: number;
    animIdle: jaws.Animation;
    animMove: jaws.Animation;
    animRun: jaws.Animation;

    constructor ()
    {
        var anim = new jaws.Animation({ sprite_sheet: "/assets/sprites/chrono.png", frame_size: [32, 34], frame_duration: 100 });
        this.animIdle = anim.slice(7, 9);
        this.animMove = anim.slice(0, 6);
        this.animRun = anim.slice(10, 13);
        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
        super({ anchor: "center", scale: 2, x: 0, y: 400 });
    }

    takeDamage (amount: number) 
    {
        this.hp -= amount;
    }

    update()
    {
        this.vx = 0;
        this.vy = 0;
        if (jaws.pressed(Keys.LEFT)) this.vx = -2;
        if (jaws.pressed(Keys.RIGHT)) this.vx = 2;
        if (jaws.pressed(Keys.UP)) this.vy = -2;
        if (jaws.pressed(Keys.DOWN)) this.vy = 2;
        this.isRunning = jaws.pressed(Keys.SHIFT);

        if (this.vx === 0 && this.vy === 0)
        {
            this.setImage(this.animIdle.next());
        }
        else
        {
            this.flipped = this.vx > 0;

            if (this.isRunning)
            {
                this.move(this.vx * 2, this.vy * 2);
                this.setImage(this.animRun.next());
            } 
            else
            {
                this.move(this.vx, this.vy);
                this.setImage(this.animMove.next());
            }
        }

        //This needs to moved out and put into map logic
        this.y = MathHelpers.clamp(this.y, 360, Constants.VIEWPORT_HEIGHT - this.rect().height);
    }
}