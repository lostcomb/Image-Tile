const Rect = require("../model/Rect");
const ImageData = require("../model/ImageData");
const Group = require("../model/Group");
const assert = require("assert");

describe("Group.js:", function() {
    describe("Group 1", function() {
        beforeEach(function() {
            this.group = BuildTestGroup1();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one and two are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[1]), "Tile 2 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[2]), "Tile 3 should not be top-most.");
        });

        it("Tiles two and three are right-most tiles", function() {
            assert.ok(!this.group.isRightMost(this.tiles[0]), "Tile 1 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[1]), "Tile 2 should be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[2]), "Tile 3 should be right-most.");
        });

        it("Tiles two and three are bottom-most tiles", function() {
            assert.ok(!this.group.isBottomMost(this.tiles[0]), "Tile 1 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[1]), "Tile 2 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[2]), "Tile 3 should be bottom-most.");
        });

        it("Tiles one and three are left-most tiles", function() {
            assert.ok(this.group.isLeftMost(this.tiles[0]), "Tile 1 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[1]), "Tile 2 should not be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[2]), "Tile 3 should be left-most.");
        });
    });

    describe("Group 2", function() {
        beforeEach(function() {
            this.group = BuildTestGroup2();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one and three are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[1]), "Tile 2 should not be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[2]), "Tile 3 should be top-most.");
        });

        it("Tiles one and three are right-most tiles", function() {
            assert.ok(this.group.isRightMost(this.tiles[0]), "Tile 1 should be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[1]), "Tile 2 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[2]), "Tile 3 should be right-most.");
        });

        it("Tiles two and three are bottom-most tiles", function() {
            assert.ok(!this.group.isBottomMost(this.tiles[0]), "Tile 1 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[1]), "Tile 2 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[2]), "Tile 3 should be bottom-most.");
        });

        it("Tiles one and two are left-most tiles", function() {
            assert.ok(this.group.isLeftMost(this.tiles[0]), "Tile 1 should be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[1]), "Tile 2 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[2]), "Tile 3 should not be left-most.");
        });
    });

    describe("Group 3", function() {
        beforeEach(function() {
            this.group = BuildTestGroup3();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one and two are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[1]), "Tile 2 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[2]), "Tile 3 should not be top-most.");
        });

        it("Tiles one and three are right-most tiles", function() {
            assert.ok(this.group.isRightMost(this.tiles[0]), "Tile 1 should be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[1]), "Tile 2 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[2]), "Tile 3 should be right-most.");
        });

        it("Tiles two and three are bottom-most tiles", function() {
            assert.ok(!this.group.isBottomMost(this.tiles[0]), "Tile 1 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[1]), "Tile 2 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[2]), "Tile 3 should be bottom-most.");
        });

        it("Tiles one and two are left-most tiles", function() {
            assert.ok(this.group.isLeftMost(this.tiles[0]), "Tile 1 should be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[1]), "Tile 2 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[2]), "Tile 3 should not be left-most.");
        });
    });

    describe("Group 4", function() {
        beforeEach(function() {
            this.group = BuildTestGroup4();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one and two are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[1]), "Tile 2 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[2]), "Tile 3 should not be top-most.");
        });

        it("Tiles two and three are right-most tiles", function() {
            assert.ok(!this.group.isRightMost(this.tiles[0]), "Tile 1 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[1]), "Tile 2 should be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[2]), "Tile 3 should be right-most.");
        });

        it("Tiles one and three are bottom-most tiles", function() {
            assert.ok(this.group.isBottomMost(this.tiles[0]), "Tile 1 should be bottom-most.");
            assert.ok(!this.group.isBottomMost(this.tiles[1]), "Tile 2 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[2]), "Tile 3 should be bottom-most.");
        });

        it("Tiles one and three are left-most tiles", function() {
            assert.ok(this.group.isLeftMost(this.tiles[0]), "Tile 1 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[1]), "Tile 2 should not be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[2]), "Tile 3 should be left-most.");
        });
    });

    describe("Group 5", function() {
        beforeEach(function() {
            this.group = BuildTestGroup5();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one and two are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[1]), "Tile 2 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[2]), "Tile 3 should not be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[3]), "Tile 4 should not be top-most.");
        });

        it("Tiles two and four are right-most tiles", function() {
            assert.ok(!this.group.isRightMost(this.tiles[0]), "Tile 1 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[1]), "Tile 2 should be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[2]), "Tile 3 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[3]), "Tile 4 should be right-most.");
        });

        it("Tiles three and four are bottom-most tiles", function() {
            assert.ok(!this.group.isBottomMost(this.tiles[0]), "Tile 1 should not be bottom-most.");
            assert.ok(!this.group.isBottomMost(this.tiles[1]), "Tile 2 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[2]), "Tile 3 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[3]), "Tile 4 should be bottom-most.");
        });
    });

    describe("Group 6", function() {
        beforeEach(function() {
            this.group = BuildTestGroup6();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one, two and four are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[1]), "Tile 2 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[2]), "Tile 3 should not be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[3]), "Tile 4 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[4]), "Tile 5 should not be top-most.");
        });

        it("Tiles one, two and five are right-most tiles", function() {
            assert.ok(this.group.isRightMost(this.tiles[0]), "Tile 1 should be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[1]), "Tile 2 should be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[2]), "Tile 3 should not be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[3]), "Tile 4 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[4]), "Tile 5 should be right-most.");
        });

        it("Tiles three, four and five are bottom-most tiles", function() {
            assert.ok(!this.group.isBottomMost(this.tiles[0]), "Tile 1 should not be bottom-most.");
            assert.ok(!this.group.isBottomMost(this.tiles[1]), "Tile 2 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[2]), "Tile 3 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[3]), "Tile 4 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[4]), "Tile 5 should be bottom-most.");
        });

        it("Tiles one, two and three are left-most tiles", function() {
            assert.ok(this.group.isLeftMost(this.tiles[0]), "Tile 1 should be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[1]), "Tile 2 should be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[2]), "Tile 3 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[3]), "Tile 4 should not be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[4]), "Tile 5 should not be left-most.");
        });
    });

    describe("Group 7", function() {
        beforeEach(function() {
            this.group = BuildTestGroup7();
            this.tiles = this.group.getTiles();
        });

        it("Tiles one, two and three are top-most tiles", function() {
            assert.ok(this.group.isTopMost(this.tiles[0]), "Tile 1 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[1]), "Tile 2 should be top-most.");
            assert.ok(this.group.isTopMost(this.tiles[2]), "Tile 3 should be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[3]), "Tile 4 should not be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[4]), "Tile 5 should not be top-most.");
            assert.ok(!this.group.isTopMost(this.tiles[5]), "Tile 6 should not be top-most.");
        });

        it("Tiles three and six are right-most tiles", function() {
            assert.ok(!this.group.isRightMost(this.tiles[0]), "Tile 1 should not be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[1]), "Tile 2 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[2]), "Tile 3 should be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[3]), "Tile 4 should not be right-most.");
            assert.ok(!this.group.isRightMost(this.tiles[4]), "Tile 5 should not be right-most.");
            assert.ok(this.group.isRightMost(this.tiles[5]), "Tile 6 should be right-most.");
        });

        it("Tiles four, five and six are bottom-most tiles", function() {
            assert.ok(!this.group.isBottomMost(this.tiles[0]), "Tile 1 should not be bottom-most.");
            assert.ok(!this.group.isBottomMost(this.tiles[1]), "Tile 2 should not be bottom-most.");
            assert.ok(!this.group.isBottomMost(this.tiles[2]), "Tile 3 should not be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[3]), "Tile 4 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[4]), "Tile 5 should be bottom-most.");
            assert.ok(this.group.isBottomMost(this.tiles[5]), "Tile 6 should be bottom-most.");
        });

        it("Tiles one and four are left-most tiles", function() {
            assert.ok(this.group.isLeftMost(this.tiles[0]), "Tile 1 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[1]), "Tile 2 should not be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[2]), "Tile 3 should not be left-most.");
            assert.ok(this.group.isLeftMost(this.tiles[3]), "Tile 4 should be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[4]), "Tile 5 should not be left-most.");
            assert.ok(!this.group.isLeftMost(this.tiles[5]), "Tile 6 should not be left-most.");
        });
    });
});

/**
 * Tiles:
 * -------|-------
 * Tile 1 | Tile 2
 * -------|-------
 * Tile 3 |
 * -------|
 */
function BuildTestGroup1() {
    var tiles = [new Rect(0, 0, 100, 100), new Rect(100, 0, 100, 100), new Rect(0, 100, 100, 100)];
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
function BuildTestGroup2() {
    var tiles = [new Rect(0, 0, 100, 100), new Rect(0, 100, 100, 100), new Rect(100, 100, 100, 100)];
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
function BuildTestGroup3() {
    var tiles = [new Rect(100, 0, 100, 100), new Rect(0, 100, 100, 100), new Rect(100, 100, 100, 100)];
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
function BuildTestGroup4() {
    var tiles = [new Rect(0, 0, 100, 100), new Rect(100, 0, 100, 100), new Rect(100, 100, 100, 100)];
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
function BuildTestGroup5() {
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
function BuildTestGroup6() {
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
function BuildTestGroup7() {
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
