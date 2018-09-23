import _ from "lodash";
import ts from "typescript";

import { Replacer } from "./ast/Replacer";
import { ILibrary, PredefinedLibraryKeys } from "./types";
import { buildLibraries } from "./utils";

export { ILibrary, PredefinedLibraryKeys };

export const createFactory = (...definitions: Array<PredefinedLibraryKeys | ILibrary>) => {
    const libraries = buildLibraries(definitions);
    const factory: ts.TransformerFactory<ts.SourceFile> = (context) => (node) => {
        const replacer = new Replacer(libraries);
        node = ts.visitNode(node, replacer.makeFindVisitor(context));
        replacer.buildReplaceMap();
        node = ts.visitNode(node, replacer.makeReplaceVisitor(context));
        return node;
    };
    return factory;
};

export default createFactory;
