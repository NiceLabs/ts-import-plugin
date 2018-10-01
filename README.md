[![npm version](https://badge.fury.io/js/%40nice-labs%2Fts-import-plugin.svg)](https://www.npmjs.com/package/@nice-labs/ts-import-plugin)

# @nice-labs/ts-import-plugin

Modular import plugin for TypeScript.

The library predefined supports:

- Functional library
  - lodash
  - ramda
  - async
  - date-fns
  - rxjs@5
  - rxjs@6
- UI framework
  - react-bootstrap
  - material-ui

# Why use this

transform such code:

```typescript
import _, { add } from "lodash";
import { getTime } from "date-fns";
_.chunk;
```

into:

```typescript
import add from "lodash/add";
import _$chunk from "lodash/chunk";
import getTime from "date-fns/get_time";
_$chunk;
```

# Usage with ts-loader (webpack)

```typescript
import webpack from "webpack";
import tsImportPluginFactory from "@nice-labs/ts-import-plugin";

const configure: webpack.Configuration = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve("ts-loader"),
        options: {
          compilerOptions: {
            module: "esnext"
          },
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory(
                // predefined-names or ILibrary objects
                "lodash",
                "date-fns",
                {
                  // ILibrary object
                  libraryName: "antd",
                  libraryPath: "lib",
                  moduleName: "kebabCase",
                  appendPaths: path => `${path}/style/index.less`
                }
              )
            ]
          })
        }
      }
    ]
  }
  // ...
};

export default configure;
```

# ILibrary definition

Reference: [src/types.ts](src/types.ts)

# Compatible libraries

Reference: [src/libraries.ts](src/libraries.ts)

# About antd & antd-mobile supports

Reference: [test/test/antd.test.ts](test/test/antd.test.ts)

# License

see [LICENSE](LICENSE)
