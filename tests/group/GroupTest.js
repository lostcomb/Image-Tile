"use strict";

QUnit.module("Group.js");

QUnit.test("Group 1: Layout", function (assert) {
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 1 | Tile 2");
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 3 |");
  assert.ok(true, "--------|");
});

QUnit.test("Group 1: Tiles one and two are top-most tiles", function (assert) {
  var group = BuildTestGroup1();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.ok(group.isTopMost(tiles[1]), "Tile 2 should be top-most.");
  assert.notOk(group.isTopMost(tiles[2]), "Tile 3 should not be top-most.");
});

QUnit.test("Group 1: Tiles two and three are right-most tiles", function (assert) {
  var group = BuildTestGroup1();
  var tiles = group.getTiles();
  assert.notOk(group.isRightMost(tiles[0]), "Tile 1 should not be right-most.");
  assert.ok(group.isRightMost(tiles[1]), "Tile 2 should be right-most.");
  assert.ok(group.isRightMost(tiles[2]), "Tile 3 should be right-most.");
});

QUnit.test("Group 1: Tiles two and three are bottom-most tiles", function (assert) {
  var group = BuildTestGroup1();
  var tiles = group.getTiles();
  assert.notOk(group.isBottomMost(tiles[0]), "Tile 1 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[1]), "Tile 2 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[2]), "Tile 3 should be bottom-most.");
});

QUnit.test("Group 1: Tiles one and three are left-most tiles", function (assert) {
  var group = BuildTestGroup1();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[1]), "Tile 2 should not be left-most.");
  assert.ok(group.isLeftMost(tiles[2]), "Tile 3 should be left-most.");
});

QUnit.test("Group 2: Layout", function (assert) {
  assert.ok(true, "--------|");
  assert.ok(true, "Tile 1 |");
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 2 | Tile 3");
  assert.ok(true, "--------|--------");
});

QUnit.test("Group 2: Tiles one and three are top-most tiles", function (assert) {
  var group = BuildTestGroup2();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.notOk(group.isTopMost(tiles[1]), "Tile 2 should not be top-most.");
  assert.ok(group.isTopMost(tiles[2]), "Tile 3 should be top-most.");
});

QUnit.test("Group 2: Tiles one and three are right-most tiles", function (assert) {
  var group = BuildTestGroup2();
  var tiles = group.getTiles();
  assert.ok(group.isRightMost(tiles[0]), "Tile 1 should be right-most.");
  assert.notOk(group.isRightMost(tiles[1]), "Tile 2 should not be right-most.");
  assert.ok(group.isRightMost(tiles[2]), "Tile 3 should be right-most.");
});

QUnit.test("Group 2: Tiles two and three are bottom-most tiles", function (assert) {
  var group = BuildTestGroup2();
  var tiles = group.getTiles();
  assert.notOk(group.isBottomMost(tiles[0]), "Tile 1 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[1]), "Tile 2 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[2]), "Tile 3 should be bottom-most.");
});

QUnit.test("Group 2: Tiles one and two are left-most tiles", function (assert) {
  var group = BuildTestGroup2();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.ok(group.isLeftMost(tiles[1]), "Tile 2 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[2]), "Tile 3 should not be left-most.");
});

QUnit.test("Group 3: Layout", function (assert) {
  assert.ok(true, "           |--------");
  assert.ok(true, "           | Tile 1");
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 2 | Tile 3");
  assert.ok(true, "--------|--------");
});

QUnit.test("Group 3: Tiles one and two are top-most tiles", function (assert) {
  var group = BuildTestGroup3();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.ok(group.isTopMost(tiles[1]), "Tile 2 should be top-most.");
  assert.notOk(group.isTopMost(tiles[2]), "Tile 3 should not be top-most.");
});

QUnit.test("Group 3: Tiles one and three are right-most tiles", function (assert) {
  var group = BuildTestGroup3();
  var tiles = group.getTiles();
  assert.ok(group.isRightMost(tiles[0]), "Tile 1 should be right-most.");
  assert.notOk(group.isRightMost(tiles[1]), "Tile 2 should not be right-most.");
  assert.ok(group.isRightMost(tiles[2]), "Tile 3 should be right-most.");
});

QUnit.test("Group 3: Tiles two and three are bottom-most tiles", function (assert) {
  var group = BuildTestGroup3();
  var tiles = group.getTiles();
  assert.notOk(group.isBottomMost(tiles[0]), "Tile 1 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[1]), "Tile 2 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[2]), "Tile 3 should be bottom-most.");
});

