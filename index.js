"use strict";

module.exports = function (seconds) {
  let timeArray = seconds.split(":");

  if (timeArray.some(isNaN))
    throw new TypeError(
      'timeToSeconds: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );

  switch (timeArray.length) {
    case 3:
      return +timeArray[0] * 3600 + +timeArray[1] * 60 + +timeArray[2];
    case 2:
      return +timeArray[0] * 60 + +timeArray[1];
    case 1:
      return +timeArray[0];
    default:
      throw new TypeError(
        'timeToSeconds: too many semicolons - please check if argument format is "number" or "number:number" or "number:number:number"'
      );
  }
};
