module MathHelpers
{
    export function clamp(value: number, low: number, high: number)
    {
        var ret = value;

        if (ret > high) ret = high;
        if (ret < low) ret = low;

        return ret;
    }
}