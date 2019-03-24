const Rect = require("./Rect");
const ImageFit = require("./enums/ImageFit");

/**
 * This defines an object which contains the information to draw a scaled
 * image to the canvas.
 */
module.exports = (function() {
    var attrs = new WeakMap();

    /**
     * This constructs a new ImageData object.
     *
     * @param image the image to associated with this image data.
     * @param view_area the area that this image will be scaled to.
     */
    function ImageData(image, view_area) {
        var properties = {
            image: image,
            image_fit: ImageFit.CROP,
            view_area: view_area,
            position: {x: 0, y: 0},
            crop_scale: 1,
            rotation: 0,
            SIN: Math.sin(0),
            COS: Math.cos(0),
            ABS_SIN: Math.abs(Math.sin(0)),
            ABS_COS: Math.abs(Math.cos(0)),
            cond: true,
            canvas: undefined,
            /**
             * This method converts the specified coordinates to coordinates in the
             * unrotated image.
             *
             * @param coordinates the object containing the x- and y-coordinates to
             *                    be converted.
             * @return            an object containing the converted x- and
             *                    y-coordinates.
             */
            toImageCoordinates: function(coordinates) {
                return {
                    x: this.COS * coordinates.x + this.SIN * coordinates.y,
                    y: this.COS * coordinates.y - this.SIN * coordinates.x
                };
            },
            /**
             * This method converts the specified coordinates to coordinates in the
             * rotated image.
             *
             * @param coordinates the object containing the x- and y-coordinates to
             *                    be converted.
             * @return            an object containing the converted x- and
             *                    y-coordinates.
             */
            fromImageCoordinates: function(coordinates) {
                return {
                    x: this.COS * coordinates.x - this.SIN * coordinates.y,
                    y: this.COS * coordinates.y + this.SIN * coordinates.x
                };
            },
            /**
             * This method returns the canvas element for this ImageData.
             *
             * @return the canvas object for this ImageData.
             */
            getCanvas: function() {
                this.canvas = this.canvas || document.createElement("canvas");
                return this.canvas;
            }
        };
        attrs.set(this, properties);
    }

    /**
     * This method updates the position of the image relative to the view area
     * of the image.
     *
     * @param dx the difference in the x-direction.
     * @param dy the difference in the y-direction.
     */
    ImageData.prototype.updatePosition = function(dx, dy) {
        if (!attrs.get(this).image) return;

        var pos = attrs.get(this).position;
        attrs.get(this).position = {
            x: pos.x - dx,
            y: pos.y - dy
        };
    };

    /**
     * This method returns the ImageFit associated with this image data.
     *
     * @return the ImageFit associated with this image data.
     */
    ImageData.prototype.getImageFit = function() {
        return attrs.get(this).image_fit;
    };

    /**
     * This method sets the ImageFit associated with this image data.
     *
     * @param image_fit the new ImageFit to be associated with this image
     *                  data.
     */
    ImageData.prototype.setImageFit = function(image_fit) {
        attrs.get(this).image_fit = image_fit;
    };

    /**
     * This method returns the scale associated with this image data.
     *
     * @return the scale associated with this image data.
     */
    ImageData.prototype.getImageScale = function() {
        return (attrs.get(this).crop_scale - 1) / ((this.getMaxScale() - 100) / 10000);
    };

    /**
     * This method sets the scale associated with this image data.
     *
     * @param scale the new scale to be associated with this image data.
     */
    ImageData.prototype.setImageScale = function(scale) {
        attrs.get(this).crop_scale = 1 + scale * ((this.getMaxScale() - 100) / 10000);
    };

    /**
     * This method returns the rotation associated with this image data. This is
     * stored in radians and returned in degrees.
     *
     * @return the rotation associated with this image data.
     */
    ImageData.prototype.getImageRotation = function() {
        return attrs.get(this).rotation / (Math.PI / 180);
    };

    /**
     * This method sets the rotation associated with this image data. This is
     * given in degrees and stored in radians.
     *
     * @param rotation the new rotation to be associated with this image data.
     */
    ImageData.prototype.setImageRotation = function(rotation) {
        attrs.get(this).rotation = rotation * (Math.PI / 180);
        var rot = attrs.get(this).rotation % (Math.PI / 2);
        attrs.get(this).SIN = Math.sin(rot);
        attrs.get(this).COS = Math.cos(rot);
        attrs.get(this).ABS_SIN = Math.sin(Math.abs(rot));
        attrs.get(this).ABS_COS = Math.cos(Math.abs(rot));
        attrs.get(this).cond = Math.floor(Math.abs(attrs.get(this).rotation) / (Math.PI / 2)) % 2 == 0;
    };

    /**
     * This method returns the image associated with this image data.
     *
     * @return the image associated with this image data.
     */
    ImageData.prototype.getImage = function() {
        return attrs.get(this).image;
    };

    /**
     * This method sets the view area for this image data.
     *
     * @param view_area the new view area for this image data.
     */
    ImageData.prototype.setViewArea = function(view_area) {
        attrs.get(this).view_area = view_area;
    };

    /**
     * This method returns the scale of the image relative to the view area.
     *
     * @return the scale of the image relative to the view area.
     * NOTE: Make this private.
     */
    ImageData.prototype.getScale = function() {
        var w =
            attrs.get(this).ABS_COS * attrs.get(this).view_area.getWidth() +
            attrs.get(this).ABS_SIN * attrs.get(this).view_area.getHeight();
        var h =
            attrs.get(this).ABS_SIN * attrs.get(this).view_area.getWidth() +
            attrs.get(this).ABS_COS * attrs.get(this).view_area.getHeight();

        var scale = Math.min(
            attrs.get(this).image.naturalWidth / (attrs.get(this).cond ? w : h),
            attrs.get(this).image.naturalHeight / (attrs.get(this).cond ? h : w)
        );

        if (attrs.get(this).image_fit == ImageFit.CROP) scale /= attrs.get(this).crop_scale;

        return scale;
    };

    /**
     * This method returns the offset of the image relative to the view area.
     *
     * @param scale the scale of the image.
     * @return      the offset of the image relative to the view area.
     * NOTE: Make this private.
     */
    ImageData.prototype.getOffset = function(scale) {
        return {
            x1: attrs.get(this).view_area.getWidth() / 2,
            y1: attrs.get(this).view_area.getHeight() / 2,
            x2: -(attrs.get(this).image.naturalWidth / scale) / 2,
            y2: -(attrs.get(this).image.naturalHeight / scale) / 2
        };
    };

    /**
     * This method returns the extra offset of the image that the user has
     * specified, this is bounded so the image cannot be moved off the screen.
     *
     * @param scale the scale of the image.
     * @return      the extra offset of the image that the user has specified.
     * NOTE: Make this private.
     */
    ImageData.prototype.getPosOffset = function(scale) {
        var sw = attrs.get(this).image.naturalWidth / scale;
        var sh = attrs.get(this).image.naturalHeight / scale;

        var width = attrs.get(this).cond ? attrs.get(this).view_area.getWidth() : attrs.get(this).view_area.getHeight();
        var height = attrs.get(this).cond
            ? attrs.get(this).view_area.getHeight()
            : attrs.get(this).view_area.getWidth();
        var bw = attrs.get(this).ABS_COS * width + attrs.get(this).ABS_SIN * height;
        var bh = attrs.get(this).ABS_SIN * width + attrs.get(this).ABS_COS * height;

        if (attrs.get(this).cond)
            var offset_x = (sw - bw) / 2,
                offset_y = (sh - bh) / 2;
        else
            var offset_x = (sh - bh) / 2,
                offset_y = (sw - bw) / 2;

        var pos = attrs.get(this).toImageCoordinates(attrs.get(this).position);

        var bounded_pos = {
            x: Math.max(Math.min(offset_x, pos.x), -offset_x),
            y: Math.max(Math.min(offset_y, pos.y), -offset_y)
        };

        attrs.get(this).position = attrs.get(this).fromImageCoordinates(bounded_pos);

        return bounded_pos;
    };

    /**
     * This method draws this ImageData to its canvas.
     *
     * @param scale the scale at which to draw the image, this is used to allow
     *              us to draw smaller when we don't need 100% scale for printing.
     */
    ImageData.prototype.prepare = function(scale) {
        var canvas = attrs.get(this).getCanvas();
        canvas.width = attrs.get(this).view_area.getWidth() * scale;
        canvas.height = attrs.get(this).view_area.getHeight() * scale;
        var context = canvas.getContext("2d");

        var im_scale = this.getScale();
        var offset = this.getOffset(im_scale);
        var position = this.getPosOffset(im_scale);

        context.translate(offset.x1 * scale, offset.y1 * scale);

        var partial = attrs.get(this).rotation % (Math.PI / 2);
        context.rotate(partial);
        context.translate(position.x * scale, position.y * scale);

        context.rotate(attrs.get(this).rotation - partial);
        context.translate(offset.x2 * scale, offset.y2 * scale);

        context.drawImage(
            attrs.get(this).image,
            0,
            0,
            (attrs.get(this).image.naturalWidth / im_scale) * scale,
            (attrs.get(this).image.naturalHeight / im_scale) * scale
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
        return canvas;
    };

    /**
     * This method returns the superposition of the specified rectangle
     * on the view area associated with this image data.
     *
     * @param rect the rectangle to superimpose onto the view area.
     * @return     the superposition of the specified rectangle on to the view
     *             area associated with this image data.
     */
    ImageData.prototype.getCRect = function(rect) {
        var cx = rect.getX() - attrs.get(this).view_area.getX();
        var cy = rect.getY() - attrs.get(this).view_area.getY();
        var cwidth = rect.getWidth();
        var cheight = rect.getHeight();

        return new Rect(cx, cy, cwidth, cheight);
    };

    /**
     * This method returns the max scale of an ImageData when using the CROP
     * ImageFit.
     *
     * @return the max scale of an ImageData.
     */
    ImageData.prototype.getMaxScale = function() {
        return 300;
    };

    /**
     * This method returns an object representation of this rect suitable for
     * saving.
     *
     * @return an object representation of this rect suitable for saving.
     */
    ImageData.prototype.toObject = function() {
        return {
            image_src: attrs.get(this).image ? attrs.get(this).image.src : undefined,
            image_fit: attrs.get(this).image_fit,
            view_area: attrs.get(this).view_area.toObject(),
            position: attrs.get(this).position,
            crop_scale: attrs.get(this).crop_scale,
            rotation: attrs.get(this).rotation,
            SIN: attrs.get(this).SIN,
            COS: attrs.get(this).COS,
            ABS_SIN: attrs.get(this).ABS_SIN,
            ABS_COS: attrs.get(this).ABS_COS,
            cond: attrs.get(this).cond
        };
    };

    /**
     * This method sets the values in the specified object.
     *
     * @param object the object specifying the values to be set.
     */
    ImageData.prototype.fromObject = function(object) {
        var view_area = new Rect();
        view_area.fromObject(object.view_area);
        attrs.get(this).view_area = view_area;
        if (object.image_src) {
            var image = document.createElement("img");
            image.src = object.image_src;
            attrs.get(this).image = image;
        }
        attrs.get(this).image_fit = object.image_fit;
        attrs.get(this).position = object.position;
        attrs.get(this).crop_scale = object.crop_scale;
        attrs.get(this).rotation = object.rotation;
        attrs.get(this).SIN = object.SIN;
        attrs.get(this).COS = object.COS;
        attrs.get(this).ABS_SIN = object.ABS_SIN;
        attrs.get(this).ABS_COS = object.ABS_COS;
        attrs.get(this).cond = object.cond;
    };

    return ImageData;
})();
