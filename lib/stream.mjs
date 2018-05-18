export default class Stream {
    constructor(iterable, cursor, length) {
        this.iterable = iterable;
        this.cursor = cursor || 0;
        this.length = length === undefined
            ? iterable.length - this.cursor
            : length;
    }

    // Get the element at the cursor.
    head() {
        if (this.length < 0) {
            return undefined;
        }

        if (this.length === 0) {
            return Symbol.for("eof");
        }

        return this.iterable[this.cursor];
    }

    // Execute a regex on the iterable.
    exec(re) {
        const sticky = new RegExp(re, "y");
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
