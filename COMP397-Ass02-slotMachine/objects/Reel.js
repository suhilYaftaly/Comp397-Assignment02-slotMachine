var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var objects;
(function (objects) {
    var Reel = (function (_super) {
        __extends(Reel, _super);
        function Reel(stringImage, x, y) {
            _super.call(this, stringImage);
            this.x = x;
            this.y = y;
        }
        return Reel;
    })(createjs.Bitmap);
    objects.Reel = Reel;
})(objects || (objects = {}));
//# sourceMappingURL=Reel.js.map