import _ from "lodash";
import ts from "typescript";

import { createFactory, ILibrary, PredefinedLibraryKeys } from "../../src";

const printer = ts.createPrinter();

export const makeCompiler = (...libraries: Array<PredefinedLibraryKeys | ILibrary>) => (input: string) => {
    const sourceFile = ts.createSourceFile(
        "unit-test.tsx",
        input,
        ts.ScriptTarget.Latest,
        true,
    );
    const { transformed } = ts.transform(
        sourceFile,
        [createFactory(...libraries)],
    );
    return printer.printFile(transformed[0]).trim();
};
