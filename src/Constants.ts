///<reference path="definitions/jquery-1.8.d.ts" />

module Keys
{
    export var LEFT: string = "left";
    export var RIGHT: string = "right";
    export var UP: string = "up";
    export var DOWN: string = "down";
    export var SHIFT: string = "shift";
    export var Z: string = "z";
    export var X: string = "x";
    export var C: string = "c";
    export var S: string = "s";
}

module Constants
{
    //game
    export var VIEWPORT_WIDTH = 900;
    export var VIEWPORT_HEIGHT = 500;

    //entities
    export var FRICTION = 0.85;
    export var GRAVITY = 0.7;

    //player
    export var PLAYER_JUMP_HEIGHT = 10;
    export var PLAYER_WALK_SPEED_X = 2;
    export var PLAYER_WALK_SPEED_Y = 1.25;
    export var PLAYER_RUN_MULTIPLIER = 2.25;
    export var PLAYER_RUNNING_JUMP_MULTIPLIER = 1.25;
    export var PLAYER_LANDING_DELAY = 125;

}