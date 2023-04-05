import cloneDeep from 'lodash/cloneDeep.js';//Need deep clones to ensure each split array can be rearranged w/o effecting all arrays

const _kMaxNumOfDivs = 31;
const MergeHelpers = {

    //Given a parent array, this function returns the children that would appear
    //To the left of the array (the left half of the array's elements)
    getChildLeft: function (parent) {
        if (parent.length === 1) {
            return [{ contents: "" }];
        }
        else if (parent.length === 2) {
            return [parent[0]];
        }
        else if (parent.length === 3 || parent.length === 4) {
            return [parent[0], parent[1]];
        }
        else {
            return ['Sub array length unexpected'];
        }
    },

    //Given a parent array, this function returns the children that would appear
    //To the right of the array (the right half of the array's elements)
    getChildRight: function (parent) {
        if (parent.length === 1) {
            return [{ contents: "" }];
        }
        else if (parent.length === 2) {
            return [parent[1]];
        }
        else if (parent.length === 3) {
            return [parent[2]];
        }
        else if (parent.length === 4) {
            return [parent[2], parent[3]];
        }
        else {
            return ['Sub array length unexpected'];
        }
    },

    //Given a div (a position in the visualisation representing a sub-array),
    //this function returns the array elements that should be in that sub array
    getElementsByDiv: function (div, elementList) {
        let parentLen = 0;
        let lowerBound = 0;
        let upperBound = 0;
        let parent = [];
        let elementCount = elementList.length;
        if (div < 1 || div > 31) {
            return [];
        }
        else if (div === 1) {
            return cloneDeep(elementList);
        }
        else if (div === 2) {
            return cloneDeep(elementList.filter(element => element.id <= (Math.ceil(elementCount / 2))));
        }
        else if (div === 3) {
            return cloneDeep(elementList.filter(element => element.id > (Math.ceil(elementCount / 2))));
        }
        else if (div === 4) {
            parentLen = Math.ceil(elementCount / 2);
            upperBound = Math.ceil(parentLen / 2);
            return cloneDeep(elementList.filter(element => element.id <= upperBound));
        }
        else if (div === 5) {
            parentLen = Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(parentLen / 2);
            upperBound = Math.ceil(elementCount / 2);
            return cloneDeep(elementList.filter(element => element.id > lowerBound && element.id <= upperBound));
        }
        else if (div === 6) {
            parentLen = elementCount - Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(elementCount / 2);
            upperBound = lowerBound + Math.ceil(parentLen / 2);
            return cloneDeep(elementList.filter(element => element.id > lowerBound && element.id <= upperBound));
        }
        else if (div === 7) {
            parentLen = elementCount - Math.ceil(elementCount / 2);
            lowerBound = Math.ceil(elementCount / 2) + Math.ceil(parentLen / 2);
            upperBound = lowerBound + (parentLen - Math.ceil(parentLen / 2));
            return cloneDeep(elementList.filter(element => element.id > lowerBound && element.id <= upperBound));
        }
        else if (7 < div < 32) {
            let divHalved = div / 2;
            parent = MergeHelpers.getElementsByDiv(Math.floor(divHalved), elementList);
            if (divHalved - Math.floor(divHalved) === 0) {
                return cloneDeep(MergeHelpers.getChildLeft(parent));
            }
            else if (divHalved - Math.floor(divHalved) === 0.5) {
                return cloneDeep(MergeHelpers.getChildRight(parent));
            }
            else {
                console.log("Something went wrong at div = " + div);
                return [];
            }
        }
        else {
            console.log("Invalid value for 'div': " + div);
            return [];
        }
    },
    //Randomly generates an array to sort. The length is between 6-16 and the elements can be 1-10
    createArray: function (arrayCreated) {
        let elementList = [];
        if (arrayCreated === false) {
            arrayCreated = true
            let length = Math.floor((Math.random() * 11) + 6);//((max-min +1) + min)
            for (let i = 0; i < length; i++) {
                elementList.push({
                    id: i + 1,
                    contents: Math.floor(Math.random() * 9) + 1////((max-min +1) + min)
                });
            }
            return elementList;
        }
    },
    divContents: function () {
        MergeHelpers.createArray();
        let allNewArrays = [];
        allNewArrays.push({});
        for (let i = 1; i <= _kMaxNumOfDivs; i++) {
            let _merged = false;
            let _contents = MergeHelpers.getElementsByDiv(i);
            if (_contents.length <= 1) {
                _merged = true;
            }
            let newArrayDetails = {
                index: i,
                contents: _contents,
                merged: _merged,
                style: "ar-el"
            }
            allNewArrays.push(newArrayDetails);
        }
        return allNewArrays;
    }
}

export default MergeHelpers;

