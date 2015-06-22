
module objects {

    export class Reel extends createjs.Bitmap {

        constructor(stringImage: string, x: number, y: number) {
            super(stringImage);
            this.x = x;
            this.y = y;

        }

    }

} 