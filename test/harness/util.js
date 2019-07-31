import fs from "fs";
import color from "cli-color";
import json_diff from "json-diff";

function nonBlank(line) {
    return !/^\s*$/.test(line);
}

function countIndent(line) {
    const [indent] = line.match(/^\s*/);
    return indent.length;
}

export function ftl(strings) {
    const [code] = strings;
    const lines = code.split("\n").slice(1, -1);
    const indents = lines.filter(nonBlank).map(countIndent);
    const common = Math.min(...indents);
    const indent = new RegExp(`^\\s{${common}}`);
    const dedented = lines.map(line => line.replace(indent, ""));
    return `${dedented.join("\n")}\n`;
}

export function readdir(path) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path, function(err, filenames) {
            return err ? reject(err) : resolve(filenames);
        });
    });
}

export function readfile(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, function(err, file) {
            return err ? reject(err) : resolve(file.toString());
        });
    });
}

export const {diffString: diff} = json_diff;
export const PASS = color.green("PASS");
export const FAIL = color.red("FAIL");
