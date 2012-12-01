//  jaws.d.ts
//  (c) 2012 Willson Haw

declare module jaws
{

    /***********\
    * Animation *
    \***********/

    export interface AnimationOptions
    {
        bounce?: bool;
        frame_direction?: number;
        frame_duration?: number;
        frame_size?: number[];
        frames?: any[];
        index?: number;
        loop?: bool;
        offset?: number;
        on_end?: () => any;
        orientation?: string;
        scale_image?: bool;
        sprite_sheet?: any;
    }

    export class Animation
    {
        bounce: bool;
        frame_direction: number;
        frame_duration: number;
        frame_size: number[];
        frames: any[];
        index: number;
        loop: bool;
        offset: number;
        on_end: () => any;
        orientation: string;
        scale_image: bool;
        sprite_sheet: any;

        constructor (options: AnimationOptions);
        atFirstFrame()
            : bool;
        atLastFrame()
            : bool;
        currentFrame()
            : any;
        next()
            : any;
        slice(start: number, stop: number)
            : Animation;
        toString()
            : string;
        update()
            : Animation;
    }

    /********\
    * Assets *
    \********/

    export class Assets
    {
        constructor ();
        add(src: string)
            : Assets;
        add(src: string[])
            : Assets;
        getOrLoad(src: string, onload?: () => void , onerror?: () => void )
            : void;
        getType(src: string)
            : string;
        isLoaded(src: string)
            : bool;
        isLoading(src: string)
            : bool;
        load(src: string, onload: () => void , onerror: () => void )
            : void;
        loadAll(options: any)
            : void;
    }

    /**********\
    * GameLoop *
    \**********/

    export interface GameLoopOptions
    {
        fps?: number;
        tick_duration?: number;
        ticks?: number;
    }

    export class GameLoop
    {
        fps: number;
        tick_duration: number;
        ticks: number;

        constructor (game_object: any, options?: GameLoopOptions, game_state_setup_options?: any);
        loop()
            : void;
        pause()
            : void;
        runtime()
            : void;
        start()
            : void;
        stop()
            : void;
        unpause()
            : void;
    }

    /***********\
    * GameState *
    \***********/

    export interface GameState
    {
        setup? (): void;
        update? (): void;
        draw? (): void;
    }

    /*****\
    * gfx *
    \*****/

    export module gfx
    {
        export function retroScaleImage(image: any, factor: number)
            : HTMLCanvasElement;
    }

    /**********\
    * Parallax *
    \**********/

    export interface ParallaxOptions
    {
        camera_x?: number;
        camera_y?: number;
        repeat_x?: bool;
        repeat_y?: bool;
        scale?: number;
    }

    export class Parallax
    {
        camera_x: number;
        camera_y: number;
        repeat_x: number;
        repeat_y: number;
        scale: number;
        layers: ParallaxLayer[];

        constructor (options: ParallaxOptions);
        addLayer(options: ParallaxLayerOptions)
            : void;
        draw(options?)
            : void;
        toString()
            : string;
    }

    /******\
    * Rect *
    \******/

    export class Rect
    {
        x: number;
        y: number;
        width: number;
        height: number;

        constructor (x: number, y: number, width: number, height: number);
        collidePoint(x: number, y: number)
            : bool;
        collideRect(rect: Rect)
            : bool;
        draw()
            : Rect;
        getPosition()
            : number[];
        move(x: number, y: number)
            : Rect;
        moveTo(x: number, y: number)
            : Rect;
        resize(width: number, height: number)
            : Rect;
        resizeTo(width: number, height: number)
            : Rect;
        toString()
            : string;
    }

    /********\
    * Sprite *
    \********/

    export interface SpriteOptions
    {
        alpha?: number;
        anchor?: string;
        angle?: number;
        flipped?: bool;
        image?: any;
        scale_image?: number;
        scale?: number;
        x?: number;
        y?: number;
    }

    export class Sprite
    {
        alpha: number;
        angle: number;
        flipped: bool;
        image: any;
        scale_image: number;
        scale: number;
        x: number;
        y: number;

