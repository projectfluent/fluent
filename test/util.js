import color from "cli-color";
import json_diff from "json-diff";

export const {diffString: diff} = json_diff;
export const PASS = color.green("PASS");
export const FAIL = color.red("FAIL");
