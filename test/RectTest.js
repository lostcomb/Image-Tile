const Rect = require("../model/Rect");
const assert = require("assert");

describe("Rect.js:", function () {
  it("Merging a rect with an identical rect", function () {
    const rect1 = new Rect(0, 0, 10, 10);
    const rect2 = new Rect(0, 0, 10, 10);
    const expected = new Rect(0, 0, 10, 10);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the same.",
      "Y coordinate should be the same.",
      "Width should be the same.",
      "Height should be the same."
    ]);
  });

  it("Merging a rect with itself", function () {
    const rect = new Rect(0, 0, 10, 10);
    const expected = new Rect(0, 0, 10, 10);
    const result = rect.mergeWith(rect);
    assertRectEqual(result, expected, [
      "X coordinate should be the same.",
      "Y coordinate should be the same.",
      "Width should be the same.",
      "Height should be the same."
    ]);
  });

  it("Merging two rects with the same x's, different y's and the same size", function () {
    const rect1 = new Rect(243, 23, 10, 10);
    const rect2 = new Rect(243, 91, 10, 10);
    const expected = new Rect(243, 23, 10, 78);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the same.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the same.",
      "Height should be the difference in y's + the height."
    ]);
  });

  it("Merging two rects with the same x's, different y's and the same size", function () {
    const rect1 = new Rect(243, 91, 10, 10);
    const rect2 = new Rect(243, 23, 10, 10);
    const expected = new Rect(243, 23, 10, 78);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the same.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the same.",
      "Height should be the difference in y's + the height."
    ]);
  });

  it("Merging two rects with the same x's, different y's and different size", function () {
    const rect1 = new Rect(243, 23, 100, 34);
    const rect2 = new Rect(243, 91, 86, 123);
    const expected = new Rect(243, 23, 100, 191);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the same.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with the same x's, different y's and different size", function () {
    const rect1 = new Rect(243, 91, 86, 123);
    const rect2 = new Rect(243, 23, 100, 34);
    const expected = new Rect(243, 23, 100, 191);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the same.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with different x's, the same y's and the same size", function () {
    const rect1 = new Rect(23, 67, 10, 10);
    const rect2 = new Rect(2234, 67, 10, 10);
    const expected = new Rect(23, 67, 2221, 10);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the same.",
      "Width should be the same.",
      "Height should be the difference in y's + the height."
    ]);
  });

  it("Merging two rects with different x's, the same y's and the same size", function () {
    const rect1 = new Rect(2234, 67, 10, 10);
    const rect2 = new Rect(23, 67, 10, 10);
    const expected = new Rect(23, 67, 2221, 10);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the same.",
      "Width should be the same.",
      "Height should be the difference in y's + the height."
    ]);
  });

  it("Merging two rects with different x's, the same y's and different size", function () {
    const rect1 = new Rect(23, 67, 86, 123);
    const rect2 = new Rect(2234, 67, 100, 34);
    const expected = new Rect(23, 67, 2311, 123);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the same.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with different x's, the same y's and different size", function () {
    const rect1 = new Rect(2234, 67, 100, 34);
    const rect2 = new Rect(23, 67, 86, 123);
    const expected = new Rect(23, 67, 2311, 123);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the same.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with different x's, different y's and the same size", function () {
    const rect1 = new Rect(234, 123, 10, 10);
    const rect2 = new Rect(6, 4345, 10, 10);
    const expected = new Rect(6, 123, 238, 4232);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with different x's, different y's and the same size", function () {
    const rect1 = new Rect(6, 4345, 10, 10);
    const rect2 = new Rect(234, 123, 10, 10);
    const expected = new Rect(6, 123, 238, 4232);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with different x's, different y's and different size", function () {
    const rect1 = new Rect(234, 123, 86, 123);
    const rect2 = new Rect(6, 4345, 100, 34);
    const expected = new Rect(6, 123, 314, 4256);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects with different x's, different y's and different size", function () {
    const rect1 = new Rect(6, 4345, 100, 34);
    const rect2 = new Rect(234, 123, 86, 123);
    const expected = new Rect(6, 123, 314, 4256);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects, one with negative origin, the other positive", function () {
    const rect1 = new Rect(-13, -15, 200, 300);
    const rect2 = new Rect(7, 15, 200, 300);
    const expected = new Rect(-13, -15, 220, 330);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects, one with negative origin, the other positive", function () {
    const rect1 = new Rect(7, 15, 200, 300);
    const rect2 = new Rect(-13, -15, 200, 300);
    const expected = new Rect(-13, -15, 220, 330);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects, one with negative origin, the other positive", function () {
    const rect1 = new Rect(-13, -15, 200, 300);
    const rect2 = new Rect(7, 15, 20, 30);
    const expected = new Rect(-13, -15, 200, 300);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

  it("Merging two rects, one with negative origin, the other positive", function () {
    const rect1 = new Rect(7, 15, 20, 30);
    const rect2 = new Rect(-13, -15, 200, 300);
    const expected = new Rect(-13, -15, 200, 300);
    const result = rect1.mergeWith(rect2);
    assertRectEqual(result, expected, [
      "X coordinate should be the min x coordinate.",
      "Y coordinate should be the min y coordinate.",
      "Width should be the distance from the new origin to the right-hand side.",
      "Height should be the distance from the new origin to the bottom side."
    ]);
  });

});

function assertRectEqual(result, expected, messages) {
  assert.strictEqual(result.getX(), expected.getX(), messages[0]);
  assert.strictEqual(result.getY(), expected.getY(), messages[1]);
  assert.strictEqual(result.getWidth(), expected.getWidth(), messages[2]);
  assert.strictEqual(result.getHeight(), expected.getHeight(), messages[3]);
}
