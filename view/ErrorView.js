/**
 * This defines the error view.
 */
module.exports = (function() {
    /**
     * This constructs a new ErrorView object.
     */
    function ErrorView() {}

    /**
     * This method shows the error view and sets the message.
     *
     * @param message the message to display.
     * @param error   the error to display.
     */
    ErrorView.prototype.show = function(message, error) {
        var error_message = document.getElementById("error-message");
        while (error_message.firstChild) error_message.removeChild(error_message.firstChild);
        error_message.appendChild(document.createTextNode(message));
        error_message.appendChild(document.createElement("br"));
        error_message.appendChild(document.createElement("br"));
        error_message.appendChild(document.createTextNode(error));
        var error_view = document.getElementById("error-view");
        error_view.classList.add("visible");
    };

    /**
     * This method hides the error view.
     */
    ErrorView.prototype.hide = function() {
        var error_view = document.getElementById("error-view");
        error_view.classList.remove("visible");
    };

    return ErrorView;
})();
