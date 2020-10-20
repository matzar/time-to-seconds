## time-to-seconds ![Build Status](https://travis-ci.com/matzar/time-to-seconds.svg?branch=master)

Non-strict format, time to seconds converter.

As long as you keep the number of semicolons in the string between 0 and 2 (`0 <= # of semicolons <= 2`) and put numbers in-between,
you will get the correct conversion.

## Install

```
$ npm install time-to-seconds
```

## Usage

Pass time as a string in format `"h:m:s"` where `h`, `m` and `s` are any numbers and get seconds as a number in return.

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

If you pass decimals to the function, e.g.: `timeToSeconds("0.2:00")` it will be interpreted as 0.2 of one minute, so 12 seconds (`60 * 0.2 = 12 seconds`).
Similarly, if you pass, e.g.: `timeToSeconds("0.2:00:00")` it will be interpreted as 0.2 of one hour, so 720 seconds (`3600 * 0.2 = 720 seconds`).
Together, `timeToSeconds("0.2:0.2:00")` it would return 732 seconds (`0.2` of one hour is `720 seconds`, `0.2` of one minute is `12 seconds`; `720 + 12 = 732 seconds`)

## License

MIT
