
const _ = require("lodash");

class Selector {

    Data = (data, select) => {
        let res = data.map((item) => {
            return (select(item));
        });
        return res;
    }

    select = (data, item, flag) => {
        let res = data.map(e => {
         return e[item]
        })
        return res;
    }

    drop = (data, item, flag) => {
        let res = data.map(e => {
            return (_.omit(e, item));
        })
        return res;
    }
}

module.exports = Selector;
