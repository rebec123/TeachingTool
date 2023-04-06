import SideMenu from '../Components/SideMenu.js';
import "./Merge.css";

//A page of additional information about merge sort
function MergeInfo() {
    let information = "Merge sort is a divide and conquer algorithm.\n\n"+

    "Firstly, the array being sorted is split in half. This is done until each sub array is 1 element long (because an array that is 1 element long "+
     "is sorted by definition).\n\n"+

    "Next, the sub-arrays need to be merged together. This is done by comparing an element from each sub array and adding the smallest to a new array. "+
    "(This is for sorting in ascending order. For descending order, add the largest element to the new array first.) Elements are considered in order, "+
    "meaning the second element in a sub-array wouldn't be considered until the first element has been added to the new array.\n\n"+

    "By dividing the problem into lots of smaller problems, solving them, and combining these smaller solutions we get a soltion to the problem as a "+
        "whole.\n\n"

    let pseudoCode =
        "//A is an array of length n\n" +
        "mergeSort(A[0..n - 1])\n"+
        "if n > 1\n"+
        "   copy the first half of A to S1\n"+
        "   copy the second half of A to S2\n"+
        "   mergeSort(S1) //this function is recursive, so it calls itself\n"+
        "   mergeSort(S2)\n"+
        "   merge(S1, S2, A)\n\n" +
        "//S1 is the first half of an array, S2 is the second half, and A is the array the merged solution will be copied into\n"+
        "merge(S1[0..p-1], S2[0..q-1], A[0..p+q-1])\n" +
        "i = 0; j = 0; k = 0\n" +
        "while i < p and j < q do\n" +
        "   if S1[i] <= S2[j]\n" +
        "       A[k] = S1[i]; i = i + 1\n" +
        "   else A[k] = S2[j]; j = j + 1\n" +
        "       k = k + 1\n" +
        "if i = p\n" +
        "   copy S2[j..q - 1] to A[k..p + q - 1]\n" +
        "else\n" +
        "   copy S1[i..p - 1] to A[k..p + q - 1]\n"

    return (
        <div id="outer-container">
                <SideMenu pageWrapId={'page-wrap'} outerContainerId={'outer-container'} algorithm="merge" />
            <div classname="flex-stage" id="page-wrap">
                    <div className="header-small">
                    <h1 className="title-ppt-style-small">Merge Sort Extra Information</h1>
                </div>
                <div className="info-desc-merge">
                    <h2 className="info-header">Description</h2>
                    {information}
                </div>
                <div classname="flex-stage">
                <div className="info-pseudo-merge">
                    <h2 className="info-header">Pseudo Code</h2>
                    <div className="code-style">
                        {pseudoCode}
                    </div>
                    <p/>
                    Taken from Algorithms i COMP2711 at The University of Leeds, credit to Dr. Natasha Shakhlevich
                    
                </div>
                <div className="info-time-merge">
                    <h2 className="info-header">Time Complexity</h2>
                    O(n log<sub>2</sub>n)
                    </div>
                    </div>
            </div>
        </div>
    );
}
export default MergeInfo;
