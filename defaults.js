const Orientation = require("./model/enums/Orientation");

/**
 * This defines the default values for the image-size and image-orientation
 * drop downs.
 */
module.exports = {
    "image-size": 4,
    "image-orientation": Orientation.LANDSCAPE,
    "image-sizes": [
        {name: "A0", "width-mm": 841, "height-mm": 1189, ppi: 300},
        {name: "A1", "width-mm": 594, "height-mm": 841, ppi: 300},
        {name: "A2", "width-mm": 420, "height-mm": 594, ppi: 300},
        {name: "A3", "width-mm": 297, "height-mm": 420, ppi: 300},
        {name: "A4", "width-mm": 210, "height-mm": 297, ppi: 300},
        {name: "A5", "width-mm": 148, "height-mm": 210, ppi: 300},
        {name: "A6", "width-mm": 105, "height-mm": 148, ppi: 300},
        {name: "A7", "width-mm": 74, "height-mm": 105, ppi: 300},
        {name: "A8", "width-mm": 52, "height-mm": 74, ppi: 300},
        {name: "A9", "width-mm": 37, "height-mm": 52, ppi: 300},
        {name: "A10", "width-mm": 26, "height-mm": 37, ppi: 300}
    ],
    "image-orientations": Orientation
};
