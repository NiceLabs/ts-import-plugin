import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with antd", () => {
    const compiler = makeCompiler({
        libraryName: "antd",
        libraryPath: "es",
        moduleName: "kebabCase",
        appendPaths(importPath: string) {
            // antd without style
            // return [];

            // antd with css
            // return `${importPath}/style/index.css`

            // antd with less
            return `${importPath}/style/index.less`;
        },
    });

    it("compile with named-imports", () => {
        const input = dedent`
        import { Alert, Card as C, TreeSelect } from "antd";
        `;
        const output = dedent`
        import Alert from "antd/es/alert";
        import "antd/es/alert/style/index.less";
        import C from "antd/es/card";
        import "antd/es/card/style/index.less";
        import TreeSelect from "antd/es/tree-select";
        import "antd/es/tree-select/style/index.less";
        `;
        expect(compiler(input)).equal(output);
    });
});
