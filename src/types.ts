import PredefinedLibraries from "./libraries";

export type PredefinedLibraryKeys = keyof typeof PredefinedLibraries;

type Identity = (name: string) => string;

type ModuleNameCases =
    "camelCase" |
    "snakeCase" |
    "kebabCase" |
    "startCase";

export interface ILibrary {
    libraryName: string;
    libraryPath?: Identity | string;
    moduleName?: Identity | ModuleNameCases;

    toNamedImport?: boolean;
    appendPaths?: (importPath: string) => string | string[];
}
