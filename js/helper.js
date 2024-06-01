export async function getToolInfoInJson() {
    return await fetch('/tools-info.json').then(res => res.json());
}

export function extractFileName(filePath) {
    return filePath.split('/')[2].split('.')[0];
}