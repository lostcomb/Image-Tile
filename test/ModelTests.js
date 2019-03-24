const Model = require("../model/Model");
const defaults = require("../defaults");
const assert = require("assert");

describe("Model.js:", function() {
    beforeEach(function() {
        this.model = BuildTestModel();
    });

    describe("getDefaults()", function() {
        it("returns the correct object", function() {
            assert.deepEqual(
                this.model.getDefaults(),
                defaults,
                "The object containing the default options of the model " + "should be the same as the one passed in."
            );
        });
    });

    describe("registerObserver()", function() {
        it("should register the specified object as an observer", function() {
            const observer1 = GetTestObserver();
            const observer2 = GetTestObserver();
            assert.equal(observer1.notifyCallCount, 0, "The call count of the observer1 should be 0 initially.");
            assert.equal(observer2.notifyCallCount, 0, "The call count of the observer2 should be 0 initially.");
            this.model.setRows(4); // This should notify all observers.
            assert.equal(
                observer1.notifyCallCount,
                0,
                "The call count of the observer1 should be 0 after all " +
                    "observers have been notified and the observer1 has not been " +
                    "registered."
            );
            assert.equal(
                observer2.notifyCallCount,
                0,
                "The call count of the observer2 should be 0 after all " +
                    "observers have been notified and the observer2 has not been " +
                    "registered."
            );
            this.model.registerObserver(observer1);
            this.model.setRows(4); // This should notify all observers.
            assert.equal(
                observer1.notifyCallCount,
                1,
                "The call count of the observer1 should be 1 after all " + "observers have been notified."
            );
            assert.equal(
                observer2.notifyCallCount,
                0,
                "The call count of the observer2 should be 0 after all " +
                    "observers have been notified and the observer2 has not been " +
                    "registered."
            );
            this.model.registerObserver(observer2);
            this.model.setRows(4); // This should notify all observers.
            assert.equal(
                observer1.notifyCallCount,
                2,
                "The call count of the observer1 should be 2 after all " + "observers have been notified."
            );
            assert.equal(
                observer2.notifyCallCount,
                1,
                "The call count of the observer2 should be 1 after all " + "observers have been notified."
            );
        });

        it("doesn't register a null observer", function() {
            const observer = GetTestObserver();
            this.model.registerObserver(null);
            this.model.registerObserver(observer);
            assert.equal(
                observer.notifyCallCount,
                0,
                "The call count of the observer should be 0 before all " + "observers are notified."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should be 1 after all " + "observers have been notified."
            );
        });

        it("doesn't register an undefined observer", function() {
            const observer = GetTestObserver();
            this.model.registerObserver(undefined);
            this.model.registerObserver(observer);
            assert.equal(
                observer.notifyCallCount,
                0,
                "The call count of the observer should be 0 before all " + "observers are notified."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should be 1 after all " + "observers have been notified."
            );
        });
    });

    describe("unregisterObserver()", function() {
        it("should unregister a previously registered observer", function() {
            const observer = GetTestObserver();
            this.model.registerObserver(observer);
            assert.equal(
                observer.notifyCallCount,
                0,
                "The call count of the observer should be 0 before all " + "observers are notified."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should be 1 after all " + "observers have been notified."
            );
            this.model.unregisterObserver(observer);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should be 1 after all " + "observers have been notified only once."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should remain the same " + "after the observer has been unregistered."
            );
        });

        it("shouldn't do anything when passed null", function() {
            const observer = GetTestObserver();
            this.model.registerObserver(observer);
            assert.equal(
                observer.notifyCallCount,
                0,
                "The call count of the observer should be 0 before all " + "observers are notified."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should be 1 after all " + "observers are notified."
            );
            this.model.unregisterObserver(null);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should remain the same " + "when a null observer is unregistered."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                2,
                "The call count of the observer should be 2 after all " +
                    "observers have been notified for a second time."
            );
        });

        it("shouldn't do anything when passed undefined", function() {
            const observer = GetTestObserver();
            this.model.registerObserver(observer);
            assert.equal(
                observer.notifyCallCount,
                0,
                "The call count of the observer should be 0 before all " + "observers are notified."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should be 1 after all " + "observers are notified."
            );
            this.model.unregisterObserver(undefined);
            assert.equal(
                observer.notifyCallCount,
                1,
                "The call count of the observer should remain the same " + "when an undefined observer is unregistered."
            );
            this.model.setRows(4);
            assert.equal(
                observer.notifyCallCount,
                2,
                "The call count of the observer should be 2 after all " +
                    "observers have been notified for a second time."
            );
        });
    });

    it("an observer is notified the number of times it is registered", function() {
        const observer = GetTestObserver();
        this.model.registerObserver(observer);
        this.model.setRows(4);
        assert.equal(
            observer.notifyCallCount,
            1,
            "The call count of the observer should be 1 after all " + "observers have been notified."
        );
        this.model.registerObserver(observer);
        this.model.setRows(4);
        assert.equal(
            observer.notifyCallCount,
            3,
            "The call count of the observer should be 3 after all " + "observers have been notified."
        );
        this.model.registerObserver(observer);
        this.model.setRows(4);
        assert.equal(
            observer.notifyCallCount,
            6,
            "The call count of the observer should be 6 after all " + "observers have been notified."
        );
    });

    it("an observer is notified the number of times it is registered", function() {
        const observer = GetTestObserver();
        this.model.registerObserver(observer);
        this.model.registerObserver(observer);
        this.model.registerObserver(observer);
        this.model.setRows(4);
        assert.equal(
            observer.notifyCallCount,
            3,
            "The call count of the observer should be 3 after all " + "observers have been notified."
        );
        this.model.unregisterObserver(observer);
        this.model.setRows(4);
        assert.equal(
            observer.notifyCallCount,
            5,
            "The call count of the observer should be 5 after all " + "observers have been notified."
        );
        this.model.unregisterObserver(observer);
        this.model.setRows(4);
        assert.equal(
            observer.notifyCallCount,
            6,
            "The call count of the observer should be 6 after all " + "observers have been notified."
        );
    });

    it("observers are preserved after discard(), and notified", function() {
        const observer1 = GetTestObserver();
        const observer2 = GetTestObserver();
        this.model.registerObserver(observer1);
        this.model.registerObserver(observer2);
        this.model.discard();
        assert.equal(
            observer1.notifyCallCount,
            1,
            "The call count of observer1 should be 1 after all observers " + "have been notified."
        );
        assert.equal(
            observer2.notifyCallCount,
            1,
            "The call count of observer2 should be 1 after all observers " + "have been notified."
        );
    });
});

function BuildTestModel() {
    return new Model(defaults);
}

function GetTestObserver() {
    return {
        notifyCallCount: 0,
        notify: function() {
            this.notifyCallCount++;
        }
    };
}
