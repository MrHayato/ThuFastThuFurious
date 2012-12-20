///<reference path="../definitions/jaws.d.ts" />
///<reference path="../interfaces/IAttackInfo.ts" />

interface IEntity
{
    vx: number;
    vy: number;

    update();
    takeDamage(attackInfo: IAttackInfo);
}
