import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with ramda", () => {
    const compiler = makeCompiler("ramda");

    it("compile with named-imports", () => {
        const input = dedent`
        import R from "ramda";
        R.addIndex;
        `;
        const output = dedent`
        import R$addIndex from "ramda/es/addIndex";
        R$addIndex;
        `;
        expect(compiler(input)).equal(output);
    });
});
