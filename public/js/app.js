var Keys;
(function (Keys) {
    Keys.LEFT = "left";
    Keys.RIGHT = "right";
    Keys.UP = "up";
    Keys.DOWN = "down";
    Keys.SHIFT = "shift";
})(Keys || (Keys = {}));

var Constants;
(function (Constants) {
    Constants.VIEWPORT_WIDTH = 900;
    Constants.VIEWPORT_HEIGHT = 500;
})(Constants || (Constants = {}));

var MathHelpers;
(function (MathHelpers) {
    function clamp(value, low, high) {
        var ret = value;
        if(ret > high) {
            ret = high;
        }
        if(ret < low) {
            ret = low;
        }
        return ret;
    }
    MathHelpers.clamp = clamp;
})(MathHelpers || (MathHelpers = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var PlayerAnimations = (function () {
    function PlayerAnimations(idle, move, run) {
        this.idle = idle;
        this.move = move;
        this.run = run;
    }
    return PlayerAnimations;
})();
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(playerDef) {
        _super.call(this, {
    anchor: "center"
});
        this._loaded = false;
        var self = this;
        AssetLoader.preload(playerDef.assets, function () {
            self._loaded = true;
            self.init(playerDef);
        });
    }
    Player.prototype.init = function (playerDef) {
        playerDef.sprite.sprite_sheet = AssetLoader.parseAsset(playerDef.sprite.sprite_sheet, playerDef.assets);
        var anim = new jaws.Animation(playerDef.sprite);
        this.animations = new PlayerAnimations(anim.slice(playerDef.animations.idle[0], playerDef.animations.idle[1]), anim.slice(playerDef.animations.move[0], playerDef.animations.move[1]), anim.slice(playerDef.animations.run[0], playerDef.animations.run[1]));
        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
    };
    Player.prototype.takeDamage = function (amount) {
        this.hp -= amount;
    };
    Player.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
        this.vx = 0;
        this.vy = 0;
        if(jaws.pressed(Keys.LEFT)) {
            this.vx = -2;
        }
        if(jaws.pressed(Keys.RIGHT)) {
            this.vx = 2;
        }
        if(jaws.pressed(Keys.UP)) {
            this.vy = -2;
        }
        if(jaws.pressed(Keys.DOWN)) {
            this.vy = 2;
        }
        this.isRunning = jaws.pressed(Keys.SHIFT);
        if(this.vx === 0 && this.vy === 0) {
            this.setImage(this.animations.idle.next());
        } else {
            this.flipped = this.vx > 0;
            if(this.isRunning) {
                this.move(this.vx * 2, this.vy * 2);
                this.setImage(this.animations.run.next());
            } else {
                this.move(this.vx, this.vy);
                this.setImage(this.animations.move.next());
            }
        }
        this.y = MathHelpers.clamp(this.y, 360, Constants.VIEWPORT_HEIGHT - this.rect().height);
    };
    return Player;
})(jaws.Sprite);
var Map = (function () {
    function Map(mapDef) {
        this._animatedBackgrounds = [];
        this._loaded = false;
        this.name = mapDef.name;
        this.width = mapDef.width;
        this.height = mapDef.height;
        var self = this;
        AssetLoader.preload(mapDef.assets, function () {
            AssetLoader.load(AssetLoader.Types.Player, "thu", function (player) {
                self._player = player;
                self._loaded = true;
                self.init(mapDef);
            });
        });
    }
    Map.prototype.init = function (mapDef) {
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
        for(var i = 0; i < mapDef.background.layers.length; i++) {
            var layer = mapDef.background.layers[i];
            var pxLayer = {
                damping: layer.damping
            };
            pxLayer.image = layer.image ? AssetLoader.parseAsset(layer.image, mapDef.assets) : AssetLoader.parseAsset(layer.animation.sprite_sheet, mapDef.assets);
            if(layer.animation) {
                layer.animation.sprite_sheet = AssetLoader.parseAsset(layer.animation.sprite_sheet, mapDef.assets);
                var animation = new jaws.Animation(layer.animation);
                this._animatedBackgrounds.push({
                    bgIndex: i,
                    animation: animation
                });
            }
            this._background.addLayer(pxLayer);
        }
    };
    Map.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
        for(var i = 0; i < this._animatedBackgrounds.length; i++) {
            var anim = this._animatedBackgrounds[i];
            var bgLayer = this._background.layers[anim.bgIndex];
            bgLayer.setImage(anim.animation.next());
        }
        this._viewport.centerAround(this._player);
        this._player.update();
    };
    Map.prototype.draw = function () {
        if(!this._loaded) {
            return;
        }
        if(jaws.pressed(Keys.LEFT)) {
            this._background.camera_x += -20;
        }
        if(jaws.pressed(Keys.RIGHT)) {
            this._background.camera_x += 20;
        }
        this._background.draw();
        this._viewport.draw(this._player);
    };
    return Map;
})();
var MapParser;
(function (MapParser) {
    function parse(assetString) {
        var mapObj = JSON.parse(assetString);
        return new Map(mapObj);
    }
    MapParser.parse = parse;
})(MapParser || (MapParser = {}));

var AssetLoader;
(function (AssetLoader) {
    AssetLoader.Types = {
        "Map": "maps",
        "Player": "players"
    };
    function preload(files, callback) {
        var numFilesLoaded = 0;
        function onComplete() {
            numFilesLoaded++;
            if(numFilesLoaded >= files.length) {
                callback();
            }
        }
        for(var i = 0; i < files.length; i++) {
            jaws.assets.getOrLoad(files[i], onComplete);
        }
    }
    AssetLoader.preload = preload;
    function load(assetType, file, callback) {
        var onDownload = function (result) {
            var asset;
            switch(assetType) {
                case AssetLoader.Types.Map: {
                    asset = new Map(result);
                    break;

                }
                case AssetLoader.Types.Player: {
                    asset = new Player(result);
                    break;

                }
            }
            callback(asset);
        };
        getFile(file, assetType, onDownload);
    }
    AssetLoader.load = load;
    function parseAsset(assetTag, assets) {
        if(assetTag.charAt(0) !== "{") {
            return;
        }
        var num = parseInt(assetTag.match(/{assets:(\d+)}/i)[1]);
        return assets[num];
    }
    AssetLoader.parseAsset = parseAsset;
    function getFile(file, type, callback) {
        var content = "";
        $.ajax({
            url: "/assets/" + type + "/" + file + ".json",
            dataType: "json",
            success: function (data) {
                callback(data);
            }
        });
    }
})(AssetLoader || (AssetLoader = {}));

var TFTF;
(function (TFTF) {
    var ExampleState = (function () {
        function ExampleState(map) {
            this.map = map;
        }
        ExampleState.prototype.setup = function () {
            this.width = Constants.VIEWPORT_WIDTH;
            this.height = Constants.VIEWPORT_HEIGHT;
            this.fps = document.getElementById("fps");
            jaws.preventDefaultKeys([
                "up", 
                "down", 
                "left", 
                "right", 
                "space"
            ]);
        };
        ExampleState.prototype.update = function () {
            this.map.update();
        };
        ExampleState.prototype.draw = function () {
            jaws.clear();
            this.map.draw();
        };
        return ExampleState;
    })();    
    jaws.onload = function () {
        var onLevelLoad = function (map) {
            jaws.start(new ExampleState(map));
        };
        AssetLoader.load(AssetLoader.Types.Map, "level1", onLevelLoad);
    };
})(TFTF || (TFTF = {}));

