"use strict";

/**
 * This creates all of the objects needed to run the app.
 */
window.addEventListener("load", function () {
  var model = new Model(defaults);
  var content = new ContentView(model);
  var settings = new SettingsView(model);
  var customSize = new CustomSizeView();
  var error = new ErrorView();
  var controller = new Controller(model, content, settings, customSize, error);
});
