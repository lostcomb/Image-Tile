const {settings} = require("../model/Storage");

/**
 * This defines the settings view.
 */
module.exports = (function() {
    /**
     * This constructs a new SettingsView object. It first sets the default values
     * for the inputs, then adds the listeners for the inputs.
     *
     * @param config the object containing the default values for the inputs.
     */
    function SettingsView(model) {
        var self = this;
        this.initialise(model);
        model.registerObserver({
            notify: function() {
                self.initialise(model);
            }
        });
    }

    function equals(size1, size2) {
        return (
            size1["name"] == size2["name"] &&
            size1["width-mm"] == size2["width-mm"] &&
            size1["height-mm"] == size2["height-mm"] &&
            size1["ppi"] == size2["ppi"]
        );
    }

    function initImageSizes(context, model, defaults) {
        const image_size = document.getElementById("image-size");
        while (image_size.firstChild) image_size.removeChild(image_size.firstChild);

        const custom_sizes = settings.get("custom-sizes", []);
        const sizes = defaults["image-sizes"].concat(custom_sizes);

        for (const size of sizes) {
            const option = document.createElement("option");
            option.value = size.name;
            option.data = size;
            option.appendChild(document.createTextNode(size.name));
            image_size.appendChild(option);
        }
        const option = document.createElement("option");
        option.value = "Custom Size";
        option.appendChild(document.createTextNode("Custom Size..."));
        image_size.appendChild(option);

        const selected = model.getRawSize();
        if (selected) {
            if (!sizes.find(equals.bind(null, selected))) {
                custom_sizes.push(selected);
                custom_sizes.sort((a, b) => a.name.localeCompare(b.name));
                settings.set("custom-sizes", custom_sizes);
                context.initialise(model);
            }

            image_size.selectedIndex = sizes.findIndex(equals.bind(null, selected));
        } else {
            image_size.selectedIndex = defaults["image_size"];
        }
        image_size.prev = image_size.selectedIndex;
    }

    /**
     * This method iterates over the config object, setting the default values
     * of all of the inputs. It also sets their input listeners.
     *
     * @param model the object containing the default values for the inputs.
     */
    SettingsView.prototype.initialise = function(model) {
        var defaults = model.getDefaults();
        initImageSizes(this, model, defaults);

        var image_orientation = document.getElementById("image-orientation");
        while (image_orientation.firstChild) image_orientation.removeChild(image_orientation.firstChild);
        for (let orientation in defaults["image-orientations"]) {
            var option = document.createElement("option");
            option.value = defaults["image-orientations"][orientation];
            option.appendChild(document.createTextNode(defaults["image-orientations"][orientation]));
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
})();
