#Understanding Web Application

References

1) [생활코딩 Youtube : Server Side JS - http ](https://www.youtube.com/watch?v=t1UtCblLk_0)

2) [Mozilla - HTTP 개요](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview)



## 1. HTTP

HTTP는 HTML 문서와 같은 리소스들을 가져올 수 있도록 해주는 프로토콜임.

### Request & Response Header

웹 브라우저와 웹 서버 사이에는 HTTP 라는 통신 방법을 통해서 서로가 정보를 주고받는데, 그 통신 방법의 핵심은 Request Header 과 Response Header 이다. 브라우저인 클라이언트에 의해 전송되는 메시지는 요청(requests), 그에 대해 서버에서 응답으로 전송되는 메시지는 응답(responses)이다.

크롬 개발자도구의 `Network` 에서 expressjs.com 이름의 HTML 파일의 Headers를 보면, **Request Headers** 라고 되어있는 부분이 웹 브라우저가 웹 서버에게 요청할 때 **작성한 요청서**이다. 우리는 주소만 입력하고, 웹 브라우저가 우리 대신에 자동으로 Request Headers 를 만들어서 웹 서버에게 보낸다.

![image-20190825134331557](/Users/hanameee/Library/Application Support/typora-user-images/image-20190825134331557.png)

웹 브라우저는 Request Headers 에 따라서 어떤 정보를 만든 다음에, 그것을 Response Header 라고 하는 응답 헤더를 통해서 웹 브라우저에게 보내준다.

웹 브라우저는 Response Header에 적혀있는 내용을 참고로 해서 여러가지 내용들을 작업함.

**Request Header 예시**

```http
:authority: expressjs.com
:method: GET
:path: /
:scheme: https
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
accept-encoding: gzip, deflate, br
<!-- 웹 브라우저와 웹 서버가 서로 데이터를 주고 받을때, 웹 서버에서 응답하는 내용이 너무 크면 gzip 방식으로 웹서버가 압축을 해서 웹 브라우저에게 쏴준다. 그런데 이때 웹 브라우저가 이걸 해제할 수 있는 능력이 없으면 안되니까! 웹 브라우저가 "나는 압축을 해제할 수 있는 능력이 있어" 라고 쏴주면 웹 서버가 압축해서 보내줄 수 있겠지 -->
accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
<!-- 웹 브라우저가 처리할 수 있는 언어들이 이런 것이다 -->
cache-control: no-cache
cookie: __cfduid=d9717cd2c41c2f0ebe928e9a512ce95c11565064134
pragma: no-cache
upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) 
<!-- 접속한 웹 브라우저의 종류에 따라 ex.모바일,데스크탑 최적화된 페이지를 보여준다 -->
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36
```

**Response Header 예시**

```http
access-control-allow-origin: *
cache-control: max-age=600
cf-ray: 50bae61feed477d6-LAX
content-encoding: br
content-type: text/html; charset=utf-8
<!-- 응답한 정보가 html 이고, utf-8 방식으로 인코딩 되었다 -->
date: Sun, 25 Aug 2019 04:42:22 GMT
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
expires: Sun, 25 Aug 2019 04:45:16 GMT
last-modified: Fri, 12 Jul 2019 22:05:50 GMT
server: cloudflare
status: 200
vary: Accept-Encoding
x-github-request-id: C214:0BA9:1B66A5:23FF66:5D6211AE
x-proxy-cache: HIT
```



### HTTP Process

####STEP1. TCP 연결

TCP 연결은 요청을 보내거나 응답을 받는데 사용됨. 클라이언트는 새 연결을 열거나, 기존 연결을 재사용하거나, 서버에 대한 여러 TCP 연결을 열 수 있음

#### STEP2. HTTP 메시지 전송

```http
GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr
```

#### STEP3. 서버에 의해 전송된 응답 읽어들이기

```http
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT
ETag: "51142bc1-7449-479b075b2891b"
Accept-Ranges: bytes
Content-Length: 29769
Content-Type: text/html

<!DOCTYPE html... (here comes the 29769 bytes of the requested web page)
```

#### STEP4. 연결을 닫거나 다른 요청 재사용



### HTTP Pipeline





### HTTP Message

HTTP Message에는 2가지 Type이 있다. (1) Request  (2)Responses

#### HTTP Request

![A basic HTTP request](https://mdn.mozillademos.org/files/13687/HTTP_Request.png)

- Method: 클라이언트가 수행하고자 하는 동작을 정의한 GET, POST 같은 동사 혹은 OPTIONS, HEAD 같은 명사. 일반적으로 클라이언트는 GET을 사용하여 리소스를 가져오거나 POST를 사용하여 HTML form의 데이터를 전송하려고 하지만, 다른 동작이 요구도리 수도 있음.
- Path: 가져오려는 리소스의 경로. 프로토콜 (http://), 도메인(naver.com), TCP포트(default - 80)를 제거한 리소스의 URL
- Version of the protocol: HTTP 프로토콜의 버전
- Headers: 서버에 대한 추가 정보를 전달하는 선택적 헤더들
- POST와 같은 몇몇 메서드를 위한, 전송된 리소스를 포함하는 본문



#### HTTP Response

![img](https://mdn.mozillademos.org/files/13691/HTTP_Response.png)

- Version of the protocol: HTTP 프로토콜의 버전
- Status code: 요청의 성공 여부와, 그 이유를 나타내는 상태 코드
- Status message: 상태 코드의 짧은 설명을 나타내는 상태 메세지 (영향력X)
- Headers: HTTP 헤더들
- (Optional) 가져온 리소스가 포함되는 본문



## 2. API

API = Application Programming Interface

API is the messenger that takes requests and tells a system what you want to do and then returns the response back to you.

API is kind of interface which has a set of functions that allow programmers to access specific features or data of an application, operating system or other services.



## 3. WEB API

API over the web whic can be accessed using HTTP protocol. 

API 는 concept 이지 technology가 아니다! 다양한 언어를 가지고 Web API를 작성할 수 있음.

