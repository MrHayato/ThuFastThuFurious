///<reference path="../definitions/jaws.d.ts" />
///<reference path="../interfaces/IPlayerEntity.ts" />
///<reference path="Constants.ts" />

class Thu extends jaws.Sprite implements IPlayerEntity
{
    hp: number;
    isDead: bool;
    godMode: bool;
    vx: number;
    vy: number;
    animIdle: jaws.Animation;
    animMove: jaws.Animation;

    constructor ()
    {
        var anim = new jaws.Animation({ sprite_sheet: "/assets/sprites/droid_11x15.png", frame_size: [11, 15], frame_duration: 100 });
        this.animIdle = anim.slice(0, 5);
        this.animMove = anim.slice(6, 8);
        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
        super({ anchor: "center", scale: 2, x: 0, y: 0 });
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

        if (this.vx === 0 && this.vy === 0)
        {
            this.setImage(this.animIdle.next());
        }
        else
        {
            this.flipped = this.vx > 0;
            this.move(this.vx, this.vy);
            this.setImage(this.animMove.next());
        }
    }
}