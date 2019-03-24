const Rect = require("./Rect");
const ImageData = require("./ImageData");

/**
 * This defines a group of tiles in the user interface.
 */
module.exports = (function() {
    var attrs = new WeakMap();

    /**
     * This constructs a new Group object. This means that tiles can share a
     * common image, and hence, multiple tiles can be grouped to make larger
     * tiles.
     *
     * @param image_data   the ImageData object associated with this group.
     * @param bounding_box the Rect object defining the bounding box of this
     *                     group.
     * @param tiles        the array of tiles (Rects) defining the individual
     *                     rectangles which together make up this group.
     */
    function Group(image_data, bounding_box, tiles) {
        var properties = {
            image_data: image_data,
            bounding_box: bounding_box,
            tiles: tiles,
            /**
             * This method checks the specified tile to see if the boolean condition
             * holds when it is applied to all of the tiles.
             *
             * @param tile  the tile to check the condition for.
             * @param tiles the tiles to check the condition against.
             * @param cond  the boolean function to use for the checks.
             * @return      true if the condition holds for all of the tiles.
             */
            checkTile: function(tile, tiles, cond) {
                var res = true;
                for (let test of tiles) {
                    if (test != tile) res = res && cond(tile, test);
                }
                return res;
            }
        };
        attrs.set(this, properties);
    }

    /**
     * This method returns the image data for this group.
     *
     * @return the image data for this group.
     */
    Group.prototype.getImageData = function() {
        return attrs.get(this).image_data;
    };

    /**
     * This method sets the image data for this group.
     *
     * @param image_data the new image data for this group.
     */
    Group.prototype.setImageData = function(image_data) {
        attrs.get(this).image_data = image_data;
    };

    /**
     * This method returns the bounding box for this group.
     *
     * @return the bounding box for this group.
     */
    Group.prototype.getBoundingBox = function() {
        return attrs.get(this).bounding_box;
    };

    /**
     * This method sets the bounding_box for this group.
     *
     * @param bounding_box the new bounding_box for this group.
     */
    Group.prototype.setBoundingBox = function(bounding_box) {
        attrs.get(this).bounding_box = bounding_box;
    };

    /**
     * This method returns the tiles associated with this group.
     *
     * @return the tiles associated with this group.
     */
    Group.prototype.getTiles = function() {
        return attrs.get(this).tiles;
    };

    /**
     * This method returns true if the specified tile is the top most tile
     * in this group (i.e. there are no other tiles with a smaller y coordinate
     * in this tile). It returns false otherwise.
     *
     * @param tile the tile to check.
     * @return true if the specified tile is the top most tile in this group.
     */
    Group.prototype.isTopMost = function(tile) {
        var cond = function(tile, test_tile) {
            var withinX =
                test_tile.getX() > tile.getX() - tile.getWidth() / 2 &&
                test_tile.getX() < tile.getX() + tile.getWidth() / 2;
            var withinY =
                test_tile.getY() + test_tile.getHeight() > tile.getY() - tile.getHeight() / 2 &&
                test_tile.getY() + test_tile.getHeight() < tile.getY() + tile.getHeight() / 2;
            if (withinX && withinY) return false;
            else return true;
        };
        return attrs.get(this).checkTile(tile, this.getTiles(), cond);
    };

    /**
     * This method returns true if the specified tile is the right most tile
     * in this group (i.e. there are no other tiles with a greater x coordinate
     * in this tile). It returns false otherwise.
     *
     * @param tile the tile to check.
     * @return true if the specified tile is the right most tile in this group.
     */
    Group.prototype.isRightMost = function(tile) {
        var cond = function(tile, test_tile) {
            var withinX =
                test_tile.getX() > tile.getX() + tile.getWidth() / 2 &&
                test_tile.getX() < tile.getX() + (3 * tile.getWidth()) / 2;
            var withinY =
                test_tile.getY() > tile.getY() - tile.getHeight() / 2 &&
                test_tile.getY() < tile.getY() + tile.getHeight() / 2;
            if (withinX && withinY) return false;
            else return true;
        };
        return attrs.get(this).checkTile(tile, this.getTiles(), cond);
    };

    /**
     * This method returns true if the specified tile is the bottom most tile
     * in this group (i.e. there are no other tiles with a greater y coordinate
     * in this tile). It returns false otherwise.
     *
     * @param tile the tile to check.
     * @return true if the specified tile is the bottom most tile in this group.
     */
    Group.prototype.isBottomMost = function(tile) {
        var cond = function(tile, test_tile) {
            var withinX =
                test_tile.getX() > tile.getX() - tile.getWidth() / 2 &&
                test_tile.getX() < tile.getX() + tile.getWidth() / 2;
            var withinY =
                test_tile.getY() > tile.getY() + tile.getHeight() / 2 &&
                test_tile.getY() < tile.getY() + (3 * tile.getHeight()) / 2;
            if (withinX && withinY) return false;
            else return true;
        };
        return attrs.get(this).checkTile(tile, this.getTiles(), cond);
    };

    /**
     * This method returns true if the specified tile is the left most tile
     * in this group (i.e. there are no other tiles with a smaller x coordinate
     * in this tile). It returns false otherwise.
     *
     * @param tile the tile to check.
     * @return true if the specified tile is the left most tile in this group.
     */
    Group.prototype.isLeftMost = function(tile) {
        var cond = function(tile, test_tile) {
            var withinX =
                test_tile.getX() + test_tile.getWidth() > tile.getX() - tile.getWidth() / 2 &&
                test_tile.getX() + test_tile.getWidth() < tile.getX() + tile.getWidth() / 2;
            var withinY =
                test_tile.getY() > tile.getY() - tile.getHeight() / 2 &&
                test_tile.getY() < tile.getY() + tile.getHeight() / 2;
            if (withinX && withinY) return false;
            else return true;
        };
        return attrs.get(this).checkTile(tile, this.getTiles(), cond);
    };

    /**
     * This method returns a new Group object containing the concatenation of this
     * group with the specified group.
     *
     * @param group the group to merge with.
     * @return      the concatenation of this group and the specified group.
     */
    Group.prototype.mergeWith = function(group) {
        var bounding_box = this.getBoundingBox().mergeWith(group.getBoundingBox());
        var tiles = this.getTiles().concat(group.getTiles());
        var image_data = new ImageData(undefined, bounding_box);
        return new Group(image_data, bounding_box, tiles);
    };

    /**
     * This method returns an object representation of this rect suitable for
     * saving.
     *
     * @return an object representation of this rect suitable for saving.
     */
    Group.prototype.toObject = function() {
        var tiles = [];
        for (let tile of attrs.get(this).tiles) {
            tiles.push(tile.toObject());
        }
        return {
            image_data: attrs.get(this).image_data.toObject(),
            bounding_box: attrs.get(this).bounding_box.toObject(),
            tiles: tiles
        };
    };

    /**
     * This method sets the values in the specified object.
     *
     * @param object the object specifying the values to be set.
     */
    Group.prototype.fromObject = async function(object) {
        var image_data = new ImageData();
        await image_data.fromObject(object.image_data);
        attrs.get(this).image_data = image_data;

        var bounding_box = new Rect();
        await bounding_box.fromObject(object.bounding_box);
        attrs.get(this).bounding_box = bounding_box;

        var tiles = [];
        for (let tile of object.tiles) {
            var new_tile = new Rect();
            await new_tile.fromObject(tile);
            tiles.push(new_tile);
        }
        attrs.get(this).tiles = tiles;
    };

    return Group;
})();
