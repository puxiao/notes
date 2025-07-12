function base64ToBlob (base64Data: string, contentType = 'image/jpeg', sliceSize = 512) {

    const base64WithoutPrefix = base64Data.split(',')[1] || base64Data;

    let type = contentType
    if (base64Data.startsWith('data:image')) {
        type = base64Data.split(';')[0].split(':')[1];
    }

    const byteCharacters = atob(base64WithoutPrefix);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type });
}

export default base64ToBlob
