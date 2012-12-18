///<reference path="../definitions/jaws.d.ts" />
///<reference path="Player.ts" />
///<reference path="Entity.ts" />
///<reference path="AssetLoader.ts" />
///<reference path="../Constants.ts" />

interface LayerDefinition
{
    image?: string;
    animation?: jaws.AnimationOptions;
    damping: number;
    ground: bool;
}

interface BackgroundDefinition
{
    repeatX: bool;
    repeatY: bool;
    layers: LayerDefinition[];
}

interface MapEntity
{
    entity: string;
    x: number;
    y: number;
}

interface MapDefinition
{
    name: string;
    width: number;
    height: number;
    background: BackgroundDefinition;
    entities: MapEntity[];
    assets: string[];
}

class Map
{
    _player: Player;
    _entities: Entity[];
    _viewport: jaws.Viewport;
    _background: jaws.Parallax;
    _groundLayer: jaws.ParallaxLayer;
    _animatedBackgrounds: any[] = [];
    _animatedEntities: jaws.Animation[];
    _loaded: bool = false;

    public name: string;
    public width: number;
    public height: number;

    constructor (mapDef: MapDefinition)
    {
        this.name = mapDef.name;
        this.width = mapDef.width;
        this.height = mapDef.height;
        this._entities = [];
        
        var self = this;
        var numLoaded = 0;
        var numToLoad = mapDef.entities.length + 1;
        
        var onLoad = function() {
            numLoaded++;

            if (numLoaded === numToLoad)
            {
                self._loaded = true;
                self.init(mapDef);
            }
        };

        for (var idx in mapDef.entities)
        {
            (function ()
            {
                var entityDef = mapDef.entities[idx];
                AssetLoader.load(AssetLoader.Types.Entity, entityDef.entity, function (entity)
                {
                    entity.px = entityDef.x;
                    entity.py = entityDef.y;
                    self._entities.push(entity);
                    onLoad();
                });
            })();
        }

        AssetLoader.preload(mapDef.assets, function ()
        {
            AssetLoader.load(AssetLoader.Types.Player, "thu", function (player)
            {
                self._player = player;
                onLoad();
            });
        });
    }

    init(mapDef: MapDefinition)
    {
        this._viewport = new jaws.Viewport({ 
            max_x: this.width,
            max_y: this.height,
            width: Constants.VIEWPORT_WIDTH,
            height: Constants.VIEWPORT_HEIGHT
        });

        this._background = new jaws.Parallax({
            repeat_x: mapDef.background.repeatX,
            repeat_y: mapDef.background.repeatY
        });
        
        for (var i = 0; i < mapDef.background.layers.length; i++)
        {
            var layer = mapDef.background.layers[i];
            var pxLayer: jaws.ParallaxLayerOptions = {
                damping: layer.damping
            };
            
            pxLayer.image = layer.image
                ? AssetLoader.parseAsset(layer.image, mapDef.assets)
                : AssetLoader.parseAsset(layer.animation.sprite_sheet, mapDef.assets);
            
            if (layer.animation)
            {
                layer.animation.sprite_sheet = AssetLoader.parseAsset(layer.animation.sprite_sheet, mapDef.assets);

                var animation = new jaws.Animation(layer.animation);
                this._animatedBackgrounds.push({
                    bgIndex: i,
                    animation: animation
                });
            }

            this._background.addLayer(pxLayer);

            if (layer.ground)
            {
                this._groundLayer = this._background.layers[this._background.layers.length - 1];
            }
        }
    }

    update()
    {
        if (!this._loaded) return;

        //Update player position
        this._player.update();

        //Update background position
        this._viewport.centerAround(this._player);
        this._background.camera_x = this._viewport.x * 10;

        //Update background animations
        for (var i = 0; i < this._animatedBackgrounds.length; i++)
        {
            var anim = this._animatedBackgrounds[i];
            var bgLayer = this._background.layers[anim.bgIndex];
            bgLayer.setImage(anim.animation.next());
        }

        //Update entity position
        for (var i = 0; i < this._entities.length; i++)
        {
            this._entities[i].x = this._entities[i].px - (this._groundLayer.x * 0.5);
            this._entities[i].y = this._entities[i].py;
        }
    }

    draw()
    {
        if (!this._loaded) return;

        //Draw background
        this._background.draw();

        //Draw entities
        for (var i = 0; i < this._entities.length; i++)
        {
            this.drawIfInViewport(this._entities[i]);
        }

        //Draw player
        this._viewport.draw(this._player);
    }

    drawIfInViewport(entity: Entity)
    {
        var rect = entity.rect();
        if (rect.x + rect.width > this._viewport.x && rect.x < this._viewport.x + this._viewport.width &&
            rect.y > 0 && rect.y < this._viewport.height)
            this._viewport.draw(entity);
    }
}