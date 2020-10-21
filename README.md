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
var convert = require("time-to-seconds");

convert("2:2:2");
// => 7322

convert("02:02:02");
// => 7322

convert("2:02:02");
// => 7322

convert("2:2:02");
// => 7322

convert("2:2:2");
// => 7322

convert(":2");
// => 2

convert("2:");
// => 120

convert("2");
// => 2

convert("");
// => 0

convert("0");
// => 0

convert("Anything else than a number");
// => throws TypeError - 'time-to-seconds: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'

convert("2:2:2:2");
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

Together, `timeToSeconds("0.2:0.2:00")` or `timeToSeconds("0.2:0.2:")`, will return 732 seconds (`0.2` of one hour is `720 seconds`, `0.2` of one minute is `12 seconds`; `720 + 12 = 732 seconds`)

Note: passing decimals as seconds, e.g.: `timeToSeconds("0:0:0.2")`, will simply return `0.2 seconds`. 

## License

MIT
