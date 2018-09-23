import _ from "lodash";
import ts from "typescript";

import { Library } from "../utils";

import { createImportWithSpecifier, expandImportNodes } from "./import";
import { getImportName, getText } from "./utils";

export class Replacer {
    private libraries: Library[];
    private nodeMap = new Map<ts.Node, Set<ts.Node>>();
    private replaceMap = new Map<ts.Node, ts.Node | ts.Node[]>();

    public constructor(libraries: Library[]) {
        this.libraries = libraries;
    }

    public makeFindVisitor(context: ts.TransformationContext) {
        const visitor: ts.Visitor = (node: ts.Node) => {
            if (ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node)) {
                if (_.find(this.libraries, ["libraryName", getImportName(node)])) {
                    this.nodeMap.set(node, new Set());
                }
            }
            if (ts.isCallExpression(node) || ts.isPropertyAccessExpression(node)) {
                const name = getText(node.expression);
                const importNode = this.findImportNodeByMethod(name);
                if (importNode) {
                    this.nodeMap.get(importNode)!.add(node);
                }
            }
            return ts.visitEachChild(node, visitor, context);
        };
        return visitor;
    }

    public makeReplaceVisitor(context: ts.TransformationContext) {
        const visitor: ts.Visitor = (node: ts.Node) => {
            if (this.replaceMap.has(node)) {
                return this.replaceMap.get(node);
            }
            return ts.visitEachChild(node, visitor, context);
        };
        return visitor;
    }

    public buildReplaceMap() {
        for (const [importNode, methodNodes] of this.nodeMap) {
            const library = _.find(this.libraries, ["libraryName", getImportName(importNode)])!;
            const importNodes = new Set(expandImportNodes(library, importNode));
            if (hasCallReference(importNode, methodNodes)) {
                this.replaceMap.set(importNode, Array.from(importNodes));
                continue;
            }
            importNodes.delete(findLibraryImport(importNodes, library.libraryName)!);
            _.forEach(Array.from(methodNodes), (methodNode) => {
                if (ts.isPropertyAccessExpression(methodNode)) {
                    const propertyName = getText(methodNode.expression)!;
                    const name = getText(methodNode.name)!;
                    const replaceNode = ts.createIdentifier([propertyName, name].join("$"));
                    this.replaceMap.set(methodNode, replaceNode);
                    importNodes.add(createImportWithSpecifier(
                        ts.createImportSpecifier(methodNode.name, replaceNode),
                        library,
                    ));
                }
            });
            this.replaceMap.set(importNode, Array.from(importNodes));
        }
    }

    private findImportNodeByMethod(name?: string) {
        for (const node of this.nodeMap.keys()) {
            if (ts.isImportDeclaration(node)) {
                const { importClause } = node;
                if (!importClause) {
                    continue;
                }
                if (name === getText(importClause.name)) {
                    return node;
                }
                const { namedBindings } = importClause;
                if (!namedBindings) {
                    continue;
                }
                if (!ts.isNamespaceImport(namedBindings)) {
                    continue;
                }
                if (name === getText(namedBindings.name)) {
                    return node;
                }
            }
            if (ts.isImportEqualsDeclaration(node)) {
                if (name === getText(node.name)) {
                    return node;
                }
            }
        }
        return;
    }
}

const findLibraryImport = (importNodes: Set<ts.ImportDeclaration>, libraryName: string) => {
    return _.find(
        Array.from(importNodes),
        (node) => {
            if (node.importClause && !node.importClause.name) {
                return false;
            }
            return getText(node.moduleSpecifier) === libraryName;
        },
    );
};

const hasCallReference = (importNode: ts.Node, methodNodes: Set<ts.Node>) => {
    const getReferenceName = () => {
        let name;
        if (ts.isImportDeclaration(importNode)) {
            name = importNode.importClause && importNode.importClause.name;
        } else if (ts.isImportEqualsDeclaration(importNode)) {
            name = importNode.name;
        }
        return getText(name);
    };
    const referenceName = getReferenceName();
    const isPlaceholderToken = (node: ts.CallExpression) => {
        return _.includes(_.map(node.arguments, getText), referenceName);
    };
    for (const node of methodNodes) {
        if (ts.isCallExpression(node)) {
            return getText(node.expression) === referenceName;
        }
        if (ts.isPropertyAccessExpression(node) && ts.isCallExpression(node.parent)) {
            return isPlaceholderToken(node.parent);
        }
    }
    return false;
};
