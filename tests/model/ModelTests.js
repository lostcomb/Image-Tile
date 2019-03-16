"use strict";

QUnit.module("Model.js");

QUnit.test("getDefaults() returns the correct object", function (assert) {
  var model = BuildTestModel();
  assert.deepEqual(model.getDefaults(),
                   defaults,
                   "The object containing the default options of the model " +
                   "should be the same as the one passed in.");
});

QUnit.test("registerObserver() should register the specified object " +
           "as an observer", function (assert) {
  var model = BuildTestModel();
  var observer1 = GetTestObserver();
  var observer2 = GetTestObserver();
  assert.equal(observer1.notifyCallCount,
               0,
               "The call count of the observer1 should be 0 initially.");
  assert.equal(observer2.notifyCallCount,
               0,
               "The call count of the observer2 should be 0 initially.");
  model.setRows(4); // This should notify all observers.
  assert.equal(observer1.notifyCallCount,
               0,
               "The call count of the observer1 should be 0 after all " +
               "observers have been notified and the observer1 has not been " +
               "registered.");
  assert.equal(observer2.notifyCallCount,
               0,
               "The call count of the observer2 should be 0 after all " +
               "observers have been notified and the observer2 has not been " +
               "registered.");
  model.registerObserver(observer1);
  model.setRows(4); // This should notify all observers.
  assert.equal(observer1.notifyCallCount,
               1,
               "The call count of the observer1 should be 1 after all " +
               "observers have been notified.");
  assert.equal(observer2.notifyCallCount,
               0,
               "The call count of the observer2 should be 0 after all " +
               "observers have been notified and the observer2 has not been " +
               "registered.");
  model.registerObserver(observer2);
  model.setRows(4); // This should notify all observers.
  assert.equal(observer1.notifyCallCount,
               2,
               "The call count of the observer1 should be 2 after all " +
               "observers have been notified.");
  assert.equal(observer2.notifyCallCount,
               1,
               "The call count of the observer2 should be 1 after all " +
               "observers have been notified.");
});

QUnit.test("registerObserver() doesn't register a null observer",
           function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(null);
  model.registerObserver(observer);
  assert.equal(observer.notifyCallCount,
               0,
               "The call count of the observer should be 0 before all " +
               "observers are notified.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers have been notified.");
});

QUnit.test("registerObserver() doesn't register an undefined observer",
           function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(undefined);
  model.registerObserver(observer);
  assert.equal(observer.notifyCallCount,
               0,
               "The call count of the observer should be 0 before all " +
               "observers are notified.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers have been notified.");
});

QUnit.test("unregisterObserver() should unregister a previously registered " +
           "observer", function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(observer);
  assert.equal(observer.notifyCallCount,
               0,
               "The call count of the observer should be 0 before all " +
               "observers are notified.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers have been notified.");
  model.unregisterObserver(observer);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers have been notified only once.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should remain the same " +
               "after the observer has been unregistered.");
});

QUnit.test("unregisterObserver() shouldn't do anything when passed null",
           function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(observer);
  assert.equal(observer.notifyCallCount,
               0,
               "The call count of the observer should be 0 before all " +
               "observers are notified.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers are notified.");
  model.unregisterObserver(null);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should remain the same " +
               "when a null observer is unregistered.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               2,
               "The call count of the observer should be 2 after all " +
               "observers have been notified for a second time.");
});

QUnit.test("unregisterObserver() shouldn't do anything when passed undefined",
           function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(observer);
  assert.equal(observer.notifyCallCount,
               0,
               "The call count of the observer should be 0 before all " +
               "observers are notified.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers are notified.");
  model.unregisterObserver(undefined);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should remain the same " +
               "when an undefined observer is unregistered.");
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               2,
               "The call count of the observer should be 2 after all " +
               "observers have been notified for a second time.");
});

QUnit.test("an observer is notified the number of times it is registered",
           function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(observer);
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               1,
               "The call count of the observer should be 1 after all " +
               "observers have been notified.");
  model.registerObserver(observer);
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               3,
               "The call count of the observer should be 3 after all " +
               "observers have been notified.");
  model.registerObserver(observer);
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               6,
               "The call count of the observer should be 6 after all " +
               "observers have been notified.");
});

QUnit.test("an observer is notified the number of times it is registered",
           function (assert) {
  var model = BuildTestModel();
  var observer = GetTestObserver();
  model.registerObserver(observer);
  model.registerObserver(observer);
  model.registerObserver(observer);
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               3,
               "The call count of the observer should be 3 after all " +
               "observers have been notified.");
  model.unregisterObserver(observer);
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               5,
               "The call count of the observer should be 5 after all " +
               "observers have been notified.");
  model.unregisterObserver(observer);
  model.setRows(4);
  assert.equal(observer.notifyCallCount,
               6,
               "The call count of the observer should be 6 after all " +
               "observers have been notified.");
});

QUnit.test("observers are preserved after discard(), and notified",
           function (assert) {
  var model = BuildTestModel();
  var observer1 = GetTestObserver();
  var observer2 = GetTestObserver();
  model.registerObserver(observer1);
  model.registerObserver(observer2);
  model.discard();
  assert.equal(observer1.notifyCallCount,
               1,
               "The call count of observer1 should be 1 after all observers " +
               "have been notified.");
  assert.equal(observer2.notifyCallCount,
               1,
               "The call count of observer2 should be 1 after all observers " +
               "have been notified.");
});

function BuildTestModel () {
  return new Model(defaults);
}

function GetTestObserver () {
  return {
    notifyCallCount: 0,
    notify: function (model) {
      this.notifyCallCount++;
    }
  };
}
