import { expect } from "chai";
import * as ts from "typescript";
import { createTransformer } from "../src";

const makeCompile = (transformer: ts.TransformerFactory<ts.SourceFile>) => (input: string) => {
    const source = ts.createSourceFile("", input, ts.ScriptTarget.Latest, false);
    const result = ts.transform(source, [transformer]);
    const compiled = ts.createPrinter().printFile(result.transformed[0]);
    result.dispose();
    return compiled.trim();
};

describe("should compile", () => {
    it("compile with lodash", () => {
        const compile = makeCompile(createTransformer("lodash"));

        const input = `import { add } from "lodash";`;
        const output = `import add from "lodash/add";`;
        const compiled = compile(input);
        expect(output).equal(compiled);
    });

    it("compile with ramda", () => {
        const compile = makeCompile(createTransformer("ramda"));

        const input = `import { add } from "ramda";`;
        const output = `import add from "ramda/es/add";`;
        const compiled = compile(input);
        expect(output).equal(compiled);
    });

    it("compile with date-fns", () => {
        const compile = makeCompile(createTransformer("date-fns"));

        const input = `import { getTime } from "date-fns";`;
        const output = `import getTime from "date-fns/get_time";`;
        const compiled = compile(input);
        expect(output).equal(compiled);
    });

    it("compile with RxJS@6", () => {
        const compile = makeCompile(createTransformer("rxjs@6"));

        const input = `import { combineAll } from "rxjs/operators";`;
        const output = `import combineAll from "rxjs/_esm5/internal/operators/combineAll";`;
        const compiled = compile(input);
        expect(output).equal(compiled);
    });
});
