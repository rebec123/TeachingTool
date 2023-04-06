// JavaScript source code


const HeapHelpers = {
    //Randomly generates an array between 6 and 16 elements. Elements range from 1-10
    createArray: function () {
        let elementList = []
        let length = Math.floor((Math.random() * 11) + 6);//((max-min +1) + min)
        for (let i = 0; i < length; i++) {
            elementList.push({
                id: i + 1,
                contents: Math.floor(Math.random() * 9) + 1//((max-min +1) + min)
            });
        }
        return elementList;
    },
    //Filling the heap with empty nodes
    treeSetUp: function (elementList) {
        let result = [];
        result.push({});
        for (let i = 1; i <= elementList.length; i++) {
            result.push({
                id: i,
                contents: "",
                ref: undefined
            });
        }
        return result;
    }
}

export default HeapHelpers;