"use strict";

var chai = require("chai");
var expect = chai.expect;

var hms = require("./");

describe("hms", () => {
  it('should return error - wrong argument - something else than a number string, in format "number" or "number:number" or "number:number:number", was passed', () => {
    expect(function () {
      hms("asd");
    }).to.throw(
      'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it('should return error - wrong argument - something else than a number string, in format "number" or "number:number" or "number:number:number", was passed', () => {
    expect(function () {
      hms("a:s:d");
    }).to.throw(
      'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it('should return error - wrong argument - something else than a number string, in format "number" or "number:number" or "number:number:number", was passed', () => {
    expect(function () {
      hms("2:s:d");
    }).to.throw(
      'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it('should return error - wrong argument - something else than a number string, in format "number" or "number:number" or "number:number:number", was passed', () => {
    expect(function () {
      hms("!@#$!@#$%#^&$*%$%#&$^@#!%@");
    }).to.throw(
      'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it('should return error - wrong argument - something else than a number string, in format "number" or "number:number" or "number:number:number", was passed', () => {
    expect(function () {
      hms("2:#$%:d");
    }).to.throw(
      'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it('should return error - wrong argument - something else than a number string, in format "number" or "number:number" or "number:number:number", was passed', () => {
    expect(function () {
      hms("123a");
    }).to.throw(
      'hms: invalid function argument - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it("should return error - wrong argument - too many semicolons", () => {
    expect(function () {
      hms("1:2:2:4");
    }).to.throw(
      'hms: too many semicolons - please check if argument format is "number" or "number:number" or "number:number:number"'
    );
  });

  it("Should return 7322", () => {
    const seconds = hms("2:2:2");
    expect(seconds).to.be.equal(7322);
  });

  it("Should return 7322", () => {
    const seconds = hms("02:02:02");
    expect(seconds).to.be.equal(7322);
  });

  it("Should return 7322", () => {
    const seconds = hms("2:02:02");
    expect(seconds).to.be.equal(7322);
  });

  it("Should return 7322", () => {
    const seconds = hms("2:2:02");
    expect(seconds).to.be.equal(7322);
  });

  it("Should return 7322", () => {
    const seconds = hms("02:2:02");
    expect(seconds).to.be.equal(7322);
  });

  it("Should return 7322", () => {
    const seconds = hms("2:02:2");
    expect(seconds).to.be.equal(7322);
  });

  it("Should return 120", () => {
    const seconds = hms("2:");
    expect(seconds).to.be.equal(120);
  });

  it("Should return 120", () => {
    const seconds = hms("2:00");
    expect(seconds).to.be.equal(120);
  });

  it("Should return 2", () => {
    const seconds = hms("2");
    expect(seconds).to.be.equal(2);
  });

  it("Should return 2", () => {
    const seconds = hms(":2");
    expect(seconds).to.be.equal(2);
  });

  it("Should return 2", () => {
    const seconds = hms("0:2");
    expect(seconds).to.be.equal(2);
  });

  it("Should return 2", () => {
    const seconds = hms(":02");
    expect(seconds).to.be.equal(2);
  });

  it("Should return 2", () => {
    const seconds = hms("00:02");
    expect(seconds).to.be.equal(2);
  });

  it("Should return 2", () => {
    const seconds = hms("000:2");
    expect(seconds).to.be.equal(2);
  });

  it("Should return 0", () => {
    const seconds = hms("");
    expect(seconds).to.be.equal(0);
  });

  it("Should return 0", () => {
    const seconds = hms("0");
    expect(seconds).to.be.equal(0);
  });
});