        constructor (options: SpriteOptions);
        asCanvas()
            : HTMLCanvasElement;
        asCanvasContext()
            : CanvasRenderingContext2D;
        attributes()
            : SpriteOptions;
        clone()
            : Sprite;
        draw()
            : Sprite;
        flip()
            : Sprite;
        flipTo(value: number)
            : Sprite;
        move(x: number, y: number)
            : Sprite;
        moveTo(x: number, y: number)
            : Sprite;
        rect()
            : Rect;
        resize(width: number, height: number)
            : Sprite;
        resizeTo(width: number, height: number)
            : Sprite;
        rotate(degrees: number)
            : Sprite;
        rotateTo(degrees: number)
            : Sprite;
        scaleHeight(value: number)
            : Sprite;
        scaleImage(value: number)
            : Sprite;
        scaleTo(value: number)
            : Sprite;
        scaleWidth(value: number)
            : Sprite;
        setBottom(value: number)
            : Sprite;
        setHeight(value: number)
            : Sprite;
        setImage(value: any)
            : Sprite;
        setLeft(value: number)
            : Sprite;
        setRight(value: number)
            : Sprite;
        setTop(value: number)
            : Sprite;
        setWidth(value: number)
            : Sprite;
        setX(value: number)
            : Sprite;
        setY(value: number)
            : Sprite;
        toJSON()
            : any;
        toString()
            : string;
    }

    /***************\
    * ParallaxLayer *
    \***************/

    export interface ParallaxLayerOptions extends SpriteOptions
    {
        damping: number;
    }

    export class ParallaxLayer extends Sprite
    {
        damping: number;
        constructor (options: ParallaxLayerOptions);
    }

    /************\
    * SpriteList *
    \************/

    export class SpriteList
    {
        constructor (options?: any);
        at(index: number)
            : Sprite;
        concat(...sprites: Sprite[])
            : Sprite[];
        concat(...sprites: Sprite[][])
            : Sprite[];
        deleteIf(condition: (sprite: Sprite) => bool)
            : void;
        draw()
            : void;
        drawIf(condition: (sprite: Sprite) => bool)
            : void;
        every(callback: (element: Sprite, index?: number, array?: Sprite[]) => bool)
            : bool;
        filter(callback: (element: Sprite, index?: number, array?: Sprite[]) => bool)
            : Sprite[];
        forEach(callback: (element: Sprite, index?: number, array?: Sprite[]) => void )
            : void;
        indexOf(element: Sprite, fromIndex?: number)
            : number;
        isSpriteList()
            : bool;
        join(separator?: string)
            : string;
        lastIndexOf(element: Sprite, fromIndex?: number)
            : number;
        load(objects: Sprite[])
            : void;
        load(objects: any[])
            : void;
        load(objects: string)
            : void;
        map(bacllback: (element: Sprite) => any)
            : any[];
        pop()
            : Sprite;
        push(...sprites: Sprite[])
            : number;
        reduce(callback: (prevValue: Sprite, currValue: Sprite, index?: number, array?: Sprite[]) => any)
            : any;
        reduceRight(callback: (prevValue: Sprite, currValue: Sprite, index?: number, array?: Sprite[]) => any)
            : any;
        remove(obj: Sprite)
            : void;
        removeIf(condition: (sprite: Sprite) => bool)
            : void;
        reverse()
            : void;
        shift()
            : Sprite;
        slice(start: number, end: number)
            : Sprite[];
        some(callback: (element: Sprite, index?: number, array?: Sprite[]) => bool)
            : bool;
        sort(callback: (left: Sprite, right: Sprite) => number)
            : Sprite[];
        splice(index: number, howMany?: number, ...sprites: Sprite[])
            : Sprite[];
        unshift(...sprites: Sprite[])
            : number;
        update()
            : void;
        updateIf(condition: (sprite: Sprite) => bool)
            : void;
        updateLength()
            : void;
        valueOf()
            : string;
    }

    /*************\
    * SpriteSheet *
    \*************/

    export interface SpriteSheetOptions
    {
        frame_size?: number[];
        offset?: number;
        image?: any;
        orientation?: string;
        scale_image: number;
    }

    export class SpriteSheet
    {
        frame_size: number[];
        offset: number;
        image: any;
        orientation: string;
        scale_image: number;

        constructor (options: SpriteSheetOptions);
        frames: HTMLCanvasElement[];
    }

    /*********\
    * TileMap *
    \*********/

    export interface TileMapOptions
    {
        cell_size?: number[];
        size?: number[];
        sortFunction?: (left: Sprite, right: Sprite) => number;
    }

    export class TileMap
    {
        cell_size: number[];
        size: number[];
        sortFunction: (left: Sprite, right: Sprite) => number;

