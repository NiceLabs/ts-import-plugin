import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with date-fns", () => {
    const compiler = makeCompiler("date-fns");

    it("compile with named-imports", () => {
        const input = dedent`
        import date from "date-fns";
        date.getTime;
        `;
        const output = dedent`
        import date$getTime from "date-fns/get_time";
        date$getTime;
        `;
        expect(compiler(input)).equal(output);
    });
});
