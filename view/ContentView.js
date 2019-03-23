const SelectedActionView = require("./SelectedActionView");
const Rect = require("../model/Rect");

const debug = false;

/**
 * This defines the view to display the tiles.
 */
module.exports = (function () {
  var attrs = new WeakMap();

  /**
   * This constructs a new ContentView object.
   *
   * @param model the object which contains all of the data needed to
   *              display the tiles.
   */
  function ContentView (model) {
    var self = this;
    attrs.set(this, {
      canvas: document.getElementById("content-display"),
      displaySize: undefined,
      scale: undefined,
      selected_view: new SelectedActionView(),
      move_info: undefined,
      /**
       * This method calculates the maximum size the content display can
       * display at whilst maintaining a minimum of a 5% border.
       */
      calculateScale: function () {
        var content = document.getElementsByClassName("content")[0];
        var size = model.getSize();
        this.scale = Math.min(
          (content.clientWidth * 0.95) / size.getWidth(),
          (content.clientHeight * 0.95) / size.getHeight()
        );
        this.displaySize = new Rect(
          0,
          0,
          size.getWidth() * this.scale,
          size.getHeight() * this.scale
        );
      },
      /**
       * This method returns the group that was clicked on.
       *
       * @param event the event containing the location of the click.
       */
      getGroup: function (event) {
        var point = {
          x: self.unScale(event.offsetX),
          y: self.unScale(event.offsetY)
        };
        var groups = model.getGroups();
        for (let group of groups) {
          if (group.getBoundingBox().contains(point)) {
            for (let tile of group.getTiles()) {
              if (tile.contains(point)) return group;
            }
          }
        }
        return null;
      }
    });
    window.addEventListener("resize", function () {
      self.notify(model);
    });
    // Add listeners for moving image around in group.
    attrs.get(this).canvas.addEventListener("mousedown", function (event) {
      if (event.which == 1) {
        // 1: Left-Click, 2: Middle-Click, 3: Right-Click
        model.saveState(true);
        attrs.get(self).move_info = {
          x: event.offsetX,
          y: event.offsetY,
          group: attrs.get(self).getGroup(event)
        };
      }
    });
    attrs.get(this).canvas.addEventListener("mousemove", function (event) {
      var move_info = attrs.get(self).move_info;
      if (event.which == 1 && move_info && move_info.group) {
        move_info.group.getImageData().updatePosition(
          self.unScale(move_info.x - event.offsetX),
          self.unScale(move_info.y - event.offsetY)
        );
        attrs.get(self).move_info.x = event.offsetX;
        attrs.get(self).move_info.y = event.offsetY;
        self.notify(model);
      }
    });
    attrs.get(this).canvas.addEventListener("mouseup", function (event) {
      if (event.which == 1 && attrs.get(self).move_info) {
        window.saveState();
        attrs.get(self).move_info = undefined;
      }
    });
    // Add listener for selecting group.
    attrs.get(this).canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      var group = attrs.get(self).getGroup(event);
      if (!event.ctrlKey && !event.shiftKey) {
        attrs.get(self).selected_view.emptySelection();
      }
      if (attrs.get(self).selected_view.isSelected(group)) {
        attrs.get(self).selected_view.removeSelectedGroup(group);
      } else {
        attrs.get(self).selected_view.addSelectedGroup(group);
      }
      self.notify(model);
    });
    // Add listeners to empty the current selection.
    // Needed, so only clicks outside the canvas clear the selection.
    attrs.get(this).canvas.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    document.getElementsByClassName("content")[0].addEventListener(
      "click",
      function () {
        if (attrs.get(self).selected_view.getGroups().length > 0) {
          attrs.get(self).selected_view.emptySelection();
          self.notify(model);
        }
      }
    );
    this.notify(model);
    model.registerObserver(this);
  }

  /**
   * This method shows the selected action view.
   */
  ContentView.prototype.showSelectedActionView = function () {
    attrs.get(this).selected_view.show();
  };

  /**
   * This method updates the scale readout.
   */
  ContentView.prototype.updateScaleReadout = function () {
    attrs.get(this).selected_view.updateScaleReadout();
  };

  /**
   * This method returns the list of selected groups.
   *
   * @return the list of selected groups.
   */
  ContentView.prototype.getSelection = function () {
    return attrs.get(this).selected_view.getGroups();
  };

  /**
   * This method empties the selected groups list.
   */
  ContentView.prototype.emptySelection = function () {
    attrs.get(this).selected_view.emptySelection();
  };

  /**
   * This method is called by the model when we need to re-draw the view.
   *
   * @param model  the object containing all of the data needed to draw the view.
   * @param groups either true, speifying that the selected list should be
   *               emptied; or, the list of groups to add to the selected list.
   */
  ContentView.prototype.notify = function (model, groups) {
    if (groups === true) {
      // Hide the selected action view.
      this.emptySelection();
    } else if (groups) {
      // Select the groups in the groups parameter.
      this.emptySelection();
      for (let group of groups) {
        attrs.get(this).selected_view.addSelectedGroup(group);
      }
    }
    // Make sure we have the correct sized view port with the correct scaling.
    attrs.get(this).calculateScale();
    var display_size = attrs.get(this).displaySize;
    var canvas = attrs.get(this).canvas;
    // This is to fix a bug where the canvas is not resized in the page if one
    // of the sizes stays the same.
    canvas.width = 0;
    canvas.height = 0;
    // Set the size of the canvas, this automatically clears it for us.
    var border = model.getBorder();
    // We add 0.5 here to account for the rounding errors.
    canvas.width = display_size.getWidth() + 0.5;
    canvas.height = display_size.getHeight() + 0.5;
    var context = canvas.getContext("2d");
    // Draw the background colour.
    context.fillStyle = border.color;
    context.fillRect(0,
                     0,
                     display_size.getWidth(),
                     display_size.getHeight());
    // Draw the groups.
    this.drawGroups(context, model.getGroups(), model.getBorder());
  };

  /**
   * This method is called by the controller when we want to draw the full
   * size image to be saved.
   *
   * @param model  the object containing all of the data needed to draw the
   *               view.
   * @param canvas the full-size canvas that we are drawing to.
   */
  ContentView.prototype.save = function (model, canvas) {
    // Set the scale to 1, so we are drawing the full size image.
    attrs.get(this).scale = 1;
    var display_size = model.getSize();
    // Set the size of the canvas, this automatically clears it for us.
    var border = model.getBorder();
    // We add 0.5 here to account for the rounding errors.
    canvas.width = display_size.getWidth() + 0.5;
    canvas.height = display_size.getHeight() + 0.5;
    var context = canvas.getContext("2d");
    // Draw the background colour.
    context.fillStyle = border.color;
    context.fillRect(0,
                     0,
                     display_size.getWidth(),
                     display_size.getHeight());
    // Draw the groups.
    this.drawGroups(context, model.getGroups(), model.getBorder(), true);
  };

  /**
   * This method draws all of the groups to the canvas.
   *
   * @param context the canvas context to draw to.
   * @param groups  the array of groups to draw.
   * @param border  the object containing the information about the border
   *                thicknesses.
   * @param save    the boolean which decides whether to draw the image for
   *                saving or for editing.
   */
  ContentView.prototype.drawGroups = function (context, groups, border, save) {
    for (let group of groups) {
      if (debug) this.drawDebugGroup(context, group, border, save);
      else if (group.getImageData().getImage()) this.drawGroup(context, group, border, save);
      else this.drawEmptyGroup(context, group, border, save);
    }
  };

  /**
   * This method draws the group in debug mode, highlighting which group a tile
   * belongs to and whether the tile is top,left,bottom or right-most.
   *
   * @param context the canvas context to draw to.
   * @param group   the group to draw.
   * @param border  the object containing the information about the border
   *                thicknesses.
   * @param save    the boolean which decides whether to draw the image for
   *                saving or for editing.
   */
  ContentView.prototype.drawDebugGroup = function (context, group, border, save) {
    var tiles = group.getTiles();

    for (let tile of tiles) {
      context.fillStyle = "#000000";
      context.fillRect(
        this.scale(tile.getX()),
        this.scale(tile.getY()),
        this.scale(tile.getWidth()),
        this.scale(tile.getHeight())
      );
      if (group.isTopMost(tile)) {
        context.fillStyle = "#52BFFF";
        context.fillRect(
          this.scale(tile.getX()),
          this.scale(tile.getY()),
          this.scale(tile.getWidth()),
          this.scale(4)
        );
      }
      if (group.isRightMost(tile)) {
        context.fillStyle = "#FF5757";
        context.fillRect(
          this.scale(tile.getX() + tile.getWidth() - 4),
          this.scale(tile.getY()),
          this.scale(4),
          this.scale(tile.getHeight())
        );
      }
      if (group.isBottomMost(tile)) {
        context.fillStyle = "#E8A241";
        context.fillRect(
          this.scale(tile.getX()),
          this.scale(tile.getY() + tile.getHeight() - 4),
          this.scale(tile.getWidth()),
          this.scale(4)
        );
      }
      if (group.isLeftMost(tile)) {
        context.fillStyle = "#995DE8";
        context.fillRect(
          this.scale(tile.getX()),
          this.scale(tile.getY()),
          this.scale(4),
          this.scale(tile.getHeight())
        );
      }

      var bb = group.getBoundingBox();
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.fillText(
        bb.getX() + "\n" + bb.getY() + "\n" + bb.getWidth() + "\n" + bb.getHeight(),
        this.scale(tile.getX() + tile.getWidth() / 2),
        this.scale(tile.getY() + tile.getHeight() / 2)
      );
    }
  };

  /**
   * This method draws a single group to the canvas.
   *
   * @param context the canvas context to draw to.
   * @param group   the group to draw.
   * @param border  the object containing the information about the border
   *                thicknesses.
   * @param save    the boolean which decides whether to draw the image for
   *                saving or for editing.
   */
  ContentView.prototype.drawGroup = function (context, group, border, save) {
    var tiles = group.getTiles();

    var canvas = group.getImageData().prepare(attrs.get(this).scale);

    for (let tile of tiles) {
      var x = tile.getX() + (group.isLeftMost(tile) ? border.left : 0);
      var y = tile.getY() + (group.isTopMost(tile) ? border.top : 0);
      var width = tile.getWidth() - (group.isLeftMost(tile) ? border.left : 0)
                  - (group.isRightMost(tile) ? border.right : 0);
      var height = tile.getHeight() - (group.isTopMost(tile) ? border.top : 0)
                  - (group.isBottomMost(tile) ? border.bottom : 0);

      var cRect = group.getImageData().getCRect(new Rect(x, y, width, height));
      context.drawImage(
        canvas,
        this.scale(cRect.getX()),
        this.scale(cRect.getY()),
        this.scale(cRect.getWidth()),
        this.scale(cRect.getHeight()),
        this.scale(x),
        this.scale(y),
        this.scale(width),
        this.scale(height)
      );
      if (!save) this.drawSelectedDot(context,
                                      group,
                                      x,
                                      y,
                                      width,
                                      height,
                                      border);
    }
    for (let tile of tiles) {
      this.drawTileBorder(context, group, tile, border);
    }
  };

  /**
   * This method draws a single group to the canvas. This draws groups that
   * have no image. It only draws a prompt for the first tile in the group.
   *
   * @param context the canvas context to draw to.
   * @param group   the group to draw.
   * @param border  the object containing the information about the border
   *                thicknesses.
   * @param save    the boolean which decides whether to draw the image for
   *                saving or for editing.
   */
  ContentView.prototype.drawEmptyGroup = function (context, group, border, save) {
    var tiles = group.getTiles();

    for (let tile of tiles) {
      var x = tile.getX() + (group.isLeftMost(tile) ? border.left : 0);
      var y = tile.getY() + (group.isTopMost(tile) ? border.top : 0);
      var width = tile.getWidth() - (group.isLeftMost(tile) ? border.left : 0)
                  - (group.isRightMost(tile) ? border.right : 0);
      var height = tile.getHeight() - (group.isTopMost(tile) ? border.top : 0)
                  - (group.isBottomMost(tile) ? border.bottom : 0);
      context.fillStyle = "#1F1F1F";
      context.fillRect(
        this.scale(x),
        this.scale(y),
        this.scale(width),
        this.scale(height)
      );

      if (tile == tiles[0]) {
        // Draw the icon.
        context.fillStyle = "white";
        context.textAlign = "center";
        var fontSize = this.scale(
          Math.min(width, height) / 4
        );
        context.font = fontSize + "px Material Icons";
        context.fillText(
          "photo_size_select_actual",
          this.scale(x + width / 2),
          this.scale(y + height / 2)
        );
        // Draw the message.
        var message = "Right Click to Select";
        context.font = Math.min(
          fontSize / 2,
          this.scale(width) / message.length
        ) + "px Roboto";
        context.fillText(
          message,
          this.scale(x + width / 2),
          this.scale(y + height / 2) + fontSize
        );
      }
      if (!save) this.drawSelectedDot(context,
                                      group,
                                      x,
                                      y,
                                      width,
                                      height,
                                      border);
    }
    for (let tile of tiles) {
      this.drawTileBorder(context, group, tile, border);
    }
  };

  /**
   * This method draws the border for a tile if it has one.
   *
   * @param context the canvas context to draw to.
   * @param group   the group the tile belongs to.
   * @param tile    the tile whose border to draw.
   * @param border  the object containing the information about the border
   *                thicknesses.
   */
  ContentView.prototype.drawTileBorder = function (context,
                                                   group,
                                                   tile,
                                                   border) {
    context.fillStyle = border.color;
    if (group.isTopMost(tile)) {
      // Draw top border.
      context.fillRect(
        this.scale(tile.getX() - border.right),
        this.scale(tile.getY()),
        this.scale(tile.getWidth() + border.left + border.right),
        this.scale(border.top)
      );
    }
    if (group.isRightMost(tile)) {
      // Draw right border.
      context.fillRect(
        this.scale(tile.getX() + tile.getWidth() - border.right),
        this.scale(tile.getY() - border.bottom),
        this.scale(border.right),
        this.scale(tile.getHeight() + border.top + border.bottom)
      );
    }
    if (group.isBottomMost(tile)) {
      // Draw bottom border.
      context.fillRect(
        this.scale(tile.getX() - border.right),
        this.scale(tile.getY() + tile.getHeight() - border.bottom),
        this.scale(tile.getWidth() + border.left + border.right),
        this.scale(border.bottom)
      );
    }
    if (group.isLeftMost(tile)) {
      // Draw left border.
      context.fillRect(
        this.scale(tile.getX()),
        this.scale(tile.getY() - border.bottom),
        this.scale(border.left),
        this.scale(tile.getHeight() + border.top + border.bottom)
      );
    }
  };

  /**
   * This method draws a dot in the corner of the specified group if the
   * specified group is selected.
   *
   * @param context the context to draw to.
   * @param group   the group to draw the dot for.
   * @param x       the x-coordinate of the group.
   * @param y       the y-coordinate of the group.
   * @param width   the width of the group.
   * @param height  the height of the group.
   * @param border  the border of the group.
   */
  ContentView.prototype.drawSelectedDot = function (context,
                                                    group,
                                                    x,
                                                    y,
                                                    width,
                                                    height,
                                                    border) {
    if (attrs.get(this).selected_view.isSelected(group)) {
      context.fillStyle = "#456CAD";
      context.beginPath();
      var radius = Math.min(
        5,
        Math.min(
          this.scale(width / 2),
          this.scale(height / 2)
        )
      );
      context.arc(
        this.scale(x) + radius * 2,
        this.scale(y + height) - radius * 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  };

  /**
   * This method scales the specified value such that it fits into the view.
   *
   * @param value the value to scale.
   * @return      the scaled value, so it fits into the view.
   */
  ContentView.prototype.scale = function (value) {
    return attrs.get(this).scale * value;
  };

  /**
   * This method un-scales the specified value such that it fits into the
   * original image.
   *
   * @param value the value to un-scale.
   * @return      the un-scaled value, so it fits into the original image.
   */
  ContentView.prototype.unScale = function (value) {
    return value / attrs.get(this).scale;
  };

  return ContentView;
}());
