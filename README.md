## time-to-seconds ![Build Status](https://travis-ci.com/matzar/time-to-seconds.svg?branch=master)

Non-strict format, time to seconds converter.

## Install

```
$ npm i time-to-seconds
```

## Usage

Pass the time as a string in formats:

- `"h:m:s"`
- `"m:s"`
- `":s"`
- `"s"`
- or a variation of `"h:m:s"`, e.g. `":m:s"` - as long as you keep the number of semicolons between 0 and 2,

where `h`, `m` or `s` are any numbers, you will get seconds as a number in return.

```js
var timeToSeconds = require("time-to-seconds");

timeToSeconds("2:2:2");
// => 7322

timeToSeconds("02:02:02");
// => 7322

timeToSeconds("2:02:02");
// => 7322

timeToSeconds("2:2:02");
// => 7322

timeToSeconds("2:2:2");
// => 7322

timeToSeconds(":2");
// => 2

timeToSeconds("2:");
// => 120

timeToSeconds("2");
// => 2

timeToSeconds("");
// => 0

timeToSeconds("0");
// => 0

timeToSeconds("Anything else than a number");
// => throws TypeError - 'time-to-seconds: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'

timeToSeconds("2:2:2:2");
// => throws TypeError - 'time-to-seconds: too many semicolons - please check if argument format is "number" or "number:number" or "number:number:number"'
```

## Decimal numbers

If you pass decimals to the function, e.g.:

- `timeToSeconds("0.2:00")` or
- `timeToSeconds("0.2:")`

(in the above examples the inputs are the same) it will be interpreted as 0.2 of one minute, so 12 seconds (`60 * 0.2 = 12 seconds`).

Similarly, if you pass, e.g.:

- `timeToSeconds("0.2:00:00")` or
- `timeToSeconds("0.2::")`

(again, the inputs are the same) it will be interpreted as 0.2 of one hour, so 720 seconds (`3600 * 0.2 = 720 seconds`).

Together:

- `timeToSeconds("0.2:0.2:00")` or
- `timeToSeconds("0.2:0.2:")`

will return 732 seconds (`0.2` of one hour is `720 seconds`, `0.2` of one minute is `12 seconds`; `720 + 12 = 732 seconds`)

Note: passing decimals as seconds, e.g.: `timeToSeconds("0:0:0.2")`, will simply return `0.2 seconds`.

## Empty strings

The non-strict format will allow for an input of an empty string which will be treated the same as passing a number `0`; these two inputs are equivalent and will return `0 seconds`:

- `timeToSeconds("")` or
- `timeToSeconds("0")`

## Math

You could calculate the value to convert and because of the non-strict format, pass the calcualted value to the function, e.g.:

```js
var num = Math.log10(100);
timeToSeconds(`${num.toString()}:`);
// => 120

timeToSeconds(`${Math.log10(100).toString()}:`);
// => 120
```

## License

MIT