QUnit.test("Group 3: Tiles one and two are left-most tiles", function (assert) {
  var group = BuildTestGroup3();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.ok(group.isLeftMost(tiles[1]), "Tile 2 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[2]), "Tile 3 should not be left-most.");
});

QUnit.test("Group 4: Layout", function (assert) {
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 1 | Tile 2");
  assert.ok(true, "--------|--------");
  assert.ok(true, "           | Tile 3");
  assert.ok(true, "           |--------");
});

QUnit.test("Group 4: Tiles one and two are top-most tiles", function (assert) {
  var group = BuildTestGroup4();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.ok(group.isTopMost(tiles[1]), "Tile 2 should be top-most.");
  assert.notOk(group.isTopMost(tiles[2]), "Tile 3 should not be top-most.");
});

QUnit.test("Group 4: Tiles two and three are right-most tiles", function (assert) {
  var group = BuildTestGroup4();
  var tiles = group.getTiles();
  assert.notOk(group.isRightMost(tiles[0]), "Tile 1 should not be right-most.");
  assert.ok(group.isRightMost(tiles[1]), "Tile 2 should be right-most.");
  assert.ok(group.isRightMost(tiles[2]), "Tile 3 should be right-most.");
});

QUnit.test("Group 4: Tiles one and three are bottom-most tiles", function (assert) {
  var group = BuildTestGroup4();
  var tiles = group.getTiles();
  assert.ok(group.isBottomMost(tiles[0]), "Tile 1 should be bottom-most.");
  assert.notOk(group.isBottomMost(tiles[1]), "Tile 2 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[2]), "Tile 3 should be bottom-most.");
});

QUnit.test("Group 4: Tiles one and three are left-most tiles", function (assert) {
  var group = BuildTestGroup4();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[1]), "Tile 2 should not be left-most.");
  assert.ok(group.isLeftMost(tiles[2]), "Tile 3 should be left-most.");
});

QUnit.test("Group 5: Layout", function (assert) {
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 1 | Tile 2");
  assert.ok(true, "--------|--------");
  assert.ok(true, "Tile 3 | Tile 4");
  assert.ok(true, "--------|--------");
});

QUnit.test("Group 5: Tiles one and two are top-most tiles", function (assert) {
  var group = BuildTestGroup5();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.ok(group.isTopMost(tiles[1]), "Tile 2 should be top-most.");
  assert.notOk(group.isTopMost(tiles[2]), "Tile 3 should not be top-most.");
  assert.notOk(group.isTopMost(tiles[3]), "Tile 4 should not be top-most.");
});

QUnit.test("Group 5: Tiles two and four are right-most tiles", function (assert) {
  var group = BuildTestGroup5();
  var tiles = group.getTiles();
  assert.notOk(group.isRightMost(tiles[0]), "Tile 1 should not be right-most.");
  assert.ok(group.isRightMost(tiles[1]), "Tile 2 should be right-most.");
  assert.notOk(group.isRightMost(tiles[2]), "Tile 3 should not be right-most.");
  assert.ok(group.isRightMost(tiles[3]), "Tile 4 should be right-most.");
});

QUnit.test("Group 5: Tiles three and four are bottom-most tiles", function (assert) {
  var group = BuildTestGroup5();
  var tiles = group.getTiles();
  assert.notOk(group.isBottomMost(tiles[0]), "Tile 1 should not be bottom-most.");
  assert.notOk(group.isBottomMost(tiles[1]), "Tile 2 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[2]), "Tile 3 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[3]), "Tile 4 should be bottom-most.");
});

QUnit.test("Group 5: Tiles one and three are left-most tiles", function (assert) {
  var group = BuildTestGroup5();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[1]), "Tile 2 should not be left-most.");
  assert.ok(group.isLeftMost(tiles[2]), "Tile 3 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[3]), "Tile 4 should not be left-most.");
});

QUnit.test("Group 6: Layout", function (assert) {
  assert.ok(true, "--------|           |--------");
  assert.ok(true, "Tile 1 |           | Tile 2");
  assert.ok(true, "--------|--------|--------");
  assert.ok(true, "Tile 3 | Tile 4 | Tile 5");
  assert.ok(true, "--------|--------|--------");
});

