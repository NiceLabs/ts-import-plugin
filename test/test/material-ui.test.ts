import { expect } from "chai";
import { dedent } from "ts-dedent";

import { makeCompiler } from "../src/utils";

describe("should compile with material-ui", () => {
    const compiler = makeCompiler("material-ui");

    it("compile with named-imports", () => {
        const input = dedent`
        import { Button } from "@material-ui/core";
        import { AccessAlarm as AccessAlarmIcon, ThreeDRotation } from "@material-ui/icons";
        `;
        const output = dedent`
        import Button from "@material-ui/core/Button";
        import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
        import ThreeDRotation from "@material-ui/icons/ThreeDRotation";
        `;
        expect(compiler(input)).equal(output);
    });
});
