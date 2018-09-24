import _ from "lodash";
import path from "path";

import PredefinedLibraries from "./libraries";
import { ILibrary, PredefinedLibraryKeys } from "./types";

export class Library implements ILibrary {
    public libraryName: ILibrary["libraryName"];
    public libraryPath: ILibrary["libraryPath"];
    public moduleName: ILibrary["moduleName"];
    public toNamedImport: ILibrary["toNamedImport"];
    public appendPaths: ILibrary["appendPaths"];

    public constructor(library: ILibrary) {
        this.libraryName = library.libraryName;
        this.libraryPath = library.libraryPath;
        this.moduleName = library.moduleName;
        this.toNamedImport = library.toNamedImport || false;
        this.appendPaths = library.appendPaths;
    }

    public getModuleName(name: string) {
        if (_.isNil(this.moduleName)) { return name; }
        if (this.moduleName === "camelCase") {
            return _.camelCase(name);
        }
        if (this.moduleName === "kebabCase") {
            return _.kebabCase(name);
        }
        if (this.moduleName === "snakeCase") {
            return _.snakeCase(name);
        }
        if (this.moduleName === "pascalCase") {
            return _.upperFirst(_.camelCase(name));
        }
        return this.moduleName(name);
    }

    public getFilePath(name: string) {
        if (_.isNil(this.libraryPath)) {
            return this.getModuleName(name);
        }
        if (_.isString(this.libraryPath)) {
            return path.posix.join(
                this.libraryPath,
                this.getModuleName(name),
            );
        }
        return this.libraryPath(name);
    }

    public getImportPath(name: string) {
        return path.posix.join(
            this.libraryName,
            this.getFilePath(name),
        );
    }

    public getAppendPaths(name: string) {
        if (_.isUndefined(this.appendPaths)) { return []; }
        return _.castArray(this.appendPaths(this.getImportPath(name)));
    }

    public toString() {
        return this.libraryName;
    }
}

export const buildLibraries = (libraries: Array<PredefinedLibraryKeys | ILibrary>): Library[] => {
    return _.flatMap(libraries, (library) => {
        if (_.isString(library)) {
            return _.map(PredefinedLibraries[library], (item) => new Library(item));
        }
        return new Library(library);
    });
};
