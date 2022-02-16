var arr = ['A','B','C','D'];
console.log(arr);       //[ 'A', 'B', 'C', 'D' ]
console.log(arr[1]);    //B
console.log(arr.length);//4

arr[2] = 3;
arr.push('E');
console.log(arr);       //[ 'A', 'B', 3, 'D', 'E' ]
console.log(arr[1]);    //B
console.log(arr.length);//5

//node plus/array.js