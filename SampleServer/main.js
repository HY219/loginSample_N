var http = require('http');
var fs = require('fs');
var url = require('url'); //url모듈을 url이라는 변수를 이용해서 사용

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id
    //http://localhost:3000/?id=HTML
    console.log(_url); // ?id=HTML
    console.log(queryData); // { id='HTML' }
    console.log(queryData.id); // HTML

    /*
    //첫 홈페이지 화면
    if(_url == '/'){
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    */

    var pathname = url.parse(_url, true).pathname;

    console.log(url.parse(_url,true)); //url에 들어있는 정보들 출력(_url을 파악해서)
    console.log(url.parse(_url, true).path); // '/?id=HTML' , path는 쿼리스트링이 포함되어있다.
    console.log(url.parse(_url, true).pathname); // '/' , pathname은 쿼리스트링을 제외한 path만을 보여준다.
    

    //path가 '/'일 때 출력
    //home과 각각의 페이지들의 path는 모두 '/' -> 따라서 구분x -> 중첩 조건문으로 구분o
    if(pathname === '/'){
        if(title === undefined){
            fs.readFile(`data/${title}`, 'utf8', function(err, description){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
        }else {
            fs.readFile(`data/${title}`, 'utf8', function(err, description){
                var template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
        }
        
    } else { //다른 경로로 접속했다면 에러메세지 표시
        response.writeHead(404); //웹브라우저가 웹서버에 접속했을 때 주는 정보
        response.end('Not found');
    }
    
    
    ////console.log(__dirname + _url); 
    ////response.end(fs.readFileSync(__dirname + _url)); //사용자가 선택 url에 따라서 파일들을 읽어주는 코드
 
});
app.listen(3000);