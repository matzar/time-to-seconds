# time-to-seconds

[![Release](https://github.com/matzar/time-to-seconds/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/matzar/time-to-seconds/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/matzar/time-to-seconds/branch/master/graph/badge.svg?token=EUYZLw2SLo)](https://codecov.io/gh/matzar/time-to-seconds)
[![CodeFactor](https://www.codefactor.io/repository/github/matzar/time-to-seconds/badge)](https://www.codefactor.io/repository/github/matzar/time-to-seconds)
[![NPM Version](https://img.shields.io/npm/v/time-to-seconds)](https://www.npmjs.com/package/time-to-seconds)
[![NPM Downloads](https://img.shields.io/npm/dt/time-to-seconds)](https://www.npmjs.com/package/time-to-seconds?minimal=true)
[![NPM Downloads](https://img.shields.io/npm/dw/time-to-seconds)](https://www.npmjs.com/package/time-to-seconds?minimal=true)
[![install size](https://packagephobia.com/badge?p=time-to-seconds)](https://packagephobia.com/result?p=time-to-seconds)
[![NPM](https://img.shields.io/npm/l/time-to-seconds)](https://tldrlegal.com/license/mit-license)
![npms.io (maintenance)](https://img.shields.io/npms-io/maintenance-score/time-to-seconds)
![npms.io (quality)](https://img.shields.io/npms-io/quality-score/time-to-seconds)
![npms.io (popularity)](https://img.shields.io/npms-io/popularity-score/time-to-seconds)
![npms.io (final)](https://img.shields.io/npms-io/final-score/time-to-seconds)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/time-to-seconds)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Unopinionated time to seconds converter that lets you decide the format of your `h:m:s`; as long as you keep the number of colons between `0` and `2` it does not matter if you use `"hh:mm:ss"`, `"h:m:s"` or `"hhh:mmmm:ssss"` format - you will always get the number of seconds back as an integer. 

## Installation

```
$ npm i time-to-seconds
```

## Usage

Pass time as a string, e.g.:

- `"h:m:s"`
- `"m:s"`
- `":s"`
- `"s"`
- or any variation of `"h:m:s"`, e.g. `":m:s"`; as long as you keep the number of colons between 0 and 2, where `h`, `m` or `s` are any numbers, you will get seconds - as a number - in return.

## Examples

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

timeToSeconds("2:");
// => 120

timeToSeconds("2:0");
// => 120

timeToSeconds("02:0");
// => 120

timeToSeconds("02:00");
// => 120

timeToSeconds(":2");
// => 2

timeToSeconds("2");
// => 2

timeToSeconds("0:2");
// => 2

timeToSeconds("0:02");
// => 2

timeToSeconds("00:02");
// => 2

timeToSeconds("");
// => 0

timeToSeconds("0");
// => 0
```

## Empty Strings

The non-strict format will allow for the input of an empty string which will be treated the same as passing the number `0`; the below inputs are equivalent and will return `0` seconds:

- `timeToSeconds("")`
- `timeToSeconds("0")`
- `timeToSeconds(":0")`
- `timeToSeconds("::0")`
- `timeToSeconds(":")`
- `timeToSeconds("::")`

## Error Handling

```js
timeToSeconds("Anything else than time string");
// TypeError: 'time-to-seconds: wrong argument type - something else than a number string in format "number", "number:number" or "number:number:number" was passed. See documentation for more information on argument formatting: https://www.npmjs.com/package/time-to-seconds.'

timeToSeconds("2:2:2:2");
// TypeError: 'time-to-seconds: too many colons - make sure the function argument is a number string in format "number", "number:number" or "number:number:number". See documentation for more information on argument formatting: https://www.npmjs.com/package/time-to-seconds.'
```

## Decimal Numbers

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

## Documentation

- [time-to-seconds](#time-to-seconds)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)
  - [Empty Strings](#empty-strings)
  - [Error Handling](#error-handling)
  - [Decimal Numbers](#decimal-numbers)
  - [Math](#math)
  - [License](#license)
  - [Documentation](#documentation)
