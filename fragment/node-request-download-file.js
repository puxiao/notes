var request = require('request'); // yarn add request
var fs = require('fs');
var path = require('path');

let requestOption = {
    url: 'https://www.xxx.com/xxx/xxx',
    headers: {
      'Content-Type': 'application/force-download',
      'token': 'xxxxxxxx',
    },
    responseType: 'arraybuffer'
}

let targetPath = path.join(__dirname, 'my.zip');

downloadFile(requestOption, targetPath)

function downloadFile(requestOption , targetPath){

    var received_bytes = 0;
    var total_bytes = 0;

    var req = request(requestOption);

    var out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function ( data ) {
        total_bytes = parseInt(data.headers['content-length' ]);
    });

    req.on('data', function(chunk) {
        received_bytes += chunk.length;
        showProgress(received_bytes, total_bytes);
    });

    req.on('end', function() {
        console.log("File succesfully downloaded");
    });
}

function showProgress(received,total){
    var percentage = (received * 100) / total;
    console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
}
