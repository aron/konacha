var Konacha = {};

window.onload = function () {
  var suites = Konacha.specs.slice();
  var total  = suites.length;
  var count  = document.createTextNode(0);
  var status = document.createElement('div');

  status.className = 'konacha-status';
  status.appendChild(count);
  status.appendChild(document.createTextNode(' of ' + total + ' specs loaded…'));
  document.body.appendChild(status);

  function runSuite() {
    // The iframe order is undefined, so we make it predictable.
    mocha.suite.suites.sort(function (a, b) {
      return a.path.localeCompare(b.path);
    });

    // Check that all iframes loaded successfully.
    var iframes = document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; ++i) {
      if (!iframes[i].contentWindow.mocha) {
        (function (path) {
          mocha.suite.addTest(new Mocha.Test(path, function () {
            throw new Error("Failed to load " + path + ".\n" +
                            "Perhaps it failed to compile? Check the rake output for errors.");
          }));
        })(iframes[i].getAttribute("data-path"));
      }
    }

    if (status.parentNode) {
      document.body.removeChild(status);
    }
    mocha.run();
  }

  (function next() {
    count.nodeValue = total - suites.length;

    if (suites.length) {
      var suite = suites.shift();

      var iframe = document.createElement("iframe");
      iframe.setAttribute("data-path", suite.path);
      iframe.className = "test-context";
      iframe.onload = next;
      iframe.src = suite.iframe_path;

      document.body.appendChild(iframe);
    } else {
      runSuite();
    }
  })();
};
