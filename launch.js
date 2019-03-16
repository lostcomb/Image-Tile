chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'outerBounds': {
      'width': screen.availWidth * 0.6,
      'height': Math.min(screen.availWidth * 0.6 * (10 / 16), screen.availHeight)
    }
  }, function (window) {
    window.onClosed.addListener(function () {
      window.contentWindow.saveState();
    });
  });
});
