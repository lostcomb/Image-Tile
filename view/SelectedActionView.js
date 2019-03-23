const ImageFit = require("../model/enums/ImageFit");
const ImageData = require("../model/ImageData");

/**
 * This defines the actions in the top bar which show when a tile/group is
 * selected.
 */
module.exports = (function () {
  var attrs = new WeakMap();

  /**
   * This constructs a new SelectedActionView object. It hides the view
   * initially as no tiles/groups are initially selected. It also
   */
  function SelectedActionView () {
    var select = document.getElementById("image-fit");
    for (var fit in ImageFit) {
      if (ImageFit.hasOwnProperty(fit)) {
        var option = document.createElement("option");
        option.value = ImageFit[fit];
        option.appendChild(document.createTextNode(ImageFit[fit]));
        select.appendChild(option);
      }
    }
    attrs.set(this, {
      selected: []
    });
  }

  /**
   * This method returns the list of selected groups.
   *
   * @return the list of selected groups.
   */
  SelectedActionView.prototype.getGroups = function () {
    return attrs.get(this).selected;
  };

  /**
   * This method returns true if the specified group is in the
   * selected list.
   *
   * @param group the group to check for selection.
   * @return      true if the specified group is selected.
   */
  SelectedActionView.prototype.isSelected = function (group) {
    return attrs.get(this).selected.indexOf(group) > -1;
  };

  /**
   * This method adds the specified group to the selected list.
   *
   * @param group the group to add to the selected list.
   */
  SelectedActionView.prototype.addSelectedGroup = function (group) {
    if (!this.isSelected(group)) attrs.get(this).selected.push(group);
    this.setVisibility();
  };

  /**
   * This method removes the specified group from the selected list.
   *
   * @param group the group to remove from the selected list.
   */
  SelectedActionView.prototype.removeSelectedGroup = function (group) {
    var index = attrs.get(this).selected.indexOf(group);
    if (index > -1) attrs.get(this).selected.splice(index, 1);
    this.setVisibility();
  };

  /**
   * This method empties the selected list.
   */
  SelectedActionView.prototype.emptySelection = function () {
    attrs.get(this).selected = [];
    this.setVisibility();
  };

  /**
   * This method returns the ImageFit that the groups in the
   * selected list use. If they don't all use the same
   * ImageFit, the MIXED ImageFit is used instead.
   *
   * @return the ImageFit that the groups in the selected list
   *         use.
   */
  SelectedActionView.prototype.getSelectedImageFit = function () {
    var selection = attrs.get(this).selected;
    if (selection.length <= 0) return ImageFit.MIXTURE;
    var image_fit = selection[0].getImageData().getImageFit();
    for (var i = 1; i < selection.length; i++) {
      if (selection[i].getImageData().getImageFit() != image_fit)
        return ImageFit.MIXTURE;
    }
    return image_fit;
  };

  /**
   * This method returns the crop scale that the groups in the selected
   * list use. If they don't all use the same crop scale, the value 0 is used
   * instead.
   *
   * @return the crop scale that the groups in the selected list use.
   */
  SelectedActionView.prototype.getSelectedCropScale = function () {
    var selection = attrs.get(this).selected;
    if (selection.length <= 0) return 0;
    var crop_scale = selection[0].getImageData().getImageScale();
    for (var i = 1; i < selection.length; i++) {
      if (selection[i].getImageData().getImageScale() != crop_scale)
        return 0;
    }
    return crop_scale;
  };

  /**
   * This method returns the rotation that the groups in the selected list use.
   * If they don't all use the same rotation, the value 0 is used instead.
   *
   * @return the rotation that the groups in the selected list all use.
   */
  SelectedActionView.prototype.getSelectedImageRotation = function () {
    var selection = attrs.get(this).selected;
    if (selection.length <= 0) return 0;
    var image_rotation = selection[0].getImageData().getImageRotation();
    for (var i = 1; i < selection.length; i++) {
      if (selection[i].getImageData().getImageRotation() != image_rotation) {
        return 0;
      }
    }
    return image_rotation;
  };

  /**
   * This method updates the scale readout.
   */
  SelectedActionView.prototype.updateScaleReadout = function () {
    var readout = document.getElementById("crop-readout");
    var value = document.getElementById("crop-scale").value;
    var max_scale = ImageData.prototype.getMaxScale() - 100;
    readout.innerHTML = (100 + value * (max_scale / 100)) + "%";
  };

  /**
   * This method decides whether to show or hide the view.
   */
  SelectedActionView.prototype.setVisibility = function () {
    if (attrs.get(this).selected.length == 0) this.hide();
    else this.show();
  };

  /**
   * This method hides the view.
   */
  SelectedActionView.prototype.hide = function () {
    var view = document.getElementById("dyn-act-cont");
    view.style.display = "none";
  };

  /**
   * This method shows the view. It also sets the correct value in the ImageFit
   * drop down.
   */
  SelectedActionView.prototype.show = function () {
    var view = document.getElementById("dyn-act-cont");
    view.style.display = "block";

    var image_fit = document.getElementById("image-fit");
    image_fit.value = this.getSelectedImageFit();

    var crop_scale = document.getElementById("crop-scale");
    if (image_fit.value == ImageFit.CROP) {
      crop_scale.disabled = false;
      crop_scale.value = this.getSelectedCropScale();
    } else {
      crop_scale.disabled = true;
    }

    var image_rotation = document.getElementById("image-rotation");
    image_rotation.value = this.getSelectedImageRotation();

    this.updateScaleReadout();
  };

  return SelectedActionView;
}());
