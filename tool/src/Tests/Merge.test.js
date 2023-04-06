import MergeHelpers from '../Pages/MergeHelpers.js'

const elementList6 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
const elementList16 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 },
{ id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }];

//getChildLeft tests
describe("Getting left child test, length=3", () => {
    test('In array [1,2,3] the left child should be [1,2]', () => {
        expect(MergeHelpers.getChildLeft([1, 2, 3])).toStrictEqual([1,2]);
    });
})

describe("Getting left child test, lenght=2", () => {
    test('In array [1,2] the left child should be [1]', () => {
        expect(MergeHelpers.getChildLeft([1, 2])).toStrictEqual([1]);
    });
})

describe("Getting left child test, lenght=1", () => {
    test('In array [1] the left child should be nothing', () => {
        expect(MergeHelpers.getChildLeft([1])).toStrictEqual([{ contents: "" }]);
    });
})

describe("Getting left child test, lenght=5", () => {
    test('In array [1,2,3,4,5] the function shouldnt give valid array', () => {
        expect(MergeHelpers.getChildLeft([1, 2, 3, 4, 5])).not.toStrictEqual([1, 2, 3]);
    });
})

//getChildRight tests
describe("Getting right child test, length=1", () => {
    test('In array [1] the right child should be nothing', () => {
        expect(MergeHelpers.getChildRight([1])).toStrictEqual([{ contents: "" }]);
    });
})

describe("Getting right child test, length=2", () => {
    test('In array [1,2] the right child should be [2]', () => {
        expect(MergeHelpers.getChildRight([1, 2, 3])).toStrictEqual([3]);
    });
})

describe("Getting right child test, length=3", () => {
    test('In array [1,2,3] the right child should be [3]', () => {
        expect(MergeHelpers.getChildRight([1, 2, 3])).toStrictEqual([3]);
    });
})

describe("Getting right child test, length=4", () => {
    test('In array [1,2,3,4] the right child should be [3,4]', () => {
        expect(MergeHelpers.getChildRight([1, 2, 3, 4])).toStrictEqual([3,4]);
    });
})

describe("Getting right child test, length=10", () => {
    test('In array [1...10] the function shouldnt give valid array', () => {
        expect(MergeHelpers.getChildRight([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).not.toStrictEqual([5, 6, 7, 8, 9, 10]);
    });
})

//getElementsByDiv tests
describe("Getting the contents of div 1", () => {
    test('Div 1 for array "elementList6" should return itself', () => {
        expect(MergeHelpers.getElementsByDiv(1, elementList6)).toStrictEqual(elementList6);
    });
})

describe("Getting the contents of div 2", () => {
    test('Div 2 for array "elementList6" should return elements 1,2,3', () => {
        expect(MergeHelpers.getElementsByDiv(2, elementList6)).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
})

describe("Getting the contents of div 7", () => {
    test('Div 7 for array "elementList6" should return element 6', () => {
        expect(MergeHelpers.getElementsByDiv(7, elementList6)).toStrictEqual([{ id: 6 }]);
    });
})

describe("Expecting empty div", () => {
    test('Div 31 for array "elementList6" should not return an element', () => {
        expect(MergeHelpers.getElementsByDiv(31, elementList6)).toStrictEqual([{ contents: "" }]);
    });
})

describe("Getting the contents of div 3", () => {
    test('Div 3 for array "elementList15" should return the second half of the array 9...16', () => {
        expect(MergeHelpers.getElementsByDiv(3, elementList16)).toStrictEqual([{ id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }]);
    });
})

describe("Getting the contents of div 12", () => {
    test('Div 12 for array "elementList15" should return elements 9,10', () => {
        expect(MergeHelpers.getElementsByDiv(12, elementList16)).toStrictEqual([{ id: 9 }, { id: 10 }]);
    });
})

describe("Getting the contents of div 31", () => {
    test('Div 31 for array "elementList15" should return element 15', () => {
        expect(MergeHelpers.getElementsByDiv(31, elementList16)).toStrictEqual([{ id: 16 }]);
    });
})

describe("Passing div too low", () => {
    test('Div 0 for array "elementList15" should return []', () => {
        expect(MergeHelpers.getElementsByDiv(0, elementList16)).toStrictEqual([]);
    });
})

describe("Passing div too high", () => {
    test('Div 32 for array "elementList15" should return []', () => {
        expect(MergeHelpers.getElementsByDiv(32, elementList16)).toStrictEqual([]);
    });
})

//createArray tests
describe("Checking createArray creates arrays of the correct length", () => {
    test('Create 5 random arrays and check their lengths are between 6 and 16', () => {
        let validLengths = true;
        for (let i = 0; i < 5; i++) {
            let test = MergeHelpers.createArray(false);
            let testLength = test.length;
            if (testLength < 6 || testLength > 16) {
                validLengths = false;
            }
        }
        expect(validLengths).toBe(true);
    });
})

describe("Checking createArray creates arrays with correct contents", () => {
    test('Create a random array and check it only contains numbers between 1 and 10', () => {
        let validContents = true;
        let test = MergeHelpers.createArray(false);
        for (let i = 0; i < test.length; i++) {
            if (test[i] < 1 || test[i] > 10) {
                validContents = false;
            }
        }
        expect(validContents).toBe(true);
    });
})

//divContents tests
describe("Checking div contents for 15 div visualisation (4 rows)", () => {
    test('Give element list of length 6, expect divs to have correct splits', () => {
        let test = MergeHelpers.divContents(elementList6);
        expect(test[1].contents.length).toBe(6);
        expect(test[2].contents.length).toBe(3);
        expect(test[4].contents[0]).toStrictEqual({id:1});
        expect(test[16].contents).toStrictEqual([{contents:""}]);
    });
})

describe("Checking div contents for 31 div visualisation (5 rows)", () => {
    test('Give element list of length 16, expect divs to have correct splits', () => {
        let test = MergeHelpers.divContents(elementList16);
        expect(test[1].contents.length).toBe(16);
        expect(test[2].contents.length).toBe(8);
        expect(test[4].contents.length).toBe(4);
        expect(test[8].contents.length).toBe(2);
        expect(test[16].contents.length).toBe(1);
        expect(test[4].contents[0]).toStrictEqual({ id: 1 });
        expect(test[4].contents[1]).toStrictEqual({ id: 2 });
        expect(test[31].contents).not.toStrictEqual([{ contents: "" }]);
    });
})