QUnit.test("Group 6: Tiles one, two and four are top-most tiles", function (assert) {
  var group = BuildTestGroup6();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.ok(group.isTopMost(tiles[1]), "Tile 2 should be top-most.");
  assert.notOk(group.isTopMost(tiles[2]), "Tile 3 should not be top-most.");
  assert.ok(group.isTopMost(tiles[3]), "Tile 4 should be top-most.");
  assert.notOk(group.isTopMost(tiles[4]), "Tile 5 should not be top-most.");
});

QUnit.test("Group 6: Tiles one, two and five are right-most tiles", function (assert) {
  var group = BuildTestGroup6();
  var tiles = group.getTiles();
  assert.ok(group.isRightMost(tiles[0]), "Tile 1 should be right-most.");
  assert.ok(group.isRightMost(tiles[1]), "Tile 2 should be right-most.");
  assert.notOk(group.isRightMost(tiles[2]), "Tile 3 should not be right-most.");
  assert.notOk(group.isRightMost(tiles[3]), "Tile 4 should not be right-most.");
  assert.ok(group.isRightMost(tiles[4]), "Tile 5 should be right-most.");
});

QUnit.test("Group 6: Tiles three, four and five are bottom-most tiles", function (assert) {
  var group = BuildTestGroup6();
  var tiles = group.getTiles();
  assert.notOk(group.isBottomMost(tiles[0]), "Tile 1 should not be bottom-most.");
  assert.notOk(group.isBottomMost(tiles[1]), "Tile 2 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[2]), "Tile 3 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[3]), "Tile 4 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[4]), "Tile 5 should be bottom-most.");
});

