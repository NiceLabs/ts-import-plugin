import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with antd", () => {
    const compiler = makeCompiler({
        libraryName: "antd",
        libraryPath: "lib",
        moduleName: "camelCase",
        appendPaths(path) {
            return `${path}/style/index.less`;
        },
    });

    it("compile with named-imports", () => {
        const input = dedent`
        import { Alert, Card as C } from "antd";
        `;
        const output = dedent`
        import Alert from "antd/lib/alert";
        import "antd/lib/alert/style/index.less";
        import C from "antd/lib/card";
        import "antd/lib/card/style/index.less";
        `;
        expect(compiler(input)).equal(output);
    });
});
