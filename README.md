[![npm version](https://badge.fury.io/js/@nice-labs/ts-import-plugin.svg)](https://www.npmjs.com/package/@nice-labs/ts-import-plugin)

# @nice-labs/ts-import-plugin

Modular import plugin for TypeScript.

The library predefined supports:

- functional library
  - lodash
  - ramda
  - 1-liners
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
import tsImportPluginFactory from "ts-import-plugin";

const configure: webpack.Configuration = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        options: {
          compilerOptions: { module: "exnext" },
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory(
                // predefined-names or ILibrary objects
                "lodash",
                "date-fns"
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

Reference: <src/types.ts>

# Compatible libraries

Reference: <src/libraries.ts>

# License

see <LICENSE>
