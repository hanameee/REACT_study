#Understanding role of each tech stacks

`목적` 여러 기술 스택들의 역할과 각 스택들의 상호작용, 장단점에 대해 공부한다.



## React?

ReactJS is an open-source JavaScript library which is used for building user interfaces specifically for single page applications. It needs some back-end technology (like Django) to provide a RESTful API to it.

`why use REACT?`

\#1

React is currently the best front-end technology available, with its features like fast rendering(due to virtual DOM), very small size(only 38kB with gzip compression), one-way data handling, it really stands out from its competitors.

\#2

React.js is a modern Javascript which you could use to make SPA(Single Page Applications) and SSR(server -side rendering). React is one of the most used frontend frameworks having a quite larger community and backed by facebook.

## RESTful API?

참고 링크 : [medium - What exactly IS an API?](https://medium.com/@perrysetgo/what-exactly-is-an-api-69f36968a41f)

![img](https://miro.medium.com/max/2560/1*eVGssbsoijih-xMlYFaGog.png)



API = Application Programming Interface

APIs allow applications to communicate with one another. API is not the database or even the server, it is the **code that governs the access point for the server**.

사람들이 API 라고 말할때, 실제로는 publicly available web-based API that returns data (likely in JSON or XML) 을 의미한다. 

Web-based APIs return data in response to a request made by a client. The allow us to go get data from outside sources.

1. We can send an API a request detailing the information we want.
2. APIs allow our sites to alter data on other applications, too. For instance, you’ve probably seen “Share on Facebook” or “Share on Twitter” buttons on miscellaneous websites. When/if you click one of these buttons, the site you’re visiting can communicate with your Facebook or Twitter account, and alter its data by adding new status or tweet.



## Django?

Django is a back-end web framework for developing web applications.



## Using REACT with Django

참고 링크 : [Quora - What are the benefits of using react.js with Django?](https://www.quora.com/What-are-the-benefits-of-using-react-js-with-Django)

`why?`

\#1

React or any front-end framework requires a RESTful API to interact to, creating the backend RESTful API with Django(which is a very powerful framework) is really easy and preferable.

Integrating React with Django is also simple, as far as i know, most people using Django uses webpack as front-end build tool and you can find a lot of articles on the internet for setting it up.

\#2

To get the data in the React, you just need API’s and that api’s could be in made in anything either it would be node or golang or any other language. Now about the Django, django is a framework based on the python , quite popular having a good community and also reduces some of your efforts while making backend. So, there is no kind of benefits both the things are completely different and are popular in there respective domains and yes you can use them together and ship good apps.



`how?`

1. **React will consume your** [**Django REST API**](http://www.django-rest-framework.org/tutorial/quickstart/). Front-ends and back-ends aren't connected in any way. React will make HTTP requests to your REST API in order to fetch and set data.
2. React, with the help of **Webpack (module bundler) & Babel (transpiler)**, will bundle and transpile your Javascript into single or multiple files that will be placed in the entry HTML page. **Learn Webpack, Babel, Javascript and React and Redux (a state container)**. I *believe* you won't use Django templating but instead allow React to render the front-end.
3. As this page is rendered, React will consume the API to fetch data so React can render it. Your understanding of **HTTP requests, Javascript (ES6), Promises, Middleware and React** is essential here.



## Webpack?



## Browserify?





## Ngnix?

