"use strict";

/**
 * This defines the settings view.
 */
var SettingsView = (function () {

  /**
   * This constructs a new SettingsView object. It first sets the default values
   * for the inputs, then adds the listeners for the inputs.
   *
   * @param config the object containing the default values for the inputs.
   */
  function SettingsView (model) {
    var self = this;
    this.initialise(model);
    model.registerObserver({
      notify: function () {
        self.initialise(model);
      }
    });
  }

  /**
   * This method iterates over the config object, setting the default values
   * of all of the inputs. It also sets their input listeners.
   *
   * @param model the object containing the default values for the inputs.
   */
  SettingsView.prototype.initialise = function (model) {
    var self = this;
    var defaults = model.getDefaults();

    chrome.storage.sync.get({"custom-sizes": []}, function (items) {
      var image_size = document.getElementById("image-size");
      while (image_size.firstChild) image_size.removeChild(image_size.firstChild);
      var customSizes = items["custom-sizes"];

      var sizes = defaults["image-sizes"].concat(customSizes);
      for (let size of sizes) {
        var option = document.createElement("option");
        option.value = size.name;
        option.data = size;
        option.appendChild(document.createTextNode(size.name));
        image_size.appendChild(option);
      }
      var option = document.createElement("option");
      option.value = "Custom Size";
      option.appendChild(document.createTextNode("Custom Size..."));
      image_size.appendChild(option);

      var selected = model.getRawSize();
      if (selected) {
        if (!sizes.find(function (val) {
          return val["name"] == selected["name"]
              && val["width-mm"] == selected["width-mm"]
              && val["height-mm"] == selected["height-mm"]
              && val["ppi"] == selected["ppi"];
        })) {
          customSizes.push(selected);
          customSizes.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          chrome.storage.sync.set({"custom-sizes": customSizes}, function () {
            self.initialise(model);
          });
        }

        image_size.selectedIndex = sizes.findIndex(function (val) {
          return val["name"] == selected["name"]
              && val["width-mm"] == selected["width-mm"]
              && val["height-mm"] == selected["height-mm"]
              && val["ppi"] == selected["ppi"];
        });
      } else {
        image_size.selectedIndex = defaults["image_size"];
      }
      image_size.prev = image_size.selectedIndex;
    });

    var image_orientation = document.getElementById("image-orientation");
    while (image_orientation.firstChild)
      image_orientation.removeChild(image_orientation.firstChild);
    for (let orientation in defaults["image-orientations"]) {
      var option = document.createElement("option");
      option.value = defaults["image-orientations"][orientation];
      option.appendChild(
        document.createTextNode(defaults["image-orientations"][orientation])
      );
      image_orientation.appendChild(option);
    }
    image_orientation.value = model.getOrientation();

    var grid_rows = document.getElementById("grid-rows");
    grid_rows.value = model.getRows();

    var grid_cols = document.getElementById("grid-cols");
    grid_cols.value = model.getCols();

    var border = model.getBorder();

    var border_top = document.getElementById("border-top-size");
    border_top.value = border.top;

    var border_right = document.getElementById("border-right-size");
    border_right.value = border.right;

    var border_bottom = document.getElementById("border-bottom-size");
    border_bottom.value = border.bottom;

    var border_left = document.getElementById("border-left-size");
    border_left.value = border.left;

    var border_color = document.getElementById("border-color");
    border_color.value = border.color;
  };

  return SettingsView;
}());
