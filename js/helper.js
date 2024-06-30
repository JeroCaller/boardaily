export async function getBgImagesPath() {
    let imageInfo = await fetch('/content-data/background-images.json').then(res => res.json());
    let newImageInfo = [];
    const rootPath = '/boardaily/images/background/';

    for(let i = 0; i < imageInfo.length; i++) {
        newImageInfo.push(
            {
                path: rootPath + imageInfo[i].path,
                category: imageInfo[i].category,
                // 이미지 파일명을 추출.
                detail: imageInfo[i].path.split('/').pop().split('.')[0]
            }
        );
    }

    return newImageInfo;
}

export async function getToolInfoInJson() {
    return await fetch('/content-data/tools-info.json').then(res => res.json());
}

/**
 * 
 * @param {string} filePath - /images/calculator.png 형태의 파일경로.
 * @returns - 파일 이름.
 */
export function extractFileName(filePath) {
    return filePath.split('/')[2].split('.')[0];
}

export const toolsInfo = (async () => {
    const toolsJson = await getToolInfoInJson();
    let infoObj = {};
    for (let i = 0; i < toolsJson.length; i++) {
        infoObj[extractFileName(toolsJson[i]["img-src"])] = {
            "name": toolsJson[i]["name"],
            "img-src": toolsJson[i]["img-src"],
            "hover-bgcolor": toolsJson[i]["hover-bgcolor"],
        };
    }
    return infoObj;
})();

/**
 * 특정 노드의 렌더링 완료 이후에 인자로 전달된 함수를 실행시킨다. 
 * @param {*} func - 실행할 함수 식별자
 * @param {Node} targetNode 
 * @param {} observeOption - MutationObserver().observe() 메서드의 두 번째 인자에 전달할 옵션 객체 리터럴.
 */
export function waitForRenderingAndExecuteFunc(func, targetNode, observeOption) {
    let mutationOb = new MutationObserver((mutationRecords, observer) => {
        func();
        observer.disconnect();
    });
    if (!observeOption) {
        mutationOb.observe(targetNode, {childList: true});
    } else {
        mutationOb.observe(targetNode, observeOption);
    }
}

/**
 * 특정 노드가 렌더링이 완료된 후에 여러 함수들을 실행한다. 
 * @param {Node} targetNode 
 * @param {Object} funcArr - [ [funcName1, arg1, arg2, ...], [funcName2, arg1, arg2, ...] ] 형태의 배열.  
 * @example >> helper.waitForRenderingAndExecuteFunctions(
 * >>    document.querySelector('#some-tag'),
 * >>        [
 * >>            [getSum, 1, 2, 3],
 * >>            [Factorial, 5],
 * >>            [justDoIt]  // 인자를 받지 않는 함수.
 * >>        ]
 * >> );
 */
export function waitForRenderingAndExecuteFunctions(targetNode, funcArr) {
    let mutationOb = new MutationObserver((mutationRecords, observer) => {
        for (let [func, ...args] of funcArr) {
            if (!args) {
                func();
            } else {
                func(args);
            }
        }
        observer.disconnect();
    });
    mutationOb.observe(targetNode, {childList: true});
}

// 테스트용
export function printLocalStorage() {
    console.log('로컬 스토리지 현재 내역');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(`${key} : ${localStorage.getItem(key)}`);
    }
    console.log('로컬 스토리지 현재 내역 끝');
}
