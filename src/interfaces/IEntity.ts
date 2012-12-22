///<reference path="../definitions/jaws.d.ts" />
///<reference path="../interfaces/IAttackInfo.ts" />

interface IEntity
{
    vx: number;
    vy: number;
    isInAir: bool;

    update();
    takeDamage(attackInfo: IAttackInfo);
    getDepth();
}
