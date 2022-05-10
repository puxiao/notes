const maxSize = 3;
const needImgSize = true;

const imgTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];

const beforeUpload = (file) => {
    const isLt3M = file.size / 1024 / 1024 < maxSize;
    if (!isLt3M) {
        message.error(`单个素材不要超过 ${maxSize}MB ！`);
        return false;
    }

    if (needImgSize && imgTypes.includes(file.type)) {
        //如果需要获取图片尺寸，并且文件确实是图片，则执行下面代码
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    file.width = img.height;
                    file.height = img.width;
                    return resolve();
                };
                img.onerror = (err) => {
                    return reject(err);
                };
            };
        });
    } else {
        return true;
    }
};
