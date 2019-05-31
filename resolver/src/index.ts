import {Bundle} from "./bundle";
import {StringValue} from "./value";

let variables = new Map(
    Object.entries({
        worl: new StringValue("World"),
        selector: new StringValue("b"),
    })
);

let bundle = new Bundle();

let message = bundle.getMessage("select");
if (message !== undefined) {
    let {value, errors} = bundle.formatValue(message, variables);
    console.log(value);
    console.log(errors);
}
