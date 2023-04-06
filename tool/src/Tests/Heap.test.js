import HeapHelpers from '../Pages/HeapHelpers.js'

const elementList6 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];
const elementList16 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 },
    { id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 }];

//createArray tests
describe("Checking createArray creates arrays of the correct length", () => {
    test('Create 5 random arrays and check their lengths are between 6 and 16', () => {
        let validLengths = true;
        for (let i = 0; i < 5; i++) {
            let test = HeapHelpers.createArray(false);
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
        let test = HeapHelpers.createArray(false);
        for (let i = 0; i < test.length; i++) {
            if (test[i] < 1 || test[i] > 10) {
                validContents = false;
            }
        }
        expect(validContents).toBe(true);
    });
})

//treeSetUp tests
describe("Checking treeSetUp populates heap with correct contents (6 element list)", () => {
    test('Check the contents of heap are as expected when given array of length 6', () => {
        let test = HeapHelpers.treeSetUp(elementList6);
        expect(test.length).toBe(elementList6.length + 1);
        expect(test[1].id).toBe(1);
        expect(test[1].contents).toBe("");
        expect(test[1].ref).toBe(undefined);
        expect(test[6].id).toBe(6);
        expect(test[6].contents).toBe("");
        expect(test[6].ref).toBe(undefined);
    });
})

describe("Checking treeSetUp populates heap with correct contents (16 element list)", () => {
    test('Check the contents of heap are as expected when given array of length 16', () => {
        let test = HeapHelpers.treeSetUp(elementList16);
        expect(test.length).toBe(elementList16.length + 1);
        expect(test[1].id).toBe(1);
        expect(test[1].contents).toBe("");
        expect(test[1].ref).toBe(undefined);
        expect(test[6].id).toBe(6);
        expect(test[6].contents).toBe("");
        expect(test[6].ref).toBe(undefined);
        expect(test[16].id).toBe(16);
        expect(test[16].contents).toBe("");
        expect(test[16].ref).toBe(undefined);
    });
})