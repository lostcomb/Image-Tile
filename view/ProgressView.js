/**
 * This defines the progress view.
 */
module.exports = (function () {
  var attrs = new WeakMap();

  /**
   * This constructs a new ProgressView object.
   */
  function ProgressView (id) {
    var element = document.getElementById(id);
    attrs.set(this, {
      element: element
    });
    attrs.get(this).element.addEventListener("transitionend", function () {
      while (element.classList.contains("anim"))
        element.classList.remove("anim");
      while (element.classList.contains("full"))
        element.classList.remove("full");
    });
  }

  /**
   * This method starts the animation of the progress bar.
   */
  ProgressView.prototype.start = function () {
    while (attrs.get(this).element.classList.contains("full"))
      attrs.get(this).element.classList.remove("full");
    attrs.get(this).element.classList.add("anim");
    attrs.get(this).element.classList.add("half");
  };

  /**
   * This method ends the animation of the progress bar.
   */
  ProgressView.prototype.end = function () {
    while (attrs.get(this).element.classList.contains("half"))
      attrs.get(this).element.classList.remove("half");
    attrs.get(this).element.classList.add("full");
  };

  return ProgressView;
}());
