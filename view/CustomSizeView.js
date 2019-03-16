"use strict";

/**
 * This defines the custom size view.
 */
var CustomSizeView = (function () {

  /**
   * This constructs a new CustomSizeView object.
   */
  function CustomSizeView () {}

  /**
   * This method shows the custom size view and sets the default values.
   */
  CustomSizeView.prototype.show = function () {
    var self = this;
    chrome.storage.sync.get({"custom-sizes": []}, function (items) {
      var custom_size = document.getElementById("custom-size");
      while (custom_size.firstChild) custom_size.removeChild(custom_size.firstChild);
      var sizes = items["custom-sizes"];

      var defaultSize = {
        "name": "",
        "width-mm": 0,
        "height-mm": 0,
        "ppi": 300
      };

      var option = document.createElement("option");
      option.value = "New Size";
      option.data = defaultSize;
      option.appendChild(document.createTextNode("New Size..."));
      custom_size.appendChild(option);

      for (let size of sizes) {
        var option = document.createElement("option");
        option.value = size.name;
        option.data = size;
        option.appendChild(document.createTextNode(size.name));
        custom_size.appendChild(option);
      }

      self.setSize(defaultSize, false);
      var custom_size = document.getElementsByClassName("custom-size")[0];
      custom_size.classList.add("visible");
    });
  };

  /**
   * This method hides the custom size view.
   */
  CustomSizeView.prototype.hide = function () {
    var custom_size = document.getElementsByClassName("custom-size")[0];
    custom_size.classList.remove("visible");
  };

  /**
   * This method returns the values of each of the inputs in this view.
   *
   * @return the values of each of the inputs in this view.
   */
  CustomSizeView.prototype.getSize = function () {
    return {
      "name":      document.getElementById("custom-name").value,
      "width-mm":  document.getElementById("custom-width").value,
      "height-mm": document.getElementById("custom-height").value,
      "ppi":       document.getElementById("custom-ppi").value
    };
  };

  /**
   * This method sets the values of each of the inputs in this view.
   *
   * @param size          the object containing the new values of each of the
   *                      inputs in this view.
   * @param enableDiscard the boolean which decides whether to enable the
   *                      discard button.
   */
  CustomSizeView.prototype.setSize = function (size, enableDiscard) {
    document.getElementById("custom-name").value = size["name"];
    document.getElementById("custom-width").value = size["width-mm"];
    document.getElementById("custom-height").value = size["height-mm"];
    document.getElementById("custom-ppi").value = size["ppi"];

    var display = "none";
    if (enableDiscard) display = "inline-flex";
    document.getElementById("custom-discard").style.display = display;
  };

  return CustomSizeView;
}());
