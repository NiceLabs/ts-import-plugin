import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import { IImporter } from ".";

const predefinedPath = path.join(__dirname, "..", "predefined.json");

const predefinedMap: Record<string, IImporter | IImporter[]> = JSON.parse(
    fs.readFileSync(predefinedPath, { encoding: "utf-8" }),
);

const defaultImporter: Partial<IImporter> = {
    transformToDefaultImport: true,
};

export const getImporters = (importers: Array<string | IImporter>): IImporter[] => {
    const mapped = _.flatMap(importers, (importer) => (
        _.isString(importer) ? predefinedMap[importer] : importer
    ));
    return _.map(
        _.compact(mapped),
        (importer) => _.defaults(importer, defaultImporter),
    );
};
