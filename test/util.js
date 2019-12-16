import fs from "fs";
import color from "cli-color";
import json_diff from "json-diff";

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

export function writefile(path, contents) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, contents, function(err) {
            return err ? reject(err) : resolve(path);
        });
    });
}

export const {diffString: diff} = json_diff;
export const PASS = color.green("PASS");
export const FAIL = color.red("FAIL");
