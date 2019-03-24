const {dialog} = require("electron").remote;
const fs = require("fs").promises;

/**
 * This abstracts all access to the browser local storage and filesystem.
 */
const fileFilters = [{name: "ImageTile", extensions: ["imagetile"]}];

/**
 * This function opens an open file dialog.
 *
 * @param filters the file type filters to use for this save dialog.
 * @return        a Promise that resolves to the user selected filename or rejects with undefined if the user cancels
 *                the operation.
 */
const showOpenDialog = function (filters) {
  return new Promise(function (resolve) {
    dialog.showOpenDialog({properties: ["openFile"], filters: filters}, filenames => {
      if (filenames) {
        resolve(filenames[0]);
      } else {
        reject();
      }
    });
  });
};

/**
 * This function opens a save file dialog.
 *
 * @param filters the file type filters to use for this save dialog.
 * @return        a Promise that resolves to the user selected filename or rejects with undefined if the user cancels
 *                the operation.
 */
const showSaveDialog = function (filters) {
  return new Promise(function (resolve, reject) {
    dialog.showSaveDialog({filters: filters}, filename => {
      if (filename) {
        resolve(filename);
      } else {
        reject();
      }
    });
  });
};

/**
 * This function returns the mime type for the specified `filename`.
 *
 * @param filename the `file` whose mime type to return.
 * @return         the mime type for `filename`.
 */
const getMimeType = function (filename) {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
};

/**
 * This function returns a Promise that resolves to a Blob representing the contents of the specified `canvas`.
 *
 * @param canvas   the canvas to convert to a Blob.
 * @param filename the name of the file where the Blob will be written.
 * @return         a Promise that resolves to a Blob representing the contents of the specified `canvas`.
 */
const canvasToBlob = function (canvas, filename) {
  return new Promise(function (resolve) {
    const mimeType = getMimeType(filename);
    canvas.toBlob(resolve, mimeType, 1);
  });
};

/**
 * A Promise interface to the FileReader api.
 *
 * @param method the method to call on the FileReader.
 * @param args   the args to pass to the FileReader method call.
 * @return       a Promise that resolves to the result of the FileReader method call.
 */
const fileReader = function (method, ...args) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => resolve(reader.result);
    reader[method](...args);
  });
};

module.exports = {
  /**
   * This function saves `contents` in `filename`. If filename is undefined, it prompts the user to select a `filename`
   * using the system save dialog.
   *
   * @param filename the name of the file to save.
   * @param contents the contents of the file to be saved.
   * @return         the name of the file to save.
   */
  saveFile: async function (filename, contents) {
    if (!filename) {
      filename = await showSaveDialog(fileFilters);
    }
    await fs.writeFile(filename, contents);
    return filename;
  },
  /**
   * This function prompts the user to select a file to load, and returns it's contents.
   *
   * @return the filename of the loaded files and it's contents.
   */
  loadFile: async function () {
    const filename = await showOpenDialog(fileFilters);
    const contents = await fs.readFile(filename, {encoding: "utf8"});
    return {filename: filename, contents: contents};
  },
  /**
   * This function prompts the user to select a filename to save as, and proceeds to save the
   * specified `canvas` to said filename.
   *
   * @param canvas the canvas to save.
   */
  saveImage: async function (canvas) {
    const imageFilters = [
      {name: "PNG Image", extensions: ["png"]},
      {name: "JPEG Image", extensions: ["jpg", "jpeg"]},
      {name: "GIF Image", extensions: ["gif"]}
    ];
    const filename = await showSaveDialog(imageFilters);
    const blob = await canvasToBlob(canvas, filename);
    const arrayBuffer = await fileReader("readAsArrayBuffer", blob);
    await fs.writeFile(filename, Buffer.from(arrayBuffer));
  },
  /**
   * This function prompts the user to select a file to load. It then returns the file as an `Image` object.
   *
   * @return the `Image` object containing the contents of the selected file.
   */
  loadImage: async function () {
    const imageFilters = [{name: "Images", extensions: ["png", "jpg", "jpeg", "gif"]}];
    const filename = await showOpenDialog(imageFilters);
    const image = new Image();
    image.src = filename;
    return image;
  },
  settings: {
    /**
     * This function retrieves a value previously saved using `set`. If no value has been saved previously,
     * it returns `default_value`.
     *
     * @param name          the key whose value to retrieve.
     * @param default_value the value to return if there isn't a value associated with `name`.
     */
    get: function (name, default_value) {
      const store = window.localStorage;
      const value = store.getItem(name);
      return value ? JSON.parse(value) : default_value;
    },
    /**
     * This function saves a value for the specified key `name`. It overwrites any previously saved value.
     *
     * @param name  the key whose value to set.
     * @param value the value to associate with `name`.
     */
    set: function (name, value) {
      const store = window.localStorage;
      store.setItem(name, JSON.stringify(value));
    }
  }
};
