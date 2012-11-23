///<reference path="IEntity.ts" />
///<reference path="../definitions/jaws.d.ts" />

interface IPlayerEntity extends IEntity
{
    hp: number;
    isDead: bool;
    godMode: bool;
    animMove: jaws.Animation;
    
    takeDamage(amount: number);
}