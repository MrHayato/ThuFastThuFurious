///<reference path="IEntity.ts" />
///<reference path="../definitions/jaws.d.ts" />

interface IPlayerEntity extends IEntity
{
    hp: number;
    isDead: bool;
    isRunning: bool;
    isAttacking: bool;
    godMode: bool;
    animations: PlayerAnimations;
    
    takeDamage(attackInfo: IAttackInfo);
}