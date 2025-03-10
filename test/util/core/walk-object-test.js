"use strict";

const referee = require("@sinonjs/referee");

const walkObject = require("../../../lib/sinon/util/core/walk-object");

const assert = referee.assert;

describe("util/core/walk-object", function () {
    // IE11
    describe("without function.name support", function () {
        function fnWithNoName() {
            return;
        }
        const anonymousFn = function () {
            return;
        };

        before(function () {
            if (
                typeof Object.defineProperty !== "function" ||
                typeof Object.getOwnPropertyDescriptor !== "function" ||
                (Object.getOwnPropertyDescriptor(fnWithNoName, "name") || {})
                    .configurable !== true
            ) {
                this.skip();
            }

            const descriptor = { value: undefined };

            Object.defineProperty(anonymousFn, "name", descriptor);
            Object.defineProperty(fnWithNoName, "name", descriptor);
        });

        it("should still identify functions in environments", function () {
            assert.exception(
                function () {
                    walkObject(fnWithNoName, false);
                },
                { message: "Trying to fnWithNoName object but received false" }
            );

            assert.exception(
                function () {
                    walkObject(fnWithNoName, {});
                },
                {
                    message:
                        "Found no methods on object to which we could apply mutations",
                }
            );
        });

        it("should work with anonymous functions", function () {
            assert.exception(
                function () {
                    walkObject(anonymousFn, false);
                },
                { message: "Trying to undefined object but received false" }
            );

            assert.exception(
                function () {
                    walkObject(anonymousFn, {});
                },
                {
                    message:
                        "Found no methods on object to which we could apply mutations",
                }
            );
        });
    });
});
