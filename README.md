## Install

```
$ npm install time-to-seconds
```

## Usage

Pass time as a string in format `"h:m:s"` where `h`, `m` and `s` are any numbers and get seconds as a number in return.

```js
var convert = require("hms");

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
// => throws TypeError - 'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'

convert("2:2:2:2");
// => throws TypeError - 'hms: too many semicolons - please check if argument format is "number" or "number:number" or "number:number:number"'
```

## License

MIT @ [Mateusz Zaremba](https://matzar.github.io/)
