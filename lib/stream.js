export default class Stream {
    constructor(iterable, cursor, length) {
        this.iterable = iterable;
        this.cursor = cursor || 0;
        this.length = length === undefined
            ? iterable.length - this.cursor
            : length;
    }

    // Get the element at the cursor.
    head(len = 1) {
        if (this.length < 0) {
            return undefined;
        }

        if (this.length === 0) {
            return Symbol.for("eof");
        }

        return this.iterable.slice(this.cursor, this.cursor + len);
    }

    // Execute a regex on the iterable.
    exec(re) {
        // The "u" flag is a feature of ES2015 which makes regexes Unicode-aware.
        // See https://mathiasbynens.be/notes/es6-unicode-regex.
        // The "y" flag makes the regex sticky. The match must start at the
        // offset specified by the regex's lastIndex property.
        let sticky = new RegExp(re, "uy");
        sticky.lastIndex = this.cursor;
        return sticky.exec(this.iterable);
    }

    // Consume the stream by moving the cursor.
    move(distance) {
        return new Stream(
            this.iterable,
            this.cursor + distance,
            this.length - distance);
    }
}
