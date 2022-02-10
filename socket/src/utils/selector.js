

class Selector {

    Data = (data, select) => {
        let res = data.map((item) => {
            return(select(item));
        });
        return res;
    }
}

module.exports = Selector;
