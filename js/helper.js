export async function getToolInfoInJson() {
    return await fetch('/tools-info.json').then(res => res.json());
}

export function extractFileName(filePath) {
    return filePath.split('/')[2].split('.')[0];
}

export const toolsInfo = (async () => {
    const toolsJson = await fetch('/tools-info.json').then(res => res.json());
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
