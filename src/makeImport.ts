import * as _ from "lodash";
import * as path from "path";
import * as ts from "typescript";
import { IImporter } from ".";
import { IImportedStruct } from "./getImport";

function getImportName({ componentName }: IImporter, name: string) {
    if (
        componentName === "camelCase" ||
        componentName === "kebabCase" ||
        componentName === "snakeCase") {
        return _[componentName](name);
    }
    if (_.isNil(componentName)) { return name; }
    return componentName(name);
}

function getLibraryPath(importer: IImporter, importName: string): string {
    const newName = getImportName(importer, importName);
    const { libraryPath } = importer;
    if (_.isNil(libraryPath)) { return newName; }
    if (_.isString(libraryPath)) { return path.posix.join(libraryPath, newName); }
    return libraryPath(importName);
}

function makeImportNode(struct: IImportedStruct, importer: IImporter, importPath?: string) {
    let namedImports;
    if (!_.isNil(importPath) && !_.isNil(struct.variableName)) {
        namedImports = ts.createNamedImports([
            ts.createImportSpecifier(
                ts.createIdentifier(
                    importer.transformToDefaultImport
                        ? "default" : struct.importName,
                ),
                ts.createIdentifier(struct.variableName!),
            ),
        ]);
    }
    const clauseName = struct.variableName || !importer.transformToDefaultImport
        ? undefined : ts.createIdentifier(struct.importName);
    return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(clauseName, namedImports),
        ts.createLiteral(importPath || importer.libraryName),
    );
}

function makeAppendPathNodes(appendPaths: IImporter["appendPaths"], importPath: string) {
    if (_.isNil(appendPaths)) { return []; }
    return _.map(
        _.castArray(appendPaths(importPath)),
        (appendPath) => ts.createImportDeclaration(
            undefined,
            undefined,
            undefined,
            ts.createLiteral(appendPath),
        ),
    );
}

export function makeImports(struct: IImportedStruct, importer: IImporter) {
    const libraryPath = getLibraryPath(importer, struct.importName);
    const importPath = path.posix.join(importer.libraryName, libraryPath);

    return _.concat(
        [makeImportNode(struct, importer, importPath)],
        makeAppendPathNodes(importer.appendPaths, importPath),
    );
}
