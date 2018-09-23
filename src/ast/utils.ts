import _ from "lodash";
import ts from "typescript";

export const getText = (node?: ts.Node): string | undefined => {
    if (!node) { return; }
    if (ts.isIdentifier(node)) { return node.text; }
    if (ts.isStringLiteral(node)) { return node.text; }
    if (ts.isStringLiteralLike(node)) { return node.text; }
    return;
};

export const getImportName = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        return getText(node.moduleSpecifier);
    }
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
        return getText(node.moduleReference.expression);
    }
    return;
};

export const isResolvePath = (target: string) => {
    try {
        require.resolve(target, { paths: [process.cwd()] });
        return true;
    } catch (e) {
        return false;
    }
};
