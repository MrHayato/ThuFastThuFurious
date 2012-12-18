var Keys;
(function (Keys) {
    Keys.LEFT = "left";
    Keys.RIGHT = "right";
    Keys.UP = "up";
    Keys.DOWN = "down";
    Keys.SHIFT = "shift";
    Keys.Z = "z";
    Keys.X = "x";
    Keys.C = "c";
})(Keys || (Keys = {}));

var Constants;
(function (Constants) {
    Constants.VIEWPORT_WIDTH = 900;
    Constants.VIEWPORT_HEIGHT = 500;
})(Constants || (Constants = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(entityDef) {
        _super.call(this, {
    anchor: "center"
});
        this._loaded = false;
        var self = this;
        AssetLoader.preload(entityDef.assets, function () {
            self._loaded = true;
            self.init(entityDef);
        });
    }
    Entity.prototype.init = function (entityDef) {
        this.damage = entityDef.damage;
        this.setImage(AssetLoader.parseAsset(entityDef.sprite, entityDef.assets));
    };
    Entity.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
    };
    return Entity;
})(jaws.Sprite);
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

var PlayerAnimations = (function () {
    function PlayerAnimations() { }
    return PlayerAnimations;
})();
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(playerDef) {
        _super.call(this, {
    anchor: "center"
});
        this._loaded = false;
        this._animLocked = false;
        var self = this;
        AssetLoader.preload(playerDef.assets, function () {
            self._loaded = true;
            self.init(playerDef);
        });
    }
    Player.prototype.init = function (playerDef) {
        playerDef.sprite.sprite_sheet = AssetLoader.parseAsset(playerDef.sprite.sprite_sheet, playerDef.assets);
        var anim = new jaws.Animation(playerDef.sprite);
        this.animations = new PlayerAnimations();
        for(var animationType in playerDef.animations) {
            this.animations[animationType] = this.sliceAnimation(anim, playerDef.animations[animationType]);
        }
        this.godMode = false;
        this.vx = 0;
        this.vy = 0;
    };
    Player.prototype.sliceAnimation = function (animation, animDef) {
        var slicedAnim = animation.slice(animDef.frames[0], animDef.frames[1]);
        slicedAnim.frame_duration = animDef.frame_duration ? animDef.frame_duration : animation.frame_duration;
        slicedAnim.loop = animDef.loop !== undefined ? animDef.loop : true;
        return slicedAnim;
    };
    Player.prototype.takeDamage = function (amount) {
        this.hp -= amount;
    };
    Player.prototype.attack = function (animation, damage) {
        var self = this;
        this.vx = this.vy = 0;
        this._animLocked = true;
        this._lockedAnimation = animation;
        this._lockedAnimation.index = 0;
        this._lockedAnimation.on_end = function () {
            self._animLocked = false;
            self._lockedAnimation = null;
        };
    };
    Player.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
        if(this._animLocked) {
            this.setImage(this._lockedAnimation.next());
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
            this.vy = -1;
        }
        if(jaws.pressed(Keys.DOWN)) {
            this.vy = 1;
        }
        if(jaws.pressed(Keys.Z)) {
            this.attack(this.animations.punch, 5);
        }
        if(jaws.pressed(Keys.X)) {
            this.attack(this.animations.kick, 10);
        }
        if(jaws.pressed(Keys.C)) {
            this.attack(this.animations.uppercut, 15);
        }
        this.isRunning = jaws.pressed(Keys.SHIFT);
        if(this.vx === 0 && this.vy === 0) {
            this.setImage(this.animations.idle.next());
        } else {
            if(this.vx < 0) {
                this.flipped = true;
            }
            if(this.vx > 0) {
                this.flipped = false;
            }
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
var AssetLoader;
(function (AssetLoader) {
    AssetLoader.Types = {
        "Map": "maps",
        "Player": "players",
        "Entity": "entities"
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
                case AssetLoader.Types.Entity: {
                    asset = new Entity(result);
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

var Map = (function () {
    function Map(mapDef) {
        this._animatedBackgrounds = [];
        this._loaded = false;
        this.name = mapDef.name;
        this.width = mapDef.width;
        this.height = mapDef.height;
        this._entities = [];
        var self = this;
        var numLoaded = 0;
        var numToLoad = mapDef.entities.length + 1;
        var onLoad = function () {
            numLoaded++;
            if(numLoaded === numToLoad) {
                self._loaded = true;
                self.init(mapDef);
            }
        };
        for(var idx in mapDef.entities) {
            (function () {
                var entityDef = mapDef.entities[idx];
                AssetLoader.load(AssetLoader.Types.Entity, entityDef.entity, function (entity) {
                    entity.px = entityDef.x;
                    entity.py = entityDef.y;
                    self._entities.push(entity);
                    onLoad();
                });
            })();
        }
        AssetLoader.preload(mapDef.assets, function () {
            AssetLoader.load(AssetLoader.Types.Player, "thu", function (player) {
                self._player = player;
                onLoad();
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
            if(layer.ground) {
                this._groundLayer = this._background.layers[this._background.layers.length - 1];
            }
        }
    };
    Map.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
        this._player.update();
        this._viewport.centerAround(this._player);
        this._background.camera_x = this._viewport.x * 10;
        for(var i = 0; i < this._animatedBackgrounds.length; i++) {
            var anim = this._animatedBackgrounds[i];
            var bgLayer = this._background.layers[anim.bgIndex];
            bgLayer.setImage(anim.animation.next());
        }
        for(var i = 0; i < this._entities.length; i++) {
            this._entities[i].x = this._entities[i].px - (this._groundLayer.x * 0.5);
            this._entities[i].y = this._entities[i].py;
        }
    };
    Map.prototype.draw = function () {
        if(!this._loaded) {
            return;
        }
        this._background.draw();
        var entities = [];
        _.each(this._entities, function (entity) {
            entities.push(entity);
        });
        entities.push(this._player);
        entities = _.sortBy(entities, function (entity) {
            return entity.y + (entity.height / 2);
        });
        for(var i = 0; i < entities.length; i++) {
            this.drawIfInViewport(entities[i]);
        }
    };
    Map.prototype.drawIfInViewport = function (entity) {
        var rect = entity.rect();
        if(rect.x + rect.width > this._viewport.x && rect.x < this._viewport.x + this._viewport.width && rect.y > 0 && rect.y < this._viewport.height) {
            this._viewport.draw(entity);
        }
    };
    return Map;
})();
var States;
(function (States) {
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
            this.fps.innerHTML = jaws.game_loop.fps.toString();
            this.map.draw();
        };
        return ExampleState;
    })();
    States.ExampleState = ExampleState;    
})(States || (States = {}));

var Game;
(function (Game) {
    jaws.onload = function () {
        AssetLoader.load(AssetLoader.Types.Map, "bridge", function (map) {
            jaws.start(new States.ExampleState(map));
        });
    };
})(Game || (Game = {}));

