const util = require('util');

export function log(obj: any): void {
    console.log(util.inspect(obj, false, null, true));
}