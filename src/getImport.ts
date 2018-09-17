import * as _ from "lodash";
import * as ts from "typescript";

export interface IImportedStruct {
    importName: string;
    variableName?: string;
}

export function getImportedStructs(node: ts.Node) {
    const structs = new Set<IImportedStruct>();
    node.forEachChild((importChild) => {
        if (!ts.isImportClause(importChild)) { return; }
        // not allow default import, or mixed default and named import
        // e.g. import foo from 'bar'
        // e.g. import foo, { bar as baz } from 'x'
        // and must namedBindings exist
        if (importChild.name || !importChild.namedBindings) { return; }
        // not allow namespace import
        // e.g. import * as _ from 'lodash'
        if (!ts.isNamedImports(importChild.namedBindings)) { return; }
        importChild.namedBindings.forEachChild((namedImport) => {
            if (!ts.isImportSpecifier(namedImport)) { return; }
            const { propertyName, name } = namedImport;
            if (propertyName === undefined) { // import { foo } from 'bar'
                structs.add({ importName: name.text });
            } else { // import { foo as bar } from 'baz'
                structs.add({ importName: propertyName.text, variableName: name.text });
            }
        });
    });
    return structs;
}
