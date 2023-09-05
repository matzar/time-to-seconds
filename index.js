"use strict";

module.exports = function (timeString) {
  let timeArray = timeString.split(":");

  if (timeArray.some((val) => Number.isNaN(Number(val))))
    throw new TypeError(
      'time-to-seconds: wrong argument type - something else than a number string in format "number", "number:number" or "number:number:number" was passed. See documentation for more information on argument formatting: https://www.npmjs.com/package/time-to-seconds.'
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
        'time-to-seconds: too many colons - make sure the function argument is a number string in format "number", "number:number" or "number:number:number". See documentation for more information on argument formatting: https://www.npmjs.com/package/time-to-seconds.'
      );
  }
};
