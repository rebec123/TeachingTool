import SideMenu from '../Components/SideMenu';
import "./Heap.css";

//A page of additional information about heap sort
function HeapInfo() {
    let information = "Heap sort uses a heap structure to sort elements.\n\n" +

        "A heap is a binary tree that must be complete (all positions filled) for every row except the last row. The last row might have empty " +
        "positions but the positions that are filled must be as far left as possible.\n\n" +
        "For sorting in descending order, we use a 'max-heap', this is a heap with the property:\n" +
        "No child can be greater than its parent (in other words, all parent nodes mut be greater than or equal to their child nodes.\n\n" +

        "The array being sorted is added to a heap where we maintain the above rules.\n" +
        "This means array elements are added as nodes to the heap, filled row-by-row, left-to-right. If a node breaks the rule 'no child can be greater than " +
        "its parent', then nodes need switching to fix the max-heap.\n\n" +

        "In this application, we switch nodes by dragging a child node to the position of its parent. It might be the case that a " +
        "node needs switching several times before the heap is fixed.\n\n" +

        "Once all array elements have been added to the heap, its time to begin deleting elements from the heap and adding them to the sorted array. " +
        "The rule 'no child can be greater than its parent' implies that the root will always be the largest element, so we delete the root every time.\n\n" +

        "When the root is deleted, it must always be replaced by the left-most node on the last row. Sometimes, this temporarily breaks the heap " +
        "(because the root might be less than its children) so the largest child should take the root's place.\n\n" +

        "We continue the switching process just like in the insertion phase, until the heap is fixed.\n\n" +

        "Once the final element is deleted from the heap, we have a sorted array in descending order.\n\n";

    let pseudoCode =
        "//A is an array of length n\n" +
        "heapSort(A[0..n - 1])\n" +
        "n = A.length\n"+
        "for i = n/2 to 1 //insertion phase (building the heap) \n" +
        "   Heapify(A, n, i)\n" +
        "for i = n to 2\n" +
        "   exchange A[1] with A[i] //deletion phase \n" +
        "   Heapify(A, i, 0)\n\n" +
        "//A is the array of length n and i is the element we are sifting\n" +
        "Heapify(A[0..n - 1], n, i)\n" +
        "max = i, leftchild = 2i + 1, rightchild = 2i + 2\n" +
        "if (leftchild <= n) and (A[i] < A[leftchild])\n" +
        "   max = leftchild\n" +
        "else\n" +
        "   max = i\n" +
        "if (rightchild <= n) and (A[max]  > A[rightchild])\n" +
        "   max = rightchild\n" +
        "if (max != i)\n" +
        "   swap(A[i], A[max])\n" +
        "   Heapify(A, n, max) //function is recursive, so it calls itself\n\n";

    return (
        <div id="outer-container">
            <SideMenu pageWrapId={'page-wrap'} outerContainerId={'outer-container'} algorithm="heap" />
            <div classname="flex-stage" id="page-wrap">
                <div className="header-small">
                    <h1 className="title-ppt-style-small">Heap Sort Extra Information</h1>
                </div>
                <div className="info-desc">
                    <h2 className="info-header">Description</h2>
                    {information}
                </div>
                <div classname="flex-stage">
                    <div className="info-pseudo">
                        <h2 className="info-header">Pseudo Code</h2>
                        We can use an array to represent the heap, where the first element is the root,
                        the second and third elements are the root's children, the forth and fith children are the second node's
                        children, and so on.
                        <div className="code-style">
                            {pseudoCode}
                        </div>
                        Source: <a href="https://fullyunderstood.com/pseudocodes/heap-sort/">Fully Understood</a>
                    </div>
                    <div className="info-time">
                        <h2 className="info-header">Time Complexity</h2>
                        O(n log<sub>2</sub>n)
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HeapInfo;
