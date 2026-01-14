import fs from 'fs';
import fetch from 'node-fetch';

async function downloadVideo (videoUrl, refererUrl) {
    const headers = {
        'Referer': refererUrl,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const outputPath = `download/${videoUrl.split('/').pop()}`;

    const response = await fetch(videoUrl, { headers });
    const fileStream = fs.createWriteStream(outputPath);

    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', reject);
        fileStream.on('finish', resolve);
    });

    console.log(`文件已下载: ${outputPath}`);
}

downloadVideo(
    'https://aa.com/bb/cc/xxx.mp4',
    'https://www.aa.com/xx'
);