QUnit.test("Group 6: Tiles one, two and three are left-most tiles", function (assert) {
  var group = BuildTestGroup6();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.ok(group.isLeftMost(tiles[1]), "Tile 2 should be left-most.");
  assert.ok(group.isLeftMost(tiles[2]), "Tile 3 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[3]), "Tile 4 should not be left-most.");
  assert.notOk(group.isLeftMost(tiles[4]), "Tile 5 should not be left-most.");
});

QUnit.test("Group 7: Layout", function (assert) {
  assert.ok(true, "--------|--------|--------");
  assert.ok(true, "Tile 1 | Tile 2 | Tile 3");
  assert.ok(true, "--------|--------|--------");
  assert.ok(true, "Tile 4 | Tile 5 | Tile 6");
  assert.ok(true, "--------|--------|--------");
});

QUnit.test("Group 7: Tiles one, two and three are top-most tiles", function (assert) {
  var group = BuildTestGroup7();
  var tiles = group.getTiles();
  assert.ok(group.isTopMost(tiles[0]), "Tile 1 should be top-most.");
  assert.ok(group.isTopMost(tiles[1]), "Tile 2 should be top-most.");
  assert.ok(group.isTopMost(tiles[2]), "Tile 3 should be top-most.");
  assert.notOk(group.isTopMost(tiles[3]), "Tile 4 should not be top-most.");
  assert.notOk(group.isTopMost(tiles[4]), "Tile 5 should not be top-most.");
  assert.notOk(group.isTopMost(tiles[5]), "Tile 6 should not be top-most.");
});

QUnit.test("Group 7: Tiles three and six are right-most tiles", function (assert) {
  var group = BuildTestGroup7();
  var tiles = group.getTiles();
  assert.notOk(group.isRightMost(tiles[0]), "Tile 1 should not be right-most.");
  assert.notOk(group.isRightMost(tiles[1]), "Tile 2 should not be right-most.");
  assert.ok(group.isRightMost(tiles[2]), "Tile 3 should be right-most.");
  assert.notOk(group.isRightMost(tiles[3]), "Tile 4 should not be right-most.");
  assert.notOk(group.isRightMost(tiles[4]), "Tile 5 should not be right-most.");
  assert.ok(group.isRightMost(tiles[5]), "Tile 6 should be right-most.");
});

QUnit.test("Group 7: Tiles four, five and six are bottom-most tiles", function (assert) {
  var group = BuildTestGroup7();
  var tiles = group.getTiles();
  assert.notOk(group.isBottomMost(tiles[0]), "Tile 1 should not be bottom-most.");
  assert.notOk(group.isBottomMost(tiles[1]), "Tile 2 should not be bottom-most.");
  assert.notOk(group.isBottomMost(tiles[2]), "Tile 3 should not be bottom-most.");
  assert.ok(group.isBottomMost(tiles[3]), "Tile 4 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[4]), "Tile 5 should be bottom-most.");
  assert.ok(group.isBottomMost(tiles[5]), "Tile 6 should be bottom-most.");
});

QUnit.test("Group 7: Tiles one and four are left-most tiles", function (assert) {
  var group = BuildTestGroup7();
  var tiles = group.getTiles();
  assert.ok(group.isLeftMost(tiles[0]), "Tile 1 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[1]), "Tile 2 should not be left-most.");
  assert.notOk(group.isLeftMost(tiles[2]), "Tile 3 should not be left-most.");
  assert.ok(group.isLeftMost(tiles[3]), "Tile 4 should be left-most.");
  assert.notOk(group.isLeftMost(tiles[4]), "Tile 5 should not be left-most.");
  assert.notOk(group.isLeftMost(tiles[5]), "Tile 6 should not be left-most.");
});

/**
 * Tiles:
 * -------|-------
 * Tile 1 | Tile 2
 * -------|-------
 * Tile 3 |
 * -------|
 */
function BuildTestGroup1 () {
  var tiles = [
    new Rect(0, 0, 100, 100),
    new Rect(100, 0, 100, 100),
    new Rect(0, 100, 100, 100)
  ];
  var bounding_box = new Rect(0, 0, 200, 200);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}

/**
 * Tiles:
 * -------|
 * Tile 1 |
 * -------|-------
 * Tile 2 | Tile 3
 * -------|-------
 */
function BuildTestGroup2 () {
  var tiles = [
    new Rect(0, 0, 100, 100),
    new Rect(0, 100, 100, 100),
    new Rect(100, 100, 100, 100)
  ];
  var bounding_box = new Rect(0, 0, 200, 200);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}

/**
 * Tiles:
 *        |-------
 *        | Tile 1
 * -------|-------
 * Tile 2 | Tile 3
 * -------|-------
 */
function BuildTestGroup3 () {
  var tiles = [
    new Rect(100, 0, 100, 100),
    new Rect(0, 100, 100, 100),
    new Rect(100, 100, 100, 100)
  ];
  var bounding_box = new Rect(0, 0, 200, 200);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}

/**
 * Tiles:
 * -------|-------
 * Tile 1 | Tile 2
 * -------|-------
 *        | Tile 3
 *        |-------
 */
function BuildTestGroup4 () {
  var tiles = [
    new Rect(0, 0, 100, 100),
    new Rect(100, 0, 100, 100),
    new Rect(100, 100, 100, 100)
  ];
  var bounding_box = new Rect(0, 0, 200, 200);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}

/**
 * Tiles:
 * -------|-------
 * Tile 1 | Tile 2
 * -------|-------
 * Tile 3 | Tile 4
 * -------|-------
 */
function BuildTestGroup5 () {
  var tiles = [
    new Rect(0, 0, 100, 100),
    new Rect(100, 0, 100, 100),
    new Rect(0, 100, 100, 100),
    new Rect(100, 100, 100, 100)
  ];
  var bounding_box = new Rect(0, 0, 200, 200);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}

/**
 * Tiles:
 * -------|        |-------
 * Tile 1 |        | Tile 2
 * -------|--------|-------
 * Tile 3 | Tile 4 | Tile 5
 * -------|--------|-------
 */
function BuildTestGroup6 () {
  var tiles = [
    new Rect(0, 0, 100, 100),
    new Rect(200, 0, 100, 100),
    new Rect(0, 100, 100, 100),
    new Rect(100, 100, 100, 100),
    new Rect(200, 100, 100, 100)
  ];
  var bounding_box = new Rect(0, 0, 300, 200);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}

/**
 * Tiles:
 * -------|--------|-------
 * Tile 1 | Tile 2 | Tile 3
 * -------|--------|-------
 * Tile 4 | Tile 5 | Tile 6
 * -------|--------|-------
 */
function BuildTestGroup7 () {
  var tiles = [
    new Rect(4, 4, 85.8, 74.75),
    new Rect(89.79999999999991, 4, 85.8, 74.75),
    new Rect(175.6, 4, 85.8, 74.75),
    new Rect(4, 78.75, 85.8, 74.75),
    new Rect(89.79999999999991, 78.75, 85.8, 74.75),
    new Rect(175.6, 78.75, 85.8, 74.75)
  ];
  var bounding_box = new Rect(4, 4, 257.4, 149.5);
  var image_data = new ImageData(undefined, bounding_box);
  var group = new Group(image_data, bounding_box, tiles);
  return group;
}
