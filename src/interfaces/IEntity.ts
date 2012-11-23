///<reference path="../definitions/jaws.d.ts" />

interface IEntity
{
    vx: number;
    vy: number;

    animIdle: jaws.Animation;
    update();
}
