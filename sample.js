//네이버 로그인 Node.js 예제는 1개의 파일로 로그인요청 및 콜백 처리를 모두합니다.

//express 모듈 사용
var express = require('express');
const request = require('request');

//express()는 app이라는 객체를 return해서 -> app.set, app.get 등이 가능
var app = express();

/*
var client_id = 'YOUR_CLIENT_ID';
var client_secret = 'YOUR_CLIENT_SECRET';
var state = "RANDOM_STATE";
var redirectURI = encodeURI("YOUR_CALLBACK_URL"); //redirectURI = 로그인 창
var api_url = "";
*/

var client_id = 'lQQMGAXDPyBpJ4nDeqhL'
var client_secret = 'HtjKR6HLXo';
var state = Math.random();
var redirectURI = encodeURI("http://127.0.0.1:3000/callback");
var api_url = "";

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

 app.get('/callback', function (req, res) {
    //req.query -> 경로의 각 쿼리 문자열 매개변수에 대한 속성이 포함된 객체이다.
    //->쿼리스트링의 값을 가져온다.(ex. http://query/search?searchWorld=쿼리스트링의 값)
    //->{ searchWorld : '쿼리스트링의 값' } (?)
    code = req.query.code; //query의 code값 요청해서 가져옴(?)
    state = req.query.state;
    //로그인 성공하면 뜨는 창
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state; //가져온 code, state값이 들어감.(?)
    var request = require('request'); //request 모듈 다운받기(npm install request -s) -> package.json안에 다운로드 버전 확인가능
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
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'}); //출력형식 지정
        res.end(body); //options을 요청했을 때, 서버에서 주는 정보를 body에 담아서 출력
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });

  app.get('/user', function (req, res) {
    api_uri = 'https://openapi.naver.com/v1/nid/me'
    + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
  
    var options = {
        url: api_uri,
        headers: {
          'Authorization': 'Bearer AAAAOVh-UI4JDGuyzE-VGWGe6d9ZDiB4FPOQljVyhORq2pcwcvRXuA-4io0KRxLZa5ZR58bgLyLYkv7wlD1pECt3-hI'}
    };

    request.get(options, function (error, response, body){
      if(!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(body);
      }
    })
  
  })


/*
  //3.4.5 접근 토큰을 이용하여 프로필 API 호출하기
  app.get('/callback', function (req, res) {
    api_uri = 'https://openapi.naver.com/v1/nid/me'
  )}
  */


 app.listen(3000, function () {
   console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
 });