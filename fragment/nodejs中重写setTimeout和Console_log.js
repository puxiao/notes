const util = require('util');

let count = 0;
let console_change_boo = true;
const setTimeoutPromise = util.promisify(setTimeout);

console.log = function(...args){
    if(args.length === 2){
        if(args[1] !== 0 && console_change_boo){
            console_change_boo = false;
            process.stdout.write(`${util.format.apply(null, [undefined])}\n`);
        }else{
            process.stdout.write(`${util.format.apply(null, [(new Date(args[0])).toString(),count++])}\n`);
            if(count === i){
                console.log(...args);
            }
        }
    }else{
        process.stdout.write(`${util.format.apply(null, args)}\n`);
    }
}

setTimeout = function(handler,timeout){
    if(i === 0){
        handler();
    }else{
        setTimeoutPromise(timeout).then(() => {
            handler();
        });
    }
}

for(var i=0;i<5;i++){
    setTimeout(function(){
      console.log(new Date(),i)
    },1000);
  }
console.log(new Date(),i);