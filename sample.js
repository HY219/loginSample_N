//네이버 로그인 Node.js 예제는 1개의 파일로 로그인요청 및 콜백 처리를 모두합니다.

//express 모듈 사용
var express = require('express');
var request = require('request');

//express()는 app이라는 객체를 return해서 -> app.set, app.get 등이 가능
var app = express();

/*
var client_id = 'YOUR_CLIENT_ID';
var client_secret = 'YOUR_CLIENT_SECRET';
var state = "RANDOM_STATE";
var redirectURI = encodeURI("YOUR_CALLBACK_URL"); //redirectURI = 로그인 창
var api_url = "";
*/

var client_id = 'lQQMGAXDPyBpJ4nDeqhL';
var client_secret = 'HtjKR6HLXo';
var state = Math.random();
var redirectURI = encodeURI("http://127.0.0.1:3000/callback");
var api_url = "";
var token_type = "";
var all_token = "";
var accesstoken = "";
//var header = "Bearer " + accesstoken;
var refreshtoken = "";
//var Body = "";

//app.METHOD(PATH, HANDLER)
//app은 express의 인스턴스, METHOD는 HTTP요청 메소드,
//PATH는 서버에서의 경로, HANDLER는 라우트(경로)가 일치할 때 실행되는 함수
//'/naverlogin'경로일 경우 함수가 실행된다.
app.get('/naverlogin', function (req, res) {
    //네이버 로그인 인증 요청하는 url //쿼리스트링=사용자정보담기는 곳
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state; //네이버 로그인 서버로 이동
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    //로그인 로고 이미지 출력
    //이미지를 클릭하면 바로 33의 api_url을 거쳐서-> 바로 44의 api_url주소를 띄워준다.
   res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
  });


 //naver로그인api 연동

 app.get('/callback', function (req, res) {
    //req.query -> 경로의 각 쿼리 문자열 매개변수에 대한 속성이 포함된 객체이다.
    //->쿼리스트링의 값을 가져온다.(ex. http://query/search?searchWorld=쿼리스트링의 값)
    //->{ searchWorld : '쿼리스트링의 값' } (?)
    //console.log(req.query);
    //console.log(req);
    code = req.query.code; //query의 code값 요청해서 가져옴(?)
    state = req.query.state;
    //로그인 성공하면 뜨는 창
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state; //가져온 code, state값이 들어감.(?)
    //var request = require('request'); //request 모듈 다운받기(npm install request -s) -> package.json안에 다운로드 버전 확인가능
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    
		//request.get()
		//HTTP 네트워크 라이브러리
		//get메서드를 통해 uri인자를 준다.
    //request모듈로 option안의 값들 요청해서 가져오기(?)
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'}); //출력형식 지정
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'}); //html형태로 출력

        //접근 토큰 추출
        /*
        var all_token = JSON.parse(body);
        var accesstoken = all_token.access_token;
        */
        accesstoken = JSON.parse(body).access_token; //var (X)!!! //-> 전역으로 선언돼서, 선언된 함수를 벗어나면 사라진다.(선언된 함수 외부에서 인식할 수 없다.)
        refreshtoken = JSON.parse(body).refresh_token; //갱신토큰 추출
        Body = JSON.parse(body);
        
        //console.log(body);
        console.log(Body);
        console.log(accesstoken);
        console.log(refreshtoken);
        res.end('<a href = "/user">사용자프로필조회</a>');
        //res.end('<a href = "/user">사용자프로필조회</a>');
        //res.send(all_token.access_token);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });


  //접근토큰을 사용해 사용자 정보 가져오기

  app.get('/user', function (req, res) {
    //console.log(req.query);
    console.log(accesstoken);
    //accesstoken = req.query.code;
    // api_url = 'https://openapi.naver.com/v1/nid/me';
    // client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    //var request = require('request');
    var options = {
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {
          //공백, Bearer랑 accesstoken 반드시 따로 작성!! 필수!!
          // 'Authorization': "Bearer "+"AAAAOCZKZtDYD-AGkMZ23Nz4oS4F-OKyEcVjv8l-lfSDcMmqZekxfwjiBdkqJe3-zpezVb7EQHsCpyJGUF4lYMsS8QQ"// ->성공
          //'Authorization': token_type + accesstoken
          'Authorization': "Bearer "+accesstoken//->왜 오류?????? -> accesstoken을 지역변수로 선언해놔서 오류났었음.
        }
    };
    
    request.get(options, function (error, response, body){
      if (!error && response.statusCode == 200) {
        //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end('<a href = "/refresh">갱신토큰이용확인</a>');
        //res.end(body);
        Body = JSON.parse(body);
        console.log(Body);
        //console.log(body);
      } else {
        console.log('error');
        if(response != null) {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      }
    });
  });


  //갱신토큰을 이용한 접근토큰 재발급 요청

  app.get('/refresh', function (req, res) {

    //code = req.query.code; //query의 code값 요청해서 가져옴(?)
    //state = req.query.state;
 
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id='
     + client_id + '&client_secret=' + client_secret + '&refresh_token=' + refreshtoken;// + '&code=' + code + '&state=' + state; //가져온 code, state값이 들어감.(?)
    //var request = require('request'); //request 모듈 다운받기(npm install request -s) -> package.json안에 다운로드 버전 확인가능
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
    
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'}); //출력형식 지정
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'}); //html형태로 출력

        accesstoken = JSON.parse(body).access_token; //var (X)!!! //-> 전역으로 선언돼서, 선언된 함수를 벗어나면 사라진다.(선언된 함수 외부에서 인식할 수 없다.)
        refreshtoken= JSON.parse(body).refresh_token;
        Body = JSON.parse(body);
        
        //console.log(body);
        console.log(Body);
        console.log(accesstoken);
        console.log(refreshtoken);
      } 
    });
  });


 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
 });