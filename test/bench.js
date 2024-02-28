import fs from "fs";
import {PerformanceObserver, performance} from "perf_hooks";

import {parse} from "@fluent/syntax";
import {FluentResource} from "@fluent/bundle";
import {Resource} from "../syntax/grammar.js";

let args = process.argv.slice(2);

if (args.length < 1 || 2 < args.length) {
    console.error(
        "Usage: node bench.js FTL_FILE [SAMPLE SIZE = 30]");
    process.exit(1);
}

class Subject {
    constructor(name, fn, measures = []) {
        this.name = name;
        this.fn = fn;
        this.measures = measures;
    }
}

main(...args);

function main(ftl_file, sample_size = 30) {
    let ftl = fs.readFileSync(ftl_file, "utf8");

    let subjects = new Map([
        ["Reference", new Subject("Reference", () => Resource.run(ftl))],
        ["Tooling", new Subject("Tooling", () => parse(ftl))],
        ["Runtime", new Subject("Runtime", () => new FluentResource(ftl))],
    ]);

    new PerformanceObserver(items => {
        for (const {name, duration} of items.getEntries()) {
            subjects.get(name).measures.push(duration);
        }
        performance.clearMarks();

        for (let {name, measures} of subjects.values()) {
            let m = mean(measures);
            let s = stdev(measures, m);
            console.log(`${name}: mean ${m}ms, stdev ${s}ms`);
        }
    }).observe({entryTypes: ["measure"]});

    for (let i = 0; i < sample_size; i++) {
        process.stdout.write(".");
        shuffle(...subjects.values()).map(run);
    }
    process.stdout.write("\n");
}

function run({name, fn}) {
    performance.mark("start");
    fn();
    performance.mark("end");
    performance.measure(name, "start", "end");
}

// Durstenfeld Shuffle
function shuffle(...elements) {
    for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [elements[i], elements[j]] = [elements[j], elements[i]];
    }
    return elements;
}

function mean(elements) {
    let miu = elements.reduce((acc, cur) => acc + cur, 0)
        / elements.length;
    return +miu.toFixed(2);
}

function stdev(elements, mean) {
    let sigma = elements.reduce((acc, cur) => acc + (cur - mean) ** 2, 0)
        / (elements.length - 1);
    return +Math.sqrt(sigma).toFixed(2);
}
