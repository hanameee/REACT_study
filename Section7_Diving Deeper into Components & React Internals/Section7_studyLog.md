## Section7_Diving Deeper into Components & React Internals

### 84) Project 디렉토리 구조 개선하기

기존에 우리가 사용했던 component 는 2개!

- app component (우리의 state를 담고 있는 main container)
- person component (1개의 person을 보여주는 functional component)

이 구조를 개선해보자!

일반적으로 state를 관리하는 `App.js` 같은 container component 는 UI rendering 에 깊게 관여하지 않는다.

다시 말하자면, `render()` 너무 많은 jsx 없이 lean 하게 유지되는 것이 좋다.

작은 app에서는 무관하지만, app 크기가 커지면 더 작은 component 들로 쪼개는 것이 좋겠지!



구조를 개선해보자.

![image-20190901162823725](/Users/hanameee/Library/Application Support/typora-user-images/image-20190901162823725.png)



src 밑에 assets (이미지 파일 등), components (Persons, Cockpit), containers 으로 경로를 분리했다.

이렇게 디렉토리를 나눔으로써 improved & focused 된 component structure을 가질 수 있다.



### 85)

App.js에서 새롭게 분리한 cockpit과 persons 컴포넌트를 맹글어보자.

