import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with rxjs@6", () => {
    const compiler = makeCompiler("rxjs@6");

    it("compile with named-bindings", () => {
        const input = dedent`
        import { skip, switchMap as SwitchMap } from "rxjs/operators";
        `;
        const output = dedent`
        import { skip } from "rxjs/_esm5/internal/operators/skip";
        import { switchMap as SwitchMap } from "rxjs/_esm5/internal/operators/switchMap";
        `;
        expect(compiler(input)).equal(output);
    });
});
