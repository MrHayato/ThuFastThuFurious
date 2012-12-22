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
    Keys.S = "s";
})(Keys || (Keys = {}));

var Constants;
(function (Constants) {
    Constants.VIEWPORT_WIDTH = 900;
    Constants.VIEWPORT_HEIGHT = 500;
    Constants.FRICTION = 0.85;
    Constants.GRAVITY = 0.7;
    Constants.PLAYER_JUMP_HEIGHT = 10;
    Constants.PLAYER_WALK_SPEED_X = 2;
    Constants.PLAYER_WALK_SPEED_Y = 1.25;
    Constants.PLAYER_RUN_MULTIPLIER = 2.25;
    Constants.PLAYER_RUNNING_JUMP_MULTIPLIER = 1.25;
    Constants.PLAYER_LANDING_DELAY = 125;
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
        this._animLocked = false;
        var self = this;
        AssetLoader.preload(entityDef.assets, function () {
            self._loaded = true;
            self.init(entityDef);
        });
    }
    Entity.prototype.init = function (entityDef) {
        this.damage = entityDef.damage;
        this.setImage(AssetLoader.parseAsset(entityDef.sprite, entityDef.assets));
        this.vx = 0;
        this.vy = 0;
    };
    Entity.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
        this.px += this.vx;
        this.vx *= Constants.FRICTION;
        if(this.vx < 0.05 && this.vx > 0) {
            this.vx = 0;
        }
        if(this.vx > -0.05 && this.vx < 0) {
            this.vx = 0;
        }
        if(this.vy < 0.05) {
            this.vy = 0;
        }
        if(this.vx === 0 && this.vy === 0) {
            this._animLocked = false;
        }
    };
    Entity.prototype.takeDamage = function (attackInfo) {
        if(attackInfo.handled) {
            return;
        }
        this.vx = attackInfo.knockback[0];
        attackInfo.handled = true;
        this._animLocked = true;
    };
    return Entity;
})(jaws.Sprite);
var Utilities;
(function (Utilities) {
    function getSubRect(rect, box, flipped) {
        if (typeof flipped === "undefined") { flipped = false; }
        var boxX = flipped ? rect.width - (box[0] + box[2]) : box[0];
        var newRect = new jaws.Rect(rect.x + boxX, rect.y + box[1], box[2], box[3]);
        newRect.right = rect.right - rect.width + boxX + box[2];
        newRect.bottom = rect.bottom - rect.height + box[1] + box[3];
        return newRect;
    }
    Utilities.getSubRect = getSubRect;
})(Utilities || (Utilities = {}));

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
        animDef.animation = animation.slice(animDef.frames[0], animDef.frames[1]);
        animDef.animation.frame_duration = animDef.frame_duration ? animDef.frame_duration : animation.frame_duration;
        animDef.animation.loop = animDef.loop !== undefined ? animDef.loop : true;
        return animDef;
    };
    Player.prototype.takeDamage = function (attackInfo) {
        this.hp -= attackInfo.damage;
    };
    Player.prototype.attack = function (animation) {
        var self = this;
        this.vx = 0;
        if(!this.isInAir) {
            this.vy = 0;
        }
        this.isAttacking = true;
        this.lock(animation, function () {
            self._lastAttack = null;
            self.isAttacking = false;
        });
    };
    Player.prototype.jump = function () {
        this.vy = -Constants.PLAYER_JUMP_HEIGHT;
        if(this.isRunning) {
            this.vx *= Constants.PLAYER_RUN_MULTIPLIER;
            this.vy *= Constants.PLAYER_RUNNING_JUMP_MULTIPLIER;
        }
        this._startingY = this.y;
        this.isInAir = true;
    };
    Player.prototype.lock = function (animation, unlockCallback, lockDuration) {
        if (typeof unlockCallback === "undefined") { unlockCallback = null; }
        if (typeof lockDuration === "undefined") { lockDuration = 0; }
        var self = this;
        var onUnlock = function () {
            self._animLocked = false;
            self._lockedAnimation = null;
            if(unlockCallback) {
                unlockCallback();
            }
        };
        this._animLocked = true;
        this._lockedAnimation = animation;
        this._lockedAnimation.animation.index = 0;
        if(lockDuration === 0) {
            this._lockedAnimation.animation.on_end = onUnlock;
        } else {
            setTimeout(onUnlock, lockDuration);
        }
    };
    Player.prototype.update = function () {
        if(!this._loaded) {
            return;
        }
        if(this._animLocked) {
            this.setImage(this._lockedAnimation.animation.next());
            return;
        }
        if(!this.isInAir) {
            this.vx = 0;
            this.vy = 0;
            this.isRunning = jaws.pressed(Keys.SHIFT);
            if(jaws.pressed(Keys.LEFT)) {
                this.vx = -Constants.PLAYER_WALK_SPEED_X;
            }
            if(jaws.pressed(Keys.RIGHT)) {
                this.vx = Constants.PLAYER_WALK_SPEED_X;
            }
            if(jaws.pressed(Keys.UP)) {
                this.vy = -Constants.PLAYER_WALK_SPEED_Y;
            }
            if(jaws.pressed(Keys.DOWN)) {
                this.vy = Constants.PLAYER_WALK_SPEED_Y;
            }
            if(jaws.pressed(Keys.Z)) {
                this.attack(this.animations.punch);
            }
            if(jaws.pressed(Keys.X)) {
                this.attack(this.animations.kick);
            }
            if(jaws.pressed(Keys.C)) {
                this.attack(this.animations.uppercut);
            }
            if(jaws.pressed(Keys.S)) {
                this.jump();
            }
        }
        if(this.vx === 0 && this.vy === 0 && !this.isInAir) {
            this.setImage(this.animations.idle.animation.next());
        } else {
            if(this.vx < 0) {
                this.flipped = true;
            }
            if(this.vx > 0) {
                this.flipped = false;
            }
            if(this.isInAir) {
                if(this.y + this.vy >= this._startingY) {
                    this.y = this._startingY;
                    this.vx = 0;
                    this.vy = 0;
                    this.isInAir = false;
                    this.lock(this.animations.crouch, null, Constants.PLAYER_LANDING_DELAY);
                } else {
                    this.vy = this.vy + Constants.GRAVITY;
                    this.setImage(this.animations.jump.animation.next());
                }
            } else {
                if(this.isRunning) {
                    this.vx *= Constants.PLAYER_RUN_MULTIPLIER;
                    this.vy *= Constants.PLAYER_RUN_MULTIPLIER;
                    this.setImage(this.animations.run.animation.next());
                } else {
                    this.setImage(this.animations.move.animation.next());
                }
            }
        }
        if(!this.isInAir) {
            this.y = MathHelpers.clamp(this.y, 360, Constants.VIEWPORT_HEIGHT - this.rect().height);
        }
    };
    Player.prototype.getAttackInfo = function () {
        if(!this.isAttacking) {
            return null;
        }
        if(this._lastAttack) {
            return this._lastAttack;
        }
        var kb = this.flipped ? [
            -this._lockedAnimation.attack.knockback[0], 
            this._lockedAnimation.attack.knockback[1]
        ] : this._lockedAnimation.attack.knockback;
        var attackInfo = {
            damage: this._lockedAnimation.attack.damage,
            knockback: kb,
            hitbox: Utilities.getSubRect(this.rect(), this._lockedAnimation.attack.box, this.flipped),
            handled: false
        };
        this._lastAttack = attackInfo;
        return attackInfo;
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
        this._player.move(this._player.vx, this._player.vy);
        this._viewport.centerAround(this._player);
        this._background.camera_x = this._viewport.x * 10;
        for(var i = 0; i < this._animatedBackgrounds.length; i++) {
            var anim = this._animatedBackgrounds[i];
            var bgLayer = this._background.layers[anim.bgIndex];
            bgLayer.setImage(anim.animation.next());
        }
        for(var i = 0; i < this._entities.length; i++) {
            this._entities[i].update();
            this._entities[i].x = this._entities[i].px - (this._groundLayer.x * 0.5);
            this._entities[i].y = this._entities[i].py;
            var atkInfo = this._player.getAttackInfo();
            if(atkInfo && atkInfo.hitbox.collideRect(this._entities[i].rect())) {
                this._entities[i].takeDamage(atkInfo);
            }
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

