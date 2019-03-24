const Model = require("./model/Model");
const ContentView = require("./view/ContentView");
const SettingsView = require("./view/SettingsView");
const CustomSizeView = require("./view/CustomSizeView");
const ErrorView = require("./view/ErrorView");
const Controller = require("./controller/Controller");
const defaults = require("./defaults");

/**
 * This creates all of the objects needed to run the app.
 */
window.addEventListener("load", function() {
    const model = new Model(defaults);
    const content = new ContentView(model);
    const settings = new SettingsView(model);
    new Controller(model, content, settings, new CustomSizeView(), new ErrorView());
});
