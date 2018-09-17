import * as _ from "lodash";
import * as ts from "typescript";
import { getImportedStructs } from "./getImport";
import { makeImports } from "./makeImport";
import { getImporters } from "./predefinedMap";

type Identity = (name: string) => string;

export interface IImporter {
    libraryName: string;
    libraryPath?: string | Identity;
    componentName?: "camelCase" | "snakeCase" | "kebabCase" | Identity;
    transformToDefaultImport?: boolean;
    appendPaths?(importPath: string): string | string[];
}

export function createTransformer(...imports: Array<string | IImporter>) {
    const importers = getImporters(imports);
    const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
        const visitor: ts.Visitor = (node) => {
            if (ts.isSourceFile(node)) { return ts.visitEachChild(node, visitor, context); }
            if (!ts.isImportDeclaration(node)) { return node; }
            if (!ts.isStringLiteral(node.moduleSpecifier)) { return node; }
            const importedName = node.moduleSpecifier.text;
            const importer = _.find(importers, ["libraryName", importedName]);
            if (_.isUndefined(importer)) { return node; }
            const structs = getImportedStructs(node);
            if (structs.size === 0) { return node; }
            return _.flatMap(
                Array.from(structs),
                (struct) => makeImports(struct, importer),
            );
        };
        return (node) => ts.visitNode(node, visitor);
    };
    return transformer;
}

export { createTransformer as tsImportPluginFactory };

export default createTransformer;