        constructor (options: TileMapOptions);
        all()
            : Sprite[];
        at(x: number, y: number)
            : Sprite[];
        atRect(rect: Rect)
            : Sprite[];
        cell(col: number, row: number)
            : Sprite[];
        clear()
            : void;
        push(obj: Sprite)
            : any;
        push(objs: Sprite[])
            : any;
        push(objs: SpriteList)
            : any;
        pushAsPoint(obj: Sprite)
            : any;
        pushAsRect(obj: Sprite, rect: Rect)
            : any;
        pushToCell(col: number, row: number, obj: Sprite)
            : any;
        sortCells(sortFunction: (left: Sprite, right: Sprite) => number)
            : void;
        toString()
            : string;
    }

    /**********\
    * Viewport *
    \**********/

    export interface ViewportOptions
    {
        height?: number;
        max_x?: number;
        max_y?: number;
        width?: number;
        x?: number;
        y?: number;
    }

    export class Viewport
    {
        height: number;
        max_x: number;
        max_y: number;
        width: number;
        x: number;
        y: number;

        constructor (options: ViewportOptions);
        apply(func: () => void )
            : void;
        centerAround(item: Sprite)
            : void;
        centerAround(item: { x: number; y: number; })
            : void;
        draw(obj: Sprite)
            : void;
        draw(objs: Sprite[])
            : void;
        draw(obj: { draw: () => void; })
            : void;
        drawIfPartlyInside(item: Sprite)
            : void;
        drawTileMap(tileMap: TileMap)
            : void;
        forceInside(item: Sprite, buffer: number)
            : void;
        forceInsideVisibleArea(item: Sprite, buffer: number)
            : void;
        isAbove(item: Sprite)
            : bool;
        isBelow(item: Sprite)
            : bool;
        isInside(item: Sprite)
            : bool;
        isLeftOf(item: Sprite)
            : bool;
        isOutside(item: Sprite)
            : bool;
        isPartlyInside(item: Sprite)
            : bool;
        isRightOf(item: Sprite)
            : bool;
        move(x: number, y: number)
            : void;
        moveTo(x: number, y: number)
            : void;
    }

    /*************\
    * Static Core *
    \*************/

    //Fields
    export var canvas
        : HTMLCanvasElement;
    export var context
        : CanvasRenderingContext2D;
    export var height
        : number;
    export var width
        : number;
    export var mouse_x
        : number;
    export var mouse_y
        : number;
    export var game_loop
        : GameLoop;

    //Methods

    export function clear()
        : void;
    export function collideCircles(object1: Sprite, object2: Sprite)
        : bool;
    export function collideManyWithMany(list1: Sprite[], list2: Sprite[])
        : bool;
    export function collideOneWithMany(object: Sprite, list: Sprite[])
        : bool;
    export function collideOneWithOne(object1: Sprite, object2: Sprite)
        : bool;
    export function collideRects(rect1: Rect, rect2: Rect)
        : bool;
    export function distanceBetween(object1: Sprite, object2: Sprite)
        : number;
    export function forceArray(object: any)
        : any[];
    export function forceArray(object: any[])
        : any[];
    export function forceInsideCanvas(item: Sprite)
        : void;
    export function forceInsideCanvas(item: Rect)
        : void;
    export function getUrlParameters()
        : any;
    export function imageToCanvas(image: HTMLImageElement)
        : HTMLCanvasElement;
    export function isArray(object: any)
        : bool;
    export function isCanvas(object: any)
        : bool;
    export function isDrawable(object: any)
        : bool;
    export function isFunction(object: any)
        : bool;
    export function isImage(object: any)
        : bool;
    export function isOutsideCanvas(item: Sprite)
        : bool;
    export function isOutsideCanvas(item: Rect)
        : bool;
    export function isString(object: any)
        : bool;
    export function log(msg: string, append?: bool)
        : void;
    export function on_keydown(key: string, callback: () => any)
        : void;
    export function on_keydown(key: string[], callback: () => any)
        : void;
    export function on_keyup(key: string, callback: () => any)
        : void;
    export function on_keyup(key: string[], callback: () => any)
        : void;
    export function onload()
        : void;
    export function pressed(key: string)
        : bool;
    export function preventDefaultKeys(keys: string[])
        : void;
    export function start(state: GameState, options?: any, game_state_setup_options?: any)
        : void;
    export function switchGameState(state: GameState, options?: any, game_state_setup_options?: any)
        : void;
    export function unpack()
        : void;

    declare var assets: Assets;
}