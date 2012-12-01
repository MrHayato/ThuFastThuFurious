///<reference path="../definitions/jaws.d.ts" />
///<reference path="Player.ts" />
///<reference path="AssetLoader.ts" />
///<reference path="../Constants.ts" />

interface LayerDefinition
{
    image?: string;
    animation?: jaws.AnimationOptions;
    damping: number;
}

interface BackgroundDefinition
{
    repeatX: bool;
    repeatY: bool;
    layers: LayerDefinition[];
}

interface MapDefinition
{
    name: string;
    width: number;
    height: number;
    background: BackgroundDefinition;
    assets: string[];
}

class Map
{
    _player: Player;
    _viewport: jaws.Viewport;
    _background: jaws.Parallax;
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
        
        var self = this;
        AssetLoader.preload(mapDef.assets, function ()
        {
            AssetLoader.load(AssetLoader.Types.Player, "thu", function (player)
            {
                self._player = player;
                self._loaded = true;
                self.init(mapDef);
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
        }
    }

    update()
    {
        if (!this._loaded) return;

        //Update background animations
        for (var i = 0; i < this._animatedBackgrounds.length; i++)
        {
            var anim = this._animatedBackgrounds[i];
            var bgLayer = this._background.layers[anim.bgIndex];
            bgLayer.setImage(anim.animation.next());
        }
        
        this._viewport.centerAround(this._player);
        this._player.update();
    }

    draw()
    {
        if (!this._loaded) return;

        if (jaws.pressed(Keys.LEFT)) this._background.camera_x += -20;
        if (jaws.pressed(Keys.RIGHT)) this._background.camera_x += 20;
        this._background.draw();
        this._viewport.draw(this._player);
    }
}