const ProgressView = require("../view/ProgressView");
const Orientation = require("../model/enums/Orientation");
const defaults = require("../defaults");
const {settings, saveImage, loadImage, saveFile, loadFile} = require("../model/Storage");

/**
 * This sets up all of the listeners for the controls in the settings pane.
 */
module.exports = (function() {
    /**
     * This constructs a new Controller object. This sets up all of the
     * listeners for the controls in the settings pane.
     *
     * @param model          the object containing the information to be updated
     *                       by the settings items.
     * @param contentView    the object that draws the content view.
     * @param settingsView   the object that draws the settings view.
     * @param customSizeView the object that draws the custom size view.
     * @param errorView      the object that draws the error view.
     */
    function Controller(model, contentView, settingsView, customSizeView, errorView) {
        var saveObserver = {
            notify: function() {
                window.saveState();
            }
        };

        var errorHandler = function(err) {
            if (err) {
                errorView.show(
                    "There was an error completing that I/O action, please try again.",
                    err.name + ": " + err.message
                );
                model.setFile(undefined);
            }
        };

        var saveProgress = new ProgressView("save-progress");
        var saveFunc = function(filename, callback) {
            const contents = JSON.stringify(model.toObject());
            saveFile(filename, contents)
                .then(actual_filename => {
                    model.setFile(actual_filename);
                    if (callback) {
                        callback();
                    } else {
                        saveProgress.end();
                    }
                })
                .catch(errorHandler);
            if (!callback) saveProgress.start();
        };

        initContentView(model, contentView, saveObserver, errorView, errorHandler, saveFunc);
        initSettingsView(model, settingsView, customSizeView, saveObserver);
        initCustomSizeView(model, customSizeView, settingsView);
        initErrorView(errorView);
        initKeyboardShortcuts(model, saveFunc);
        initUndoListeners(model);
    }

    /**
     * This function initialises the actions above the content view.
     *
     * @param model        the model whose methods to call.
     * @param contentView  the content view whose methods to call.
     * @param saveObserver the object which can be registered with the model
     *                     to save the state when a change occurs.
     * @param errorView    the error view whose methods to call.
     * @param errorHandler the function which displays errors to the user.
     * @param saveFunc     the function which saves the current state to disk.
     */
    var initContentView = function(model, contentView, saveObserver, errorView, errorHandler, saveFunc) {
        window.saveState = function(callback) {
            saveFunc(model.getFile(), callback);
        };

        // Set up the listeners for the action bar.
        var toggleSidebar = function(sidebar) {
            var spans = sidebar.getElementsByTagName("span");
            var content = document.getElementsByClassName("content")[0];
            sidebar.classList.toggle("open");
            for (let i = 0; i < spans.length; i++) {
                spans[i].classList.toggle("open");
            }
            content.classList.toggle("open");
            contentView.notify(model);
        };

        const sidebar = document.getElementsByClassName("sidebar")[0];
        if (sidebar.classList.contains("open") != settings.get("sidebar_open", true)) {
            toggleSidebar(sidebar);
        }

        var menu = document.getElementById("menu");
        menu.addEventListener("click", function() {
            const sidebar = document.getElementsByClassName("sidebar")[0];
            toggleSidebar(sidebar);
            const sidebar_open = sidebar.classList.contains("open");
            settings.set("sidebar_open", sidebar_open);
        });

        var undo = document.getElementById("undo");
        undo.addEventListener("click", function() {
            model.undo();
        });
        model.registerObserver({
            notify: function() {
                if (model.canUndo()) {
                    undo.classList.remove("disabled");
                } else {
                    undo.classList.add("disabled");
                }
            }
        });
        var redo = document.getElementById("redo");
        redo.addEventListener("click", function() {
            model.redo();
        });
        model.registerObserver({
            notify: function() {
                if (model.canRedo()) {
                    redo.classList.remove("disabled");
                } else {
                    redo.classList.add("disabled");
                }
            }
        });

        var loadProgress = new ProgressView("load-progress");
        var load = document.getElementById("load");
        load.addEventListener("click", function() {
            model.unregisterObserver(saveObserver);
            loadFile()
                .then(({filename, contents}) => {
                    model.discard();
                    model.setFile(filename);
                    model.fromObject(JSON.parse(contents));
                    model.registerObserver(saveObserver);
                    loadProgress.end();
                })
                .catch(errorHandler);
            loadProgress.start();
        });

        var save = document.getElementById("save");
        save.addEventListener("click", function() {
            saveFunc(model.getFile());
        });
        save.addEventListener("contextmenu", function() {
            // Perform save as operation.
            saveFunc();
        });

        var downloadProgress = new ProgressView("export-progress");
        var download = document.getElementById("export");
        download.addEventListener("click", function() {
            const canvas = document.createElement("canvas");
            contentView.save(model, canvas);
            saveImage(canvas)
                .then(() => downloadProgress.end())
                .catch(errorHandler);
            downloadProgress.start();
        });

        var print = document.getElementById("print");
        print.addEventListener("click", function() {
            var iframe = document.createElement("iframe");
            document.body.appendChild(iframe);

            var rawSize = model.getRawSize();
            var landscape = model.getOrientation() == Orientation.LANDSCAPE;

            var width = landscape ? rawSize["height-mm"] : rawSize["width-mm"];
            var height = landscape ? rawSize["width-mm"] : rawSize["height-mm"];

            var styleEl = document.createElement("style");
            iframe.contentDocument.head.appendChild(styleEl);
            var styleSheet = styleEl.sheet;
            styleSheet.insertRule("@page { size: " + width + "mm " + height + "mm; margin: 0mm; }", 0);
            styleSheet.insertRule("html, body { width: 100%; height: 100%; margin: 0px; }", 1);
            styleSheet.insertRule("img { width: 100%; height: 100%; margin: 0px; }", 2);

            var canvas = document.createElement("canvas");
            contentView.save(model, canvas);
            var image = document.createElement("img");
            image.src = canvas.toDataURL("image/png");

            iframe.contentDocument.body.appendChild(image);
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        });

        var discard = document.getElementById("discard");
        discard.addEventListener("click", function() {
            window.saveState(function() {
                model.discard();
            });
        });

        // Set up listeners for the selected action view.
        var join = document.getElementById("join");
        join.addEventListener("click", function() {
            model.mergeGroups(contentView.getSelection());
        });
        var split = document.getElementById("split");
        split.addEventListener("click", function() {
            model.splitGroups(contentView.getSelection());
        });
        var imageProgress = new ProgressView("image-progress");
        var choose_image = document.getElementById("choose-image");
        choose_image.addEventListener("click", function() {
            loadImage()
                .then(image => {
                    model.setImage(contentView.getSelection(), image);
                    model.registerObserver(saveObserver);
                    imageProgress.end();
                    contentView.showSelectedActionView();
                })
                .catch(errorHandler);
            imageProgress.start();
        });
        var crop_scale = document.getElementById("crop-scale");
        crop_scale.addEventListener("input", function() {
            model.updateImageScale(contentView.getSelection(), crop_scale.value);
            contentView.updateScaleReadout();
        });
        var image_fit = document.getElementById("image-fit");
        image_fit.addEventListener("change", function() {
            model.updateImageFit(contentView.getSelection(), image_fit.value);
        });
        var image_rotation = document.getElementById("image-rotation");
        image_rotation.addEventListener("input", function() {
            model.unregisterObserver(saveObserver);
            model.updateImageRotation(contentView.getSelection(), image_rotation.value);
        });
        image_rotation.addEventListener("blur", function() {
            model.registerObserver(saveObserver);
            window.saveState();
        });
    };

    /**
     * This function initialises the actions in the settingsView.
     *
     * @param model          the model whose methods to call.
     * @param settingsView   the settings view whose actions to initialise.
     * @param customSizeView the custom size view whose methods to call.
     * @param saveObserver   the object which can be registered with the model
     *                       to save the state when a change occurs.
     */
    var initSettingsView = function(model, settingsView, customSizeView, saveObserver) {
        var image_size = document.getElementById("image-size");
        image_size.addEventListener("input", function() {
            if (image_size.value == "Custom Size") {
                customSizeView.show();
            } else {
                customSizeView.hide();
                model.setSize(image_size.options[image_size.selectedIndex].data);
                image_size.prev = image_size.selectedIndex;
            }
        });
        var image_orientation = document.getElementById("image-orientation");
        image_orientation.addEventListener("input", function() {
            model.setOrientation(image_orientation.value);
        });
        var grid_rows = document.getElementById("grid-rows");
        grid_rows.addEventListener("input", function() {
            model.setRows(grid_rows.value);
        });
        var grid_cols = document.getElementById("grid-cols");
        grid_cols.addEventListener("input", function() {
            model.setCols(grid_cols.value);
        });

        var border_top_size = document.getElementById("border-top-size");
        border_top_size.addEventListener("input", function() {
            model.unregisterObserver(saveObserver);
            model.setBorder(border_top_size.value, null, null, null);
        });
        border_top_size.addEventListener("blur", function() {
            model.registerObserver(saveObserver);
            window.saveState();
        });
        var border_right_size = document.getElementById("border-right-size");
        border_right_size.addEventListener("input", function() {
            model.unregisterObserver(saveObserver);
            model.setBorder(null, border_right_size.value, null, null);
        });
        border_right_size.addEventListener("blur", function() {
            model.registerObserver(saveObserver);
            window.saveState();
        });
        var border_bottom_size = document.getElementById("border-bottom-size");
        border_bottom_size.addEventListener("input", function() {
            model.unregisterObserver(saveObserver);
            model.setBorder(null, null, border_bottom_size.value, null);
        });
        border_bottom_size.addEventListener("blur", function() {
            model.registerObserver(saveObserver);
            window.saveState();
        });
        var border_left_size = document.getElementById("border-left-size");
        border_left_size.addEventListener("input", function() {
            model.unregisterObserver(saveObserver);
            model.setBorder(null, null, null, border_left_size.value);
        });
        border_left_size.addEventListener("blur", function() {
            model.registerObserver(saveObserver);
            window.saveState();
        });
        var border_color = document.getElementById("border-color");
        border_color.addEventListener("input", function() {
            model.setBorderColor(border_color.value);
        });
    };

    /**
     * This function initialises the actions in the custom size view.
     *
     * @param model          the model whose methods to call.
     * @param customSizeView the custom size view whose actions to initialise.
     * @param settingsView   the settings view whose methods to call.
     */
    var initCustomSizeView = function(model, customSizeView, settingsView) {
        var custom_save = document.getElementById("custom-save");
        custom_save.addEventListener("click", function() {
            var size = customSizeView.getSize();
            if (size.name == "" || size["width-mm"] == 0 || size["height-mm"] == 0 || size.ppi == 0) return;

            let custom_sizes = settings.get("custom-sizes", []);
            custom_sizes = custom_sizes.filter(item => item.name != size.name);
            custom_sizes.push(size);
            custom_sizes.sort((a, b) => a.name.localeCompare(b.name));
            settings.set("custom-sizes", custom_sizes);
            customSizeView.hide();
            model.setSize(size);
        });
        var custom_discard = document.getElementById("custom-discard");
        custom_discard.addEventListener("click", function() {
            const selectedIndex = custom_size.selectedIndex - 1; // Sub 1 to remove "New Size...".
            const custom_sizes = settings.get("custom-sizes", []);
            custom_sizes.splice(selectedIndex, 1);
            settings.set("custom-sizes", custom_sizes);
            customSizeView.hide();
            if (document.getElementById("image-size").prev == defaults["image-sizes"].length + selectedIndex) {
                model.setSize(defaults["image-sizes"][defaults["image-size"]]);
            }
            settingsView.initialise(model);
        });
        var custom_cancel = document.getElementById("custom-cancel");
        custom_cancel.addEventListener("click", function() {
            customSizeView.hide();
            const image_size = document.getElementById("image-size");
            image_size.selectedIndex = image_size.prev;
        });
        var custom_size = document.getElementById("custom-size");
        custom_size.addEventListener("input", function() {
            const size = custom_size.options[custom_size.selectedIndex];
            customSizeView.setSize(size.data, size.value != "New Size");
        });
    };

    /**
     * This function initialises the actions in the error view.
     *
     * @param errorView the error view whose actions to initialise.
     */
    var initErrorView = function(errorView) {
        var close = document.getElementById("error-close");
        close.addEventListener("click", function() {
            errorView.hide();
        });
    };

    /**
     * This function sets up the keydown listeners so that when key-combinations
     * - ctrl-n Discard (i.e. new file)
     * - ctrl-o open
     * - ctrl-s Save
     * - ctrl-shift-s Save As
     * - ctrl-p Print
     * - ctrl-d Download
     * - ctrl-z undo
     * - ctrl-shift-z / ctrl-y Redo
     *
     * @param model    the model whose methods to call on keydown.
     * @param saveFunc the function which saves the current state to disk.
     */
    var initKeyboardShortcuts = function(model, saveFunc) {
        window.addEventListener("keydown", function(event) {
            var clickEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            if (event.ctrlKey) {
                switch (event.key) {
                    case "n":
                        document.getElementById("discard").dispatchEvent(clickEvent);
                        break;
                    case "o":
                        document.getElementById("load").dispatchEvent(clickEvent);
                        break;
                    case "s":
                        document.getElementById("save").dispatchEvent(clickEvent);
                        break;
                    case "S":
                        saveFunc();
                        break;
                    case "p":
                        document.getElementById("print").dispatchEvent(clickEvent);
                        break;
                    case "d":
                        document.getElementById("export").dispatchEvent(clickEvent);
                        break;
                    case "z":
                        model.undo();
                        break;
                    case "Z":
                    case "y":
                        model.redo();
                        break;
                }
            }
        });
    };

    /**
     * This function initialises the listeners that save the current state so that
     * the change that is about to be made can be reverted.
     *
     * @param model the model whose methods to call.
     */
    var initUndoListeners = function(model) {
        var save = function() {
            model.saveState();
        };
        document.getElementById("crop-scale").addEventListener("focus", save);
        document.getElementById("image-rotation").addEventListener("focus", save);
        document.getElementById("grid-rows").addEventListener("focus", save);
        document.getElementById("grid-cols").addEventListener("focus", save);
        document.getElementById("border-top-size").addEventListener("focus", save);
        document.getElementById("border-right-size").addEventListener("focus", save);
        document.getElementById("border-bottom-size").addEventListener("focus", save);
        document.getElementById("border-left-size").addEventListener("focus", save);
    };

    return Controller;
})();
