///<reference path="IEntity.ts" />
///<reference path="../definitions/jaws.d.ts" />

interface IPlayerEntity extends IEntity
{
    hp: number;
    isDead: bool;
    isRunning: bool;
    godMode: bool;
    animations: PlayerAnimations;
    
    takeDamage(amount: number);
}