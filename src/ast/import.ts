import ts from "typescript";

import { Library } from "../utils";

import { getText, isResolvePath } from "./utils";

function* normalizeNodes(node: ts.Node) {
    const createImport = (name: ts.Identifier, moduleSpecifier: ts.Expression) => {
        return ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(name, undefined),
            moduleSpecifier,
        );
    };
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
        yield createImport(node.name, node.moduleReference.expression);
    } else if (ts.isImportDeclaration(node)) {
        const { importClause } = node;
        if (!importClause) { return; }
        if (importClause.name) {
            yield createImport(importClause.name, node.moduleSpecifier);
        }
        const { namedBindings } = importClause;
        if (!namedBindings) { return; }
        if (ts.isNamespaceImport(namedBindings)) {
            yield createImport(namedBindings.name, node.moduleSpecifier);
        }
        if (ts.isNamedImports(namedBindings)) {
            for (const element of namedBindings.elements) {
                yield ts.createImportDeclaration(
                    undefined,
                    undefined,
                    ts.createImportClause(
                        undefined,
                        ts.createNamedImports([element]),
                    ),
                    node.moduleSpecifier,
                );
            }
        }
    }
}

export function* expandImportNodes(library: Library, importNode: ts.Node) {
    for (const node of normalizeNodes(importNode)) {
        if (
            !node.importClause ||
            !node.importClause.namedBindings ||
            !ts.isNamedImports(node.importClause.namedBindings)
        ) {
            yield node;
            continue;
        }
        for (const element of node.importClause.namedBindings.elements) {
            const importName = getText(element.propertyName || element.name)!;
            yield createImportWithSpecifier(element, library);
            for (const appendPath of library.getAppendPaths(importName)) {
                yield createImportWithPaths(appendPath);
            }
        }
    }
}

export function createImportWithSpecifier(element: ts.ImportSpecifier, library: Library) {
    let importName = library.getImportPath(getText(element.propertyName || element.name)!);
    const resolvable = isResolvePath(importName);
    if (!resolvable) {
        importName = library.libraryName;
    }
    let name;
    let namedBindings;
    if (!resolvable || library.toNamedImport) {
        namedBindings = ts.createNamedImports([element]);
    } else {
        name = element.name;
    }
    return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(name, namedBindings),
        ts.createLiteral(resolvable ? importName : library.libraryName),
    );
}

export function createImportWithPaths(path: string) {
    return ts.createImportDeclaration(
        undefined,
        undefined,
        undefined,
        ts.createLiteral(path),
    );
}
