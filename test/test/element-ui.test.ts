
import { expect } from "chai";
import path from "path";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with element-ui", () => {
    const compiler = makeCompiler({
        libraryName: "element-ui",
        moduleName: "kebabCase",
        appendPaths: (importPath) => {
            const basePath = path.dirname(importPath);
            const fileName = path.basename(importPath);
            return `${basePath}/theme-chalk/${fileName}.css`;
        },
    });

    it("compile with named-imports", () => {
        const input = dedent`
        import { Button, ButtonGroup } from "element-ui";
        `;
        const output = dedent`
        import Button from "element-ui/lib/button";
        import "element-ui/lib/theme-chalk/button.css";
        import ButtonGroup from "element-ui/lib/button-group";
        import "element-ui/lib/theme-chalk/button-group.css";
        `;
        expect(compiler(input)).equal(output);
    });
});
