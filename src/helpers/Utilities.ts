///<reference path="../definitions/jaws.d.ts" />

module Utilities
{
    export function getSubRect(rect: jaws.Rect, box: number[], flipped?: bool = false): jaws.Rect
    {
        var boxX = flipped
            ? rect.width - (box[0] + box[2])
            : box[0];

        var newRect = new jaws.Rect(
            rect.x + boxX,
            rect.y + box[1],
            box[2],
            box[3]
        );

        newRect.right = rect.right - rect.width + boxX + box[2];
        newRect.bottom = rect.bottom - rect.height + box[1] + box[3];

        return newRect;
    }
}