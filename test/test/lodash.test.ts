import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with lodash", () => {
    const compiler = makeCompiler("lodash");

    it("compile with named-imports", () => {
        const input = dedent`
        import _ from "lodash";
        _.add;
        `;
        const output = dedent`
        import _$add from "lodash/add";
        _$add;
        `;
        expect(compiler(input)).equal(output);
    });

    it("compile with named-bindings", () => {
        const input = dedent`
        import { add } from "lodash";
        `;
        const output = dedent`
        import add from "lodash/add";
        `;
        expect(compiler(input)).equal(output);
    });

    it("compile with named-bindings (aliases)", () => {
        const input = dedent`
        import { invokeMap as _map } from "lodash";
        `;
        const output = dedent`
        import _map from "lodash/invokeMap";
        `;
        expect(compiler(input)).equal(output);
    });

    it("compile with namespace-import", () => {
        const input = dedent`
        import * as _ from "lodash";
        _.add;
        `;
        const output = dedent`
        import _$add from "lodash/add";
        _$add;
        `;
        expect(compiler(input)).equal(output);
    });

    it("compile with import-equal", () => {
        const input = dedent`
        import _ = require("lodash");
        _.add;
        `;
        const output = dedent`
        import _$add from "lodash/add";
        _$add;
        `;
        expect(compiler(input)).equal(output);
    });

    it("compile with lodash-channing", () => {
        const input = dedent`
        import _ = require("lodash");
        _();
        `;
        const output = dedent`
        import _ from "lodash";
        _();
        `;
        expect(compiler(input)).equal(output);
    });

    it("compile with lodash-placeholder", () => {
        const input = dedent`
        import _ from "lodash";
        _.bind(greet, object, _, '!');
        `;
        expect(compiler(input)).equal(input);
    });

    it("compile with unknown-method", () => {
        const input = dedent`
        import _ from "lodash";
        _.unknown;
        `;
        const output = dedent`
        import { unknown as _$unknown } from "lodash";
        _$unknown;
        `;
        expect(compiler(input)).equal(output);
    });
});
