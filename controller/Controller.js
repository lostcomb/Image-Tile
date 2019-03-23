const ProgressView = require("../view/ProgressView");
const defaults = require("../defaults");

/**
 * This sets up all of the listeners for the controls in the settings pane.
 */
module.exports = (function () {

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
  function Controller (model,
                       contentView,
                       settingsView,
                       customSizeView,
                       errorView) {
    var saveObserver = {
      notify: function () {
        window.saveState();
      }
    };

    var errorHandler = function (err) {
      errorView.show(
        "There was an error completing that I/O action, please try again.",
        err.name + ": " + err.message
      );
      model.setFile("");
    };

    var saveProgress = new ProgressView("save-progress");
    var saveFunc = function (fileEntry, callback) {
      if (chrome.runtime.lastError) return;
      var blob = new Blob([JSON.stringify(model.toObject())], {type: "application/json"});
      fileEntry.createWriter(function (writer) {
        writer.onerror = errorHandler;
        writer.onwriteend = function (e) {
          writer.onwriteend = null;
          writer.truncate(e.currentTarget.position);
          model.setFile(chrome.fileSystem.retainEntry(fileEntry));
          if (callback) {
            callback();
          } else {
            saveProgress.end();
          }
        };
        if (!callback) saveProgress.start();
        writer.write(blob);
      }, errorHandler);
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
  var initContentView = function (model,
                                  contentView,
                                  saveObserver,
                                  errorView,
                                  errorHandler,
                                  saveFunc) {
    var loadProgress = new ProgressView("load-progress");
    var loadFunc = function (fileEntry) {
      if (chrome.runtime.lastError) return;
      model.unregisterObserver(saveObserver);
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onerror = errorHandler;
        reader.onloadend = function (e) {
          try {
            model.discard();
            model.setFile(chrome.fileSystem.retainEntry(fileEntry));
            model.fromObject(JSON.parse(e.target.result));
            model.registerObserver(saveObserver);
          } catch (err) {
            errorView.show(
              "The selected file is not a valid image tile state, " +
              "it may have been corrupted.",
              err.toString()
            );
            model.discard();
          }
          loadProgress.end();
        };
        loadProgress.start();
        reader.readAsText(file);
      });
    };

    window.saveState = function (callback) {
      chrome.fileSystem.isRestorable(model.getFile(), function (isRestorable) {
        if (isRestorable) {
          // Perform save operation.
          chrome.fileSystem.restoreEntry(model.getFile(), function (fileEntry) {
            saveFunc(fileEntry, callback);
          });
        } else {
          if (callback) callback();
        }
      });
    };

    // Set up the listeners for the action bar.
    chrome.storage.sync.get({ "sidebar_open": true }, function (items) {
      var sidebar = document.getElementsByClassName("sidebar")[0];
      if (sidebar.classList.contains("open") != items.sidebar_open) {
        toggleSidebar(sidebar);
      }
    });

    var toggleSidebar = function (sidebar) {
      var spans = sidebar.getElementsByTagName("span");
      var content = document.getElementsByClassName("content")[0];
      sidebar.classList.toggle("open");
      for (let i = 0; i < spans.length; i++) {
        spans[i].classList.toggle("open");
      }
      content.classList.toggle("open");
      contentView.notify(model);
    };

    var menu = document.getElementById("menu");
    menu.addEventListener("click", function () {
      var sidebar = document.getElementsByClassName("sidebar")[0];
      toggleSidebar(sidebar);
      var sidebar_open = sidebar.classList.contains("open");
      chrome.storage.sync.set({ "sidebar_open": sidebar_open });
    });

    var undo = document.getElementById("undo");
    undo.addEventListener("click", function () {
      model.undo();
    });
    model.registerObserver({
      notify: function () {
        if (model.canUndo()) {
          undo.classList.remove("disabled");
        } else {
          undo.classList.add("disabled");
        }
      }
    });
    var redo = document.getElementById("redo");
    redo.addEventListener("click", function () {
      model.redo();
    });
    model.registerObserver({
      notify: function () {
        if (model.canRedo()) {
          redo.classList.remove("disabled");
        } else {
          redo.classList.add("disabled");
        }
      }
    });

    var load = document.getElementById("load");
    load.addEventListener("click", function () {
      window.saveState(function () {
        chrome.fileSystem.chooseEntry({
          type: "openFile",
          accepts: [
            {extensions: ["imagetile"]}
          ],
          acceptsAllTypes: false
        }, loadFunc);
      });
    });

    var save = document.getElementById("save");
    save.addEventListener("click", function () {
      chrome.fileSystem.isRestorable(model.getFile(), function (isRestorable) {
        if (isRestorable) {
          // Perform save operation.
          chrome.fileSystem.restoreEntry(model.getFile(), saveFunc);
        } else {
          // Perform save as operation.
          chrome.fileSystem.chooseEntry({
            type: "saveFile",
            accepts: [
              {extensions: ["imagetile"]}
            ],
            acceptsAllTypes: false
          }, saveFunc);
        }
      });
    });
    save.addEventListener("contextmenu", function () {
      // Perform save as operation.
      chrome.fileSystem.chooseEntry({
        type: "saveFile",
        accepts: [
          {extensions: ["imagetile"]}
        ],
        acceptsAllTypes: false
      }, saveFunc);
    });

    var getMimeType = function (filename) {
      if (filename.endsWith(".png")) return "image/png";
      if (filename.endsWith(".gif")) return "image/gif";
      return "image/jpeg";
    };

    var downloadProgress = new ProgressView("export-progress");
    var download = document.getElementById("export");
    download.addEventListener("click", function () {
      chrome.fileSystem.chooseEntry({
        type: "saveFile",
        accepts: [
          { mimeTypes: ["image/png"] },
          { mimeTypes: ["image/jpeg"] },
          { mimeTypes: ["image/gif"] }
        ],
        acceptsAllTypes: false
      }, function (fileEntry) {
        if (chrome.runtime.lastError) return;
        var canvas = document.createElement("canvas");
        contentView.save(model, canvas);
        fileEntry.createWriter(function (writer) {
          var mimeType = getMimeType(fileEntry.name);
          writer.onerror = errorHandler;
          writer.onwriteend = function () {
            downloadProgress.end();
          };
          downloadProgress.start();
          canvas.toBlob(function (blob) {
            writer.write(blob);
          }, mimeType, 1);
        }, errorHandler);
      });
    });

    var print = document.getElementById("print");
    print.addEventListener("click", function () {
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
    discard.addEventListener("click", function () {
      window.saveState(function () {
        model.discard();
      });
    });

    // Set up listeners for the selected action view.
    var join = document.getElementById("join");
    join.addEventListener("click", function () {
      model.mergeGroups(contentView.getSelection());
    });
    var split = document.getElementById("split");
    split.addEventListener("click", function () {
      model.splitGroups(contentView.getSelection());
    });
    var imageProgress = new ProgressView("image-progress");
    var choose_image = document.getElementById("choose-image");
    choose_image.addEventListener("click", function () {
      chrome.fileSystem.chooseEntry({
        type: "openFile",
        accepts: [
          {mimeTypes: ["image/*"]}
        ],
        acceptsAllTypes: false
      }, function (fileEntry) {
        if (chrome.runtime.lastError) return;
        model.unregisterObserver(saveObserver);
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onerror = errorHandler;
          reader.onloadend = function (e) {
            try {
              var image = new Image();
              image.src = e.target.result;
              model.setImage(contentView.getSelection(), image);
              model.registerObserver(saveObserver);
            } catch (err) {
              errorView.show(
                "The selected file is not an accepted image, please try " +
                "another image format.",
                err.toString()
              );
            }
            imageProgress.end();
            contentView.showSelectedActionView();
          };
          imageProgress.start();
          reader.readAsDataURL(file);
        });
      });
    });
    var crop_scale = document.getElementById("crop-scale");
    crop_scale.addEventListener("input", function () {
      model.updateImageScale(contentView.getSelection(), crop_scale.value);
      contentView.updateScaleReadout();
    });
    var image_fit = document.getElementById("image-fit");
    image_fit.addEventListener("change", function () {
      model.updateImageFit(contentView.getSelection(), image_fit.value);
    });
    var image_rotation = document.getElementById("image-rotation");
    image_rotation.addEventListener("input", function () {
      model.unregisterObserver(saveObserver);
      model.updateImageRotation(contentView.getSelection(), image_rotation.value);
    });
    image_rotation.addEventListener("blur", function () {
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
  var initSettingsView = function (model,
                                   settingsView,
                                   customSizeView,
                                   saveObserver) {
    var image_size = document.getElementById("image-size");
    image_size.addEventListener("input", function () {
      if (image_size.value == "Custom Size") {
        customSizeView.show();
      } else {
        customSizeView.hide();
        model.setSize(image_size.options[image_size.selectedIndex].data);
        image_size.prev = image_size.selectedIndex;
      }
    });
    var image_orientation = document.getElementById("image-orientation");
    image_orientation.addEventListener("input", function () {
      model.setOrientation(image_orientation.value);
    });
    var grid_rows = document.getElementById("grid-rows");
    grid_rows.addEventListener("input", function () {
      model.setRows(grid_rows.value);
    });
    var grid_cols = document.getElementById("grid-cols");
    grid_cols.addEventListener("input", function () {
      model.setCols(grid_cols.value);
    });

    var border_top_size = document.getElementById("border-top-size");
    border_top_size.addEventListener("input", function () {
      model.unregisterObserver(saveObserver);
      model.setBorder(border_top_size.value, null, null, null);
    });
    border_top_size.addEventListener("blur", function () {
      model.registerObserver(saveObserver);
      window.saveState();
    });
    var border_right_size = document.getElementById("border-right-size");
    border_right_size.addEventListener("input", function () {
      model.unregisterObserver(saveObserver);
      model.setBorder(null, border_right_size.value, null, null);
    });
    border_right_size.addEventListener("blur", function () {
      model.registerObserver(saveObserver);
      window.saveState();
    });
    var border_bottom_size = document.getElementById("border-bottom-size");
    border_bottom_size.addEventListener("input", function () {
      model.unregisterObserver(saveObserver);
      model.setBorder(null, null, border_bottom_size.value, null);
    });
    border_bottom_size.addEventListener("blur", function () {
      model.registerObserver(saveObserver);
      window.saveState();
    });
    var border_left_size = document.getElementById("border-left-size");
    border_left_size.addEventListener("input", function () {
      model.unregisterObserver(saveObserver);
      model.setBorder(null, null, null, border_left_size.value);
    });
    border_left_size.addEventListener("blur", function () {
      model.registerObserver(saveObserver);
      window.saveState();
    });
    var border_color = document.getElementById("border-color");
    border_color.addEventListener("input", function () {
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
  var initCustomSizeView = function (model, customSizeView, settingsView) {
    var custom_save = document.getElementById("custom-save");
    custom_save.addEventListener("click", function () {
      var size = customSizeView.getSize();
      if (size.name == ""
       || size['width-mm'] == 0
       || size['height-mm'] == 0
       || size.ppi == 0) return;

      chrome.storage.sync.get({"custom-sizes": []}, function (items) {
        var selected_size = custom_size.options[custom_size.selectedIndex].data;
        items["custom-sizes"] = items["custom-sizes"].filter(function (val) {
          return val.name != selected_size.name;
        });

        items["custom-sizes"].push(size);
        items["custom-sizes"].sort(function (a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        chrome.storage.sync.set(items, function () {
          customSizeView.hide();
          model.setSize(size);
        });
      });
    });
    var custom_discard = document.getElementById("custom-discard");
    custom_discard.addEventListener("click", function () {
      chrome.storage.sync.get({"custom-sizes": []}, function (items) {
        var selectedIndex = custom_size.selectedIndex - 1; // Sub 1 to remove "New Size...".
        items["custom-sizes"].splice(selectedIndex, 1);

        chrome.storage.sync.set(items, function () {
          customSizeView.hide();
          if (document.getElementById("image-size").prev ==
              defaults["image-sizes"].length + selectedIndex) {
            model.setSize(defaults["image-sizes"][defaults["image-size"]]);
          }
          settingsView.initialise(model);
        })
      });
    });
    var custom_cancel = document.getElementById("custom-cancel");
    custom_cancel.addEventListener("click", function () {
      customSizeView.hide();
      image_size.selectedIndex = image_size.prev;
    });
    var custom_size = document.getElementById("custom-size");
    custom_size.addEventListener("input", function () {
      var size = custom_size.options[custom_size.selectedIndex];
      customSizeView.setSize(size.data, size.value != "New Size");
    });
  };

  /**
   * This function initialises the actions in the error view.
   *
   * @param errorView the error view whose actions to initialise.
   */
  var initErrorView = function (errorView) {
    var close = document.getElementById("error-close");
    close.addEventListener("click", function () {
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
  var initKeyboardShortcuts = function (model, saveFunc) {
    window.addEventListener("keydown", function (event) {
      var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": true
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
            chrome.fileSystem.chooseEntry({
              type: "saveFile",
              accepts: [
                {extensions: ["imagetile"]}
              ],
              acceptsAllTypes: false
            }, saveFunc);
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
  var initUndoListeners = function (model) {
    var save = function () {
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
}());
