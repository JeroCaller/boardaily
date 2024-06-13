export function waitForRenderingAndExecuteFunc(func, targetNode) {
    let mutationOb = new MutationObserver((mutationRecords, observer) => {
        func();
        console.log(mutationRecords);
        console.log(mutationRecords[0].type);
        console.log(mutationRecords[0].target);
        observer.disconnect();
    });
    mutationOb.observe(targetNode, {childList: true});
}
