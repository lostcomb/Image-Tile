const Rect = require("./Rect");
const ImageData = require("./ImageData");
const Group = require("./Group");
const ImageFit = require("./enums/ImageFit");
const Orientation = require("./enums/Orientation");
const defaults = require("../defaults");

/**
 * This defines the object which contains all of the information required
 * to build up the image.
 */
module.exports = (function () {
  var attrs = new WeakMap();
  var priv = new WeakMap();

  /**
   * This constructs a new Model object.
   *
   * @param defaults the object containing the default items for the image
   *                 size and the image orientation.
   */
  function Model (defaults) {
    var self = this;
    var properties = {
      size: undefined,
      raw_size: undefined,
      rows: 4,
      cols: 4,
      border: {
        "top": 4,
        "right": 4,
        "bottom": 4,
        "left": 4,
        "color": "#FFFFFF"
      },
      groups: [],
      defaults: defaults,
      orientation: defaults["image-orientation"]
    };
    var privs = {
      file: "",
      undo_queue: [],
      redo_queue: [],
      /**
       * This method makes a array of groups from the data provided in this
       * object.
       *
       * @param discard_images the boolean which decides whether to keep the
       *                       image associated to a group, or to discard it.
       */
      buildGroups: function () {
        attrs.get(self).groups = [];
        var width = (attrs.get(self).size.getWidth()
                  - (attrs.get(self).border.left + attrs.get(self).border.right))
                  / attrs.get(self).cols;
        var height = (attrs.get(self).size.getHeight()
                   - (attrs.get(self).border.top + attrs.get(self).border.bottom))
                   / attrs.get(self).rows;
        for (var i = 0; i < attrs.get(self).rows; i++) {
          for (var j = 0; j < attrs.get(self).cols; j++) {
            var x = j * width + attrs.get(self).border.right;
            var y = i * height + attrs.get(self).border.bottom;
            var tile = new Rect(x, y, width, height);
            var group = new Group(new ImageData(undefined, tile), tile, [tile]);
            attrs.get(self).groups.push(group);
          }
        }
      },
      /**
       * This method adjusts the sizes of the tiles in the list of groups.
       */
      rebuildGroups: function () {
        if (attrs.get(self).groups.length < 1) return;
        var oldWidth = attrs.get(self).groups[0].getTiles()[0].getWidth();
        var oldHeight = attrs.get(self).groups[0].getTiles()[0].getHeight();
        var oldRightBorder = attrs.get(self).groups[0].getTiles()[0].getX() % oldWidth;
        var oldBottomBorder = attrs.get(self).groups[0].getTiles()[0].getY() % oldHeight;

        var width = (attrs.get(self).size.getWidth()
                  - (attrs.get(self).border.left + attrs.get(self).border.right))
                  / attrs.get(self).cols;
        var height = (attrs.get(self).size.getHeight()
                   - (attrs.get(self).border.top + attrs.get(self).border.bottom))
                   / attrs.get(self).rows;

        for (let group of attrs.get(self).groups) {
          var i = 0, tiles = group.getTiles(), bounding_box = undefined;
          do {
            var x = ((tiles[i].getX() - oldRightBorder) / oldWidth) * width + attrs.get(self).border.right;
            var y = ((tiles[i].getY() - oldBottomBorder) / oldHeight) * height + attrs.get(self).border.bottom;

            tiles[i].setX(x);
            tiles[i].setY(y);
            tiles[i].setWidth(width);
            tiles[i].setHeight(height);

            if (!bounding_box) bounding_box = tiles[i];
            else bounding_box = bounding_box.mergeWith(tiles[i]);

            i++;
          } while (i < tiles.length);

          group.setBoundingBox(bounding_box);
          group.getImageData().setViewArea(bounding_box);
        }
      },
      observers: [],
      /**
       * This method calls the notify method of all of the registered observers
       * of this model.
       *
       * @param groups the option list of groups to be passed to the observers.
       */
      notifyObservers: function (groups) {
        for (let observer of this.observers) {
          observer.notify(self, groups);
        }
      }
    };
    attrs.set(this, properties);
    priv.set(this, privs);
    this.setSize(defaults["image-sizes"][defaults["image-size"]], true);
    priv.get(this).buildGroups();
  };

  /**
   * This method sets the image for the specified groups.
   *
   * @param groups the list of groups whose image to set.
   * @param image  the new image for the specified groups.
   */
  Model.prototype.setImage = function (groups, image) {
    this.saveState();

    for (let group of groups) {
      group.setImageData(new ImageData(image, group.getBoundingBox()));
    }
    priv.get(this).notifyObservers();
  };


  /**
   * This method returns the size of the image (as it would be saved) in
   * pixels encapsulated in a Rect object.
   *
   * @return the size of the image in pixels.
   */
  Model.prototype.getSize = function () {
    return attrs.get(this).size;
  };

  /**
   * This method returns the object containing the physical size in mm
   * and the ppi.
   *
   * @return the object containing the physical size in mm and the ppi.
   */
  Model.prototype.getRawSize = function () {
    return attrs.get(this).raw_size;
  };

  /**
   * The method sets the size of the image in pixels when given an object
   * containing:
   *   width-mm: the width in mm.
   *   height-mm: the height in mm.
   *   ppi: the number of pixels per inch.
   * This method uses the conversion: 1 inch = 25.4 mm.
   *
   * @param raw_size  the object containing the above information.
   * @param doNotSave the boolean which decides whether to save the current
   *                  state on the undo queue before making changes.
   */
  Model.prototype.setSize = function (raw_size, doNotSave) {
    if (!doNotSave) this.saveState();

    var ppmm = raw_size.ppi / 25.4;
    var width = Math.round(raw_size["width-mm"] * ppmm);
    var height = Math.round(raw_size["height-mm"] * ppmm);
    if (attrs.get(this).orientation == Orientation.LANDSCAPE) {
      attrs.get(this).size = new Rect(
        0,
        0,
        Math.max(width, height),
        Math.min(width, height)
      );
    } else {
      attrs.get(this).size = new Rect(
        0,
        0,
        Math.min(width, height),
        Math.max(width, height)
      );
    }
    attrs.get(this).raw_size = raw_size;
    priv.get(this).rebuildGroups();
    priv.get(this).notifyObservers();
  };

  /**
   * This method returns the number of rows in the image.
   *
   * @return the number of rows in the image.
   */
  Model.prototype.getRows = function () {
    return attrs.get(this).rows;
  };

  /**
   * This method sets the number of rows in the image.
   *
   * @param rows the new number of rows in the image.
   */
  Model.prototype.setRows = function (rows) {
    attrs.get(this).rows = rows;
    priv.get(this).buildGroups();
    priv.get(this).notifyObservers(true);
  };

  /**
   * This method returns the number of columns in the image.
   *
   * @return the number of columns in the image.
   */
  Model.prototype.getCols = function () {
    return attrs.get(this).cols;
  };

  /**
   * This method sets the number of columns in the image.
   *
   * @param cols the new number of columns in the image.
   */
  Model.prototype.setCols = function (cols) {
    attrs.get(this).cols = cols;
    priv.get(this).buildGroups();
    priv.get(this).notifyObservers(true);
  };

  /**
   * This method returns an object containing the border thicknesses and the
   * border colour.
   *
   * @return an object containing the border thicknesses and the border colour.
   */
  Model.prototype.getBorder = function () {
    return attrs.get(this).border;
  };

  /**
   * This method sets the border thicknesses. If any of the arguments are null
   * or undefined, the corresponding value is left alone.
   *
   * @param top    the new thickness of the top border.
   * @param right  the new thickness of the right border.
   * @param bottom the new thickness of the bottom border.
   * @param left   the new thickness of the left border.
   */
  Model.prototype.setBorder = function (top, right, bottom, left) {
    var maxX = attrs.get(this).size.getWidth() / (2 * (attrs.get(this).cols + 1));
    var maxY = attrs.get(this).size.getHeight() / (2 * (attrs.get(this).rows + 1));
    var getBoundedVal = function (val, min, max) {
      return Math.max(min, Math.min(max, val));
    };

    if (top) attrs.get(this).border.top = getBoundedVal(parseFloat(top), 0, maxX);
    if (right) attrs.get(this).border.right = getBoundedVal(parseFloat(right), 0, maxY);
    if (bottom) attrs.get(this).border.bottom = getBoundedVal(parseFloat(bottom), 0, maxX);
    if (left) attrs.get(this).border.left = getBoundedVal(parseFloat(left), 0, maxY);
    priv.get(this).rebuildGroups();
    priv.get(this).notifyObservers();
  };

  /**
   * This method sets the border colour. This colour should be specified as
   * a css string.
   *
   * @param color the new border colour.
   */
  Model.prototype.setBorderColor = function (color) {
    this.saveState();

    attrs.get(this).border.color = color;
    priv.get(this).notifyObservers();
  };

  /**
   * This method returns the current orientation of the image.
   *
   * @return the current orientation of the image.
   */
  Model.prototype.getOrientation = function () {
    return attrs.get(this).orientation;
  };

  /**
   * This method sets the orientation of the image.
   *
   * @param orientation the new orientation of the image.
   */
  Model.prototype.setOrientation = function (orientation) {
    this.saveState();

    var size = this.getSize();
    if (orientation == Orientation.LANDSCAPE) {
      var width = Math.max(size.getWidth(), size.getHeight());
      var height = Math.min(size.getWidth(), size.getHeight());
    } else {
      var width = Math.min(size.getWidth(), size.getHeight());
      var height = Math.max(size.getWidth(), size.getHeight());
    }
    attrs.get(this).size = new Rect(0, 0, width, height);
    attrs.get(this).orientation = orientation;
    priv.get(this).rebuildGroups();
    priv.get(this).notifyObservers();
  };

  /**
   * This method returns the array of Group objects defining the tiling of
   * the image.
   *
   * @return the array of Group objects defining the tiling of the image.
   */
  Model.prototype.getGroups = function () {
    return attrs.get(this).groups;
  };

  /**
   * This method adds the specified group to the model.
   *
   * @param group the group to add to the model.
   */
  Model.prototype.addGroup = function (group) {
    if (attrs.get(this).groups.indexOf(group) <= -1) {
      attrs.get(this).groups.push(group);
    }
  }

  /**
   * This method removes the specified group from the model.
   *
   * @param group the group to remove from the model.
   */
  Model.prototype.removeGroup = function (group) {
    var index = attrs.get(this).groups.indexOf(group);
    if (index > -1) attrs.get(this).groups.splice(index, 1);
  };

  /**
   * This method merges the specified groups, replacing them in the model
   * with a new group which is the combination of them.
   *
   * @param groups the list of groups to merge.
   */
  Model.prototype.mergeGroups = function (groups) {
    this.saveState();

    if (groups.length <= 0) return;
    var new_group = groups[0];
    this.removeGroup(groups[0]);
    for (var i = 1; i < groups.length; i++) {
      new_group = new_group.mergeWith(groups[i]);
      this.removeGroup(groups[i]);
    }
    this.addGroup(new_group);
    priv.get(this).notifyObservers([new_group]);
  };

  /**
   * This method splits the specified groups, replacing them in the model
   * with new groups which are the individual tiles of each group.
   *
   * @param groups the list of groups to split.
   */
  Model.prototype.splitGroups = function (groups) {
    this.saveState();

    if (groups.length <= 0) return;
    var new_groups = [];
    for (let group of groups) {
      var image = group.getImageData().getImage();
      var tiles = group.getTiles();
      this.removeGroup(group);
      for (let tile of tiles) {
        var new_group = new Group(
          new ImageData(image, tile),
          tile,
          [tile]
        );
        this.addGroup(new_group);
        new_groups.push(new_group);
      }
    }
    priv.get(this).notifyObservers(new_groups);
  };

  /**
   * This method updates the scale of the groups that use the CROP ImageFit.
   *
   * @param groups the groups whose image scale to update.
   * @param scale  the new scale; a value from 0 to 100.
   */
  Model.prototype.updateImageScale = function (groups, scale) {
    for (let group of groups) {
      group.getImageData().setImageScale(scale);
    }
    priv.get(this).notifyObservers();
  };

  /**
   * This method updates the ImageFit for the specified groups.
   *
   * @param groups    the groups whose ImageFit to update.
   * @param image_fit the new ImageFit of the specified groups.
   */
  Model.prototype.updateImageFit = function (groups, image_fit) {
    this.saveState();

    for (let group of groups) {
      if (image_fit != ImageFit.MIXTURE) {
        group.getImageData().setImageFit(image_fit);
      }
    }
    priv.get(this).notifyObservers(groups);
  };

  /**
   * This method updates the rotation for the specified groups.
   *
   * @param groups         the groups whose rotation to update.
   * @param image_rotation the new rotation of the specified groups.
   */
  Model.prototype.updateImageRotation = function (groups, image_rotation) {
    for (let group of groups) {
      group.getImageData().setImageRotation(image_rotation);
    }
    priv.get(this).notifyObservers();
  };

  /**
   * This method returns the object containing the default image sizes and
   * image orientations.
   *
   * @return the object containing the default image sizes and image
   *         orientations.
   */
  Model.prototype.getDefaults = function () {
    return attrs.get(this).defaults;
  };

  /**
   * This method allows an object to register as an observer to this model.
   *
   * @param observer the object wishing to observe this model.
   */
  Model.prototype.registerObserver = function (observer) {
    if (observer) priv.get(this).observers.push(observer);
  };

  /**
   * This method allows an object to unregister as an observer to this model.
   *
   * @param observer the object wishing to stop observing this model.
   */
  Model.prototype.unregisterObserver = function (observer) {
    var index = priv.get(this).observers.indexOf(observer);
    if (index >= 0) priv.get(this).observers.splice(index, 1);
  };

  /**
   * This method resets this model, and then re-draws the view.
   */
  Model.prototype.discard = function () {
    var observers = priv.get(this).observers;
    attrs.delete(this);
    priv.delete(this);
    Model.call(this, defaults);
    priv.get(this).observers = observers;
    priv.get(this).notifyObservers(true);
  };

  /**
   * This method returns an object representation of this model suitable for
   * saving.
   *
   * @return an object representation of this model suitable for saving.
   */
  Model.prototype.toObject = function () {
    var model = attrs.get(this);

    var groups = [];
    for (let group of model.groups) {
      groups.push(group.toObject());
    }

    return {
      "size": model.size.toObject(),
      "raw_size": model.raw_size,
      "rows": model.rows,
      "cols": model.cols,
      "border": model.border,
      "groups": groups,
      "defaults": model.defaults,
      "orientation": model.orientation
    };
  };

  /**
   * This method sets the values in the specified object.
   *
   * @param object the object specifying the values to be set.
   */
  Model.prototype.fromObject = function (object) {
    var size = new Rect();
    size.fromObject(object.size);
    attrs.get(this).size = size;
    attrs.get(this).raw_size = object.raw_size;

    attrs.get(this).rows = object.rows;
    attrs.get(this).cols = object.cols;
    attrs.get(this).border = object.border;

    attrs.get(this).groups = [];
    for (let group of object.groups) {
      var new_group = new Group();
      new_group.fromObject(group);
      attrs.get(this).groups.push(new_group);
    }

    attrs.get(this).defaults = object.defaults;
    attrs.get(this).orientation = object.orientation;

    priv.get(this).notifyObservers(true);
  };

  /**
   * This method returns the current file associated with this model.
   *
   * @return the current file associated with this model.
   */
  Model.prototype.getFile = function () {
    return priv.get(this).file;
  };

  /**
   * This method sets the current file associated with this model.
   *
   * @param file the new file to be associated with this model.
   */
  Model.prototype.setFile = function (file) {
    priv.get(this).file = file;
  };

  /**
   * This method saves the current state so that it can be restored at a later
   * date.
   *
   * @param notify the boolean which decides whether to notify observers.
   */
  Model.prototype.saveState = function (notify) {
    priv.get(this).undo_queue.push(JSON.stringify(this.toObject()));
    priv.get(this).redo_queue = [];

    if (notify) priv.get(this).notifyObservers();
  };

  /**
   * This method returns true if there are any changes that can be un-done.
   *
   * @return true if there are any changes that can be un-done.
   */
  Model.prototype.canUndo = function () {
    return priv.get(this).undo_queue.length > 0;
  };

  /**
   * This method un-does the last change, and puts it on the redo queue. If
   * there is no last change to undo, it does nothing.
   */
  Model.prototype.undo = function () {
    if (this.canUndo()) {
      var change = priv.get(this).undo_queue.pop();
      priv.get(this).redo_queue.push(JSON.stringify(this.toObject()));

      this.fromObject(JSON.parse(change));

      if (window.saveState) window.saveState();
      priv.get(this).notifyObservers();
    }
  };

  /**
   * This method returns true if there are any changes that can be re-done.
   *
   * @return true if there are any changes that can be re-done.
   */
  Model.prototype.canRedo = function () {
    return priv.get(this).redo_queue.length > 0;
  };

  /**
   * This method re-does the last un-done change, and puts it on the undo queue.
   * If there is no change to be re-done, it does nothing.
   */
  Model.prototype.redo = function () {
    if (this.canRedo()) {
      var change = priv.get(this).redo_queue.pop();
      priv.get(this).undo_queue.push(JSON.stringify(this.toObject()));

      this.fromObject(JSON.parse(change));

      if (window.saveState) window.saveState();
      priv.get(this).notifyObservers();
    }
  };

  return Model;
}());
