import { ILibrary } from "./types";

const withLibraries = <T extends { [K in keyof T]: ILibrary[] }>
    (definitions: T) => definitions;

export default withLibraries({
    // #region functional library
    "lodash": [
        { libraryName: "lodash" },
        { libraryName: "lodash/fp" },
        { libraryName: "lodash-decorators", moduleName: "camelCase" },
    ],
    "ramda": [
        { libraryName: "ramda" },
        { libraryName: "ramda-adjunct" },
        { libraryName: "rambda", libraryPath: "lib" },
    ],
    "async": [
        { libraryName: "async" },
    ],
    "date-fns": [
        { libraryName: "date-fns", moduleName: "snakeCase" },
    ],
    "rxjs@5": [
        { libraryName: "rxjs/operators", libraryPath: "../_esm2015/operators", toNamedImport: true },
    ],
    "rxjs@6": [
        { libraryName: "rxjs", libraryPath: "../_esm5/internal/operators", toNamedImport: true },
        { libraryName: "rxjs/operators", libraryPath: "../_esm5/internal/operators", toNamedImport: true },
    ],
    // #endregion
    // #region ui framework
    "react-bootstrap": [
        { libraryName: "react-bootstrap" },
    ],
    "material-ui": [
        { libraryName: "material-ui" },
        { libraryName: "@material-ui/core" },
        { libraryName: "@material-ui/icons" },
    ],
    // REJECT ANTD-SERIES PREDEFINED SUPPORT.
    // #endregion
});
