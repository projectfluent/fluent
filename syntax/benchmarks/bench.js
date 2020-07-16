import runtime from "@fluent/bundle";
import tooling from "@fluent/syntax";
import perf from "perf_hooks";
import { Resource } from "../parser/grammar.js";
import { readfile } from "../lib/util.js";
const {PerformanceObserver, performance} = perf;


let args = process.argv.slice(2);

if (args.length < 1 || 2 < args.length) {
    console.error("Usage: node bench.js FTL_FILE [SAMPLE SIZE = 30]");
    process.exit(1);
}

main(...args);

class Subject {
    constructor(name, fn, measures = []) {
        this.name = name;
        this.fn = fn;
        this.measures = measures;
    }
}

async function main(ftl_file, sample_size = 30) {
    let ftl = await readfile(ftl_file);

    let subjects = new Map([
        ["Reference", new Subject("Reference", () => Resource.run(ftl))],
        ["Tooling", new Subject("Tooling", () => tooling.parse(ftl))],
        ["Runtime", new Subject("Runtime", () => new runtime.FluentResource(ftl))],
    ]);

    new PerformanceObserver(items => {
        const [{name, duration}] = items.getEntries();
        subjects.get(name).measures.push(duration);
        performance.clearMarks();
    }).observe({entryTypes: ["measure"]});

    for (let i = 0; i < sample_size; i++) {
        process.stdout.write(".");
        shuffle(...subjects.values()).map(run);
    }

    process.stdout.write("\n");

    for (let {name, measures} of subjects.values()) {
        let m = mean(measures);
        let s = stdev(measures, m);
        console.log(`${name}: mean ${m}ms, stdev ${s}ms`);
    }
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
    let miu = elements.reduce((acc, cur) => acc + cur) / elements.length;
    return +miu.toFixed(2);
}

function stdev(elements, mean) {
    let sigma = elements.reduce((acc, cur) => acc + (cur - mean) ** 2, 0) / (elements.length - 1);
    return +Math.sqrt(sigma).toFixed(2);
}
