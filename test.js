"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const timeToSeconds = require("./");

const WRONG_TYPE_MESSAGE =
  'time-to-seconds: wrong argument type - something else than a number string in format "number", "number:number" or "number:number:number" was passed. See documentation for more information on argument formatting: https://www.npmjs.com/package/time-to-seconds.';

const TOO_MANY_COLONS_MESSAGE =
  'time-to-seconds: too many colons - make sure the function argument is a number string in format "number", "number:number" or "number:number:number". See documentation for more information on argument formatting: https://www.npmjs.com/package/time-to-seconds.';

// A 200-digit zero-padded "2", to prove padding is irrelevant.
const PADDED_TWO = "2".padStart(201, "0");

describe("timeToSeconds", () => {
  describe("throws on non-numeric input", () => {
    const inputs = [
      "asd",
      "a:s:d",
      "2:s:d",
      "!@#$!@#$%#^&$*%$%#&$^@#!%@",
      "2:#$%:d",
      "123a",
    ];

    for (const input of inputs) {
      it(`rejects ${JSON.stringify(input)}`, () => {
        assert.throws(() => timeToSeconds(input), {
          name: "TypeError",
          message: WRONG_TYPE_MESSAGE,
        });
      });
    }
  });

  describe("throws on too many colons", () => {
    const inputs = ["1:2:2:4", "1:2:2:4:5", ":::", "::::"];

    for (const input of inputs) {
      it(`rejects ${JSON.stringify(input)}`, () => {
        assert.throws(() => timeToSeconds(input), {
          name: "TypeError",
          message: TOO_MANY_COLONS_MESSAGE,
        });
      });
    }
  });

  describe("converts h:m:s", () => {
    const cases = [
      ["2:2:2", 7322],
      ["02:02:02", 7322],
      ["2:02:02", 7322],
      ["2:2:02", 7322],
      ["02:2:02", 7322],
      ["2:02:2", 7322],
      [`${PADDED_TWO}:${PADDED_TWO}:${PADDED_TWO}`, 7322],
    ];

    for (const [input, expected] of cases) {
      it(`converts ${JSON.stringify(input)} to ${expected}`, () => {
        assert.equal(timeToSeconds(input), expected);
      });
    }
  });

  describe("converts m:s", () => {
    const cases = [
      ["2:", 120],
      ["2:00", 120],
      ["02:0", 120],
      ["02:00", 120],
      [":2", 2],
      ["0:2", 2],
      [":02", 2],
      ["00:02", 2],
      ["0:02", 2],
      ["000:2", 2],
    ];

    for (const [input, expected] of cases) {
      it(`converts ${JSON.stringify(input)} to ${expected}`, () => {
        assert.equal(timeToSeconds(input), expected);
      });
    }
  });

  describe("converts s", () => {
    const cases = [
      ["2", 2],
      ["0", 0],
    ];

    for (const [input, expected] of cases) {
      it(`converts ${JSON.stringify(input)} to ${expected}`, () => {
        assert.equal(timeToSeconds(input), expected);
      });
    }
  });

  describe("treats empty segments as zero", () => {
    const inputs = ["", ":0", "::0", ":", "::"];

    for (const input of inputs) {
      it(`converts ${JSON.stringify(input)} to 0`, () => {
        assert.equal(timeToSeconds(input), 0);
      });
    }
  });

  describe("converts decimals", () => {
    const cases = [
      ["0.2:00", 12],
      ["0.2:", 12],
      ["0.2:00:00", 720],
      ["0.2::", 720],
      ["0.2:0.2:00", 732],
      ["0.2:0.2:", 732],
      ["0:0:0.2", 0.2],
      ["0::0.2", 0.2],
      [":0:0.2", 0.2],
      ["::0.2", 0.2],
      ["0.2", 0.2],
    ];

    for (const [input, expected] of cases) {
      it(`converts ${JSON.stringify(input)} to ${expected}`, () => {
        assert.equal(timeToSeconds(input), expected);
      });
    }
  });

  describe("accepts computed values", () => {
    it("converts a value built from Math.log10", () => {
      const num = Math.log10(100);
      assert.equal(timeToSeconds(`${num.toString()}:`), 120);
    });

    it("converts an inlined Math.log10 expression", () => {
      assert.equal(timeToSeconds(`${Math.log10(100).toString()}:`), 120);
    });
  });
});
