/**
 * This defines a rectangle which is used as a bounding box.
 */
module.exports = (function() {
    var attrs = new WeakMap();

    /**
     * This constructs a new Rect object.
     *
     * @param x      the x coordinate of the top-left corner of the rectangle.
     * @param y      the y coordinate of the top-left corner of the rectangle.
     * @param width  the width of the rectangle.
     * @param height the height of the rectangle.
     */
    function Rect(x, y, width, height) {
        var properties = {
            x: x,
            y: y,
            width: width,
            height: height
        };
        attrs.set(this, properties);
    }

    /**
     * This method returns the x coordinate of the top-left corner of this
     * rectangle.
     *
     * @return the x coordinate of the top-left corner of this rectangle.
     */
    Rect.prototype.getX = function() {
        return attrs.get(this).x;
    };

    /**
     * This method sets the x coordinate of this rectangle.
     *
     * @param x the new x coordinate of this rectangle.
     */
    Rect.prototype.setX = function(x) {
        attrs.get(this).x = x;
    };

    /**
     * This method returns the y coordinate of the top-left corner of this
     * rectangle.
     *
     * @return the y coordinate of the top-left corner of this rectangle.
     */
    Rect.prototype.getY = function() {
        return attrs.get(this).y;
    };

    /**
     * This method sets the y coordinate of this rectangle.
     *
     * @param y the new y coordinate of this rectangle.
     */
    Rect.prototype.setY = function(y) {
        attrs.get(this).y = y;
    };

    /**
     * This method returns the width of this rectangle.
     *
     * @return the width of this rectangle.
     */
    Rect.prototype.getWidth = function() {
        return attrs.get(this).width;
    };

    /**
     * This method sets the width of this rectangle.
     *
     * @param width the new width of this rectangle.
     */
    Rect.prototype.setWidth = function(width) {
        attrs.get(this).width = width;
    };

    /**
     * This method returns the height of this rectangle.
     *
     * @return the height of this rectangle.
     */
    Rect.prototype.getHeight = function() {
        return attrs.get(this).height;
    };

    /**
     * This method sets the height of this rectangle.
     *
     * @param height the new height of this rectangle.
     */
    Rect.prototype.setHeight = function(height) {
        attrs.get(this).height = height;
    };

    /**
     * This method returns a new Rect object which is the bounding box of
     * this rectangle and the specified rectangle.
     *
     * @param rect the rectangle to add to this rectangle.
     * @return     the bounding box of this rectangle and the specified rectangle.
     */
    Rect.prototype.mergeWith = function(rect) {
        var x = Math.min(this.getX(), rect.getX());
        var y = Math.min(this.getY(), rect.getY());
        var width = Math.max(this.getX() + this.getWidth(), rect.getX() + rect.getWidth()) - x;
        var height = Math.max(this.getY() + this.getHeight(), rect.getY() + rect.getHeight()) - y;
        return new Rect(x, y, width, height);
    };

    /**
     * This method returns true if the specified point is within this rectangle,
     * false otherwise.
     *
     * @param point the point to check.
     * @return      true if the specified point is within this rectangle, false
     *              otherwise.
     */
    Rect.prototype.contains = function(point) {
        if (
            this.getX() <= point.x &&
            point.x <= this.getX() + this.getWidth() &&
            this.getY() <= point.y &&
            point.y <= this.getY() + this.getHeight()
        )
            return true;
        else return false;
    };

    /**
     * This method returns an object representation of this rect suitable for
     * saving.
     *
     * @return an object representation of this rect suitable for saving.
     */
    Rect.prototype.toObject = function() {
        return Object.assign({}, attrs.get(this));
    };

    /**
     * This method sets the values in the specified object.
     *
     * @param object the object specifying the values to be set.
     */
    Rect.prototype.fromObject = function(object) {
        attrs.delete(this);
        attrs.set(this, object);
    };

    return Rect;
})();
