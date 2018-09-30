import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with antd", () => {
    const compiler = makeCompiler({
        libraryName: "antd", // or antd-mobile
        libraryPath: "es",
        moduleName: "kebabCase",
        // # antd-without-style
        // appendPaths: undefined,
        // # antd-with-css
        // appendPaths: (importPath) => `${importPath}/style/index.css`,
        // # antd-with-less
        // appendPaths: (importPath) => `${importPath}/style/index.less`,
        // # antd-with-style
        appendPaths: (importPath) => `${importPath}/style`,
    });

    it("compile with named-imports", () => {
        const input = dedent`
        import { Alert, Card as C, TreeSelect } from "antd";
        `;
        const output = dedent`
        import Alert from "antd/es/alert";
        import "antd/es/alert/style";
        import C from "antd/es/card";
        import "antd/es/card/style";
        import TreeSelect from "antd/es/tree-select";
        import "antd/es/tree-select/style";
        `;
        expect(compiler(input)).equal(output);
    });
});
