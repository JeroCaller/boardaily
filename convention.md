이 글은 후에 까먹을 것을 대비해 개인적으로 참고하기 위해 적어두는 내용임.

목차

* [0. 용어 정의](#용어-정의)   
* [1. Content 관련 규칙](#content-관련-규칙)   
    * [1.1 새로운 툴 컴포넌트 추가 시 이미지 아이콘 추가 규칙](#새로운-툴-컴포넌트-추가-시-이미지-아이콘-추가-규칙)
    * [1.2 배경 이미지 추가 규칙](#배경-이미지-추가-규칙)
* [2. 코딩 관련 규칙](#코딩-관련-규칙)
    * [2.1 툴 컴포넌트 추가 규칙](#툴-컴포넌트-추가-규칙)

# 용어 정의
- 툴 (tool): 웹 페이지에서 사용자가 사용할 수 있는 계산기, 달력 등을 일컫음. 좀 더 정확한 묘사를 위해 툴 컴포넌트(tool component)라고도 하겠음.

# Content 관련 규칙

## 새로운 툴 컴포넌트 추가 시 이미지 아이콘 추가 규칙

index.html 또는 table.html의 사이드 메뉴에 표시할 새 툴을 추가할 경우, 그 툴에 해당하는 이미지 아이콘 추가 시 다음의 규칙을 따른다. 

1. 이미지는 /images 폴더 내부에 넣는다. /images 폴더 내 하위 폴더에 넣지 않고 해당 폴더 바로 아래에 넣도록 주의한다. 
2. /content-data/tools-info.json에 배열 내 객체를 생성하여 다음의 내용들을 프로퍼티 형식으로 차례로 입력.
    - name : 툴 이름 ex) 계산기
    - img-src : 추가한 이미지 경로. /images로 시작한다.   
      ex) /images/calculator.png
    - hover-bgcolor : 마우스 hover시 변경될 배경색 지정. index.html 화면에서만 적용됨. css의 background-color 속성값 지정하는 것과 동일함. ex) #121212. 만약 null로 지정하면, 기본 색으로 자동 지정된다. 기본 색은 /css/variables.css 파일의 --tool-thumbnail-default-bgcolor css 변수에 지정되어 있음. 

예시)
```JSON
[
    {
        "name": "계산기",
        "img-src": "/images/calculator.png",
        "hover-bgcolor": null
    },
    {
        "name": "나이 계산기",
        "img-src": "/images/age.png",
        "hover-bgcolor": "#fffdb5"
    },
]
```

위 과정을 따르면 자동으로 index.html의 메인, table.html에서의 사이드 메뉴에 자동으로 해당 툴 화면이 추가될 것이다. 

- 용량을 최대한 줄이기 위해, 이미지 사이즈는 512 x 512 이하로 한다(보통 이러면 1MB 이하로 이미지 용량을 줄일 수 있다). 미관상 되도록 정사각형으로 한다. 
- 이미지 이름을 신중히 짓는 게 좋다. 이미지 이름은 url의 맨 마지막에 hash로 추가되기 때문이다. ex) 이미지 파일명이 calculator.png라 하면, 해당 툴 화면으로 넘어가면 url에 https://www.boardaily.com/html/table.html#calculator 형식으로 표현된다. 

## 배경 이미지 추가 규칙
table.html 페이지의 배경으로 나타낼 이미지 추가 시 다음의 규칙을 따른다. 

1. /images/background/ 폴더 내에 배경 이미지를 넣는다. /images 폴더 바로 아래에 넣지 않도록 주의한다. /images 폴더 직속 이미지들은 툴 아이콘으로 쓰일 이미지이기 떄문이다. 
2. 그 후, /content-data/background-images.json 파일에서, 배열 내 객체를 생성하고, 다음의 형식으로 앞서 추가한 이미지에 대한 정보를 프로퍼티 형식으로 기입한다. 
    - path : /images/background/ 폴더 내에 삽입한 해당 이미지 경로. 이 때, /images/background/ 경로는 생략한다. 이미지 확장자도 같이 작성해야 한다.    
    ex) /images/background/board.png 경로로 이미지를 삽입한 경우, "path": "board.png"라고 작성한다. 
    - category : 해당 이미지에 대한 카테고리를 짧게 작성.   
    ex) 해당 이미지가 AI로 생성된 이미지임을 강조하고자 한다면 "category": "AI-gen" 형식으로 작성.     
    만약 카테고리를 설정하고 싶지 않다면 null을 기입. 

예시) 
```JSON
[
    {
        "path": "board1.png",
        "category": "AI-gen"
    },
    {
        "path": "board2.png",
        "category": "AI-gen"
    }
]
```

위 과정을 따르면 table.html의 설정 모달 창에 해당 배경 이미지가 자동으로 뜨며, 사용자가 해당 이미지를 클릭하면 해당 웹 페이지의 배경 이미지로 자동 설정된다. 또한, 설정 창에서 해당 이미지 위로 마우스를 올려 두면 "이미지명 (카테고리)" 형식으로 툴팁 캡션이 뜬다. 만약 카테고리를 설정하지 않았다면 "이미지명" 형식으로 뜬다. 

- 용량 감소를 위해, 배경 이미지는 정사각형의 경우 512 x 512, 한 쪽 길이가 긴 경우 512 X 900 또는 900 X 512 이하로 그 사이즈를 줄여서 넣는 것이 좋다. 
- 이미지 자체는 코드에 비해 용량을 크게 차지하기에, 가급적 이미지를 많이 넣을려고 하진 말자.

# 코딩 관련 규칙

## 툴 컴포넌트 추가 규칙
새로운 툴 컴포넌트를 추가하기 위해선 다음의 규칙을 따른다. 

1. 툴 컴포넌트는 HTMLElement를 상속하는 커스텀 요소 정의 클래스를 사용하여 정의한다. 그리고 다른 이유가 없는 한 shadow DOM을 사용한다.

2. 이를 위해, 우선 /js/table-page/ 폴더 내에 새로운 툴 컴포넌트를 정의하기 위해 쓰일 새 폴더를 생성한다. 예를 들어 계산기를 구현하고자 한다면 /js/table-page/calculator 와 같이 폴더를 생성하면 되겠다. 

3. 해당 폴더에 새 .js 파일을 생성한다. 해당 파일명은 자유롭게 지으면 되는데, 이왕이면 툴 이름으로 짓는 것이 좋겠다. 계산기를 구현하고자 한다면 calculator.js 와 같이 파일명을 짓는다. 

4. 3에서 새로 만든 js 파일 내부에 /js 폴더 내 template.js 내용을 복사, 붙여넣기 한다. template.js 파일 내부에는 shadow DOM을 이용한 웹 컴포넌트 형식으로 툴을 구현하기 위한 템플릿이 준비되어 있어 이를 사용하는 것이다. 복사 후, 쓸데없는 주석은 삭제해도 되고, 커스텀 요소 클래스명, 태그명은 툴 이름으로 바꾸면 된다. 

5. 2에서 생성한 새로운 툴 컴포넌트 폴더 내에 툴 요소를 화면에 표시하기 위한 HTML, 해당 툴의 스타일을 꾸미기 위한 CSS 파일도 새로 생성한다. 역시 툴 이름을 따르면 되겠다. ex) calculator.html, calculator.css. 그리고 해당 html, css 경로를 앞선 자바스크립트 파일 내 각각 _setInnerHTML() 메서드 내부 fetch() 함수 인자, _setStyle() 메서드 내 href 값으로 차례대로 대입한다. 이 때 경로는 /js/table-page/calculator/calculator.html 와 같이 절대 경로로 지정해야 작동된다(상대 경로로 해보니 작동이 되질 않는다). 

6. 5번까지 했다면 해당 폴더 구조가 대략 다음과 같을 것이다. 
```
/js
  /table-page
    /calculator
      calculator.html
      calculator.css
      calculator.js
```

7. 이제 앞서 만든 html, css, js 파일에서 툴을 자유롭게 구현하면 된다. 

* 참고
    * html, css의 코드 길이가 별로 길지 않다면 js 파일 내에 문자열 형태로 작성해도 된다. 다만, 조금이라도 코드가 길어질 경우, html, css 언어와 js 언어 간 구분이 잘 안되어 가독성이 떨어질 수도 있다. 따라서 가급적 좀 더 원활한 유지보수를 위해 html, css 코드는 따로 파일로 분리하여 작성하고, js 파일에서 이를 \<link\>, fetch() 등의 수단으로 불러오는 방식을 사용하는 것을 추천함.

    * 하나의 툴 컴포넌트를 구성하는 커스텀 요소 자체의 코드가 너무 길어져 일부를 하위 커스텀 요소로 정의하는 형식으로 사용할 수도 있다. 예를 들어, 계산기를 구현하는 커스텀 요소명을 \<my-calculator\>라고 정의한 경우, 해당 html 구조가 너무 길어져 계산기 구성 요소 중 계산 결과를 보여주는 display 부분을 따로 \<calc-displayer\> 요소로 정의하여 \<my-calculator\> 요소의 하위 요소로 사용할 수 있다. 이 경우, 하위 커스텀 요소는 shadow DOM을 사용해도 되고 light DOM으로 정의해도 상관없다. 다만, 하위 커스텀 요소를 shadow DOM으로 정의할 시 상위 커스텀 요소에서 \<slot\>을 통해 하위 커스텀 요소를 불러오도록 주의한다. 그렇지 않으면 상위 커스텀 요소에서 shadow root를 두 번이나 재정의하는 셈이기에 DOMException 에러가 뜰 것이다. 여기까지의 설명에 대한 자세한 사례는 /js/table-page/calendar/ 폴더 참조. 해당 폴더에서는 달력 자체를 구현하는 \<custom-calendar\> 커스텀 요소와 이 달력의 제목을 구성하는 \<calendar-title\> 커스텀 요소가 \<custom-calendar\> 의 하위 요소로 구성되어 있다. 해당 하위 요소는 light DOM으로 구현되어 있다. /js/table-page/side-menu/ 폴더도 참고하면 좋다. 사이드 메뉴의 아이템을 구현하는 \<menu-item\> 요소가 사이드 메뉴 자체를 구현하는 \<side-menu\> 상위 커스텀 요소의 하위 커스텀 요소로 사용되고 있으며, 두 요소 모두 shadow DOM으로 구현되어 있다. 이 경우, 상위 커스텀 요소에서 하위 커스텀 요소를 불러오기 위해 \<slot\> 태그를 사용하고 있다.

8. 구현이 완료되면 이를 table.html에 보이도록 등록하는 절차를 거쳐야 한다. /js 폴더 내 table.js 내에서 앞서 작성한 js 파일 내 createYourCustomElement 함수(이름이 툴 이름으로 바뀌어 있을 것이다)를 import 한다. 
예)
```javascript
// table.js
import { createCalculateElement } from './table-page/calculator/calculator.js';
```

9. table.js 파일 내 attachToolElement 함수 내부에 switch 구문이 있을 것이다. 해당 구문은 다음의 형식을 가지고 있다. 

```javascript
// table.js
function attachToolElement(currentPageName, parentElement) {
    if (parentElement.hasChildNodes()) {
        for (let i = 0; i < parentElement.childElementCount; i++) {
            parentElement.removeChild(parentElement.children[i]);
        }
    }

    let toolElement;
    switch (currentPageName) {
        case "calculator":
            toolElement = createCalcElement();
            break;
        case "age":
            toolElement = createAgeCalcElement();
            break;
        case "calendar":
            toolElement = createCalendarElement();
            break;
        case "todolist":
            toolElement = createTodoListElement();
            break;
        case "watch":
            toolElement = createWatchElement();
            break;
        case "date-calculator":
            toolElement = createDateCalculatorElement();
            break;
        case undefined:
            break;
        default:
            toolElement = document.createElement('div');
            toolElement.insertAdjacentHTML('beforeend', `
                <img src="/images/under-construction.png", alt="공사 중">
                <h1 style="text-align:center">공사 중!</h1>
            `);
    }
    if (toolElement) {
        parentElement.append(toolElement);
    } else {
        parentElement.insertAdjacentHTML('beforeend', 
        `<h1><- 사이드 메뉴에서 원하시는 도구를 선택하세요.</h1>`);
    }
    return parentElement;
}
```
switch 구문 내에 case를 작성한다. case 이름은 앞서 [## 1.1 새로운 툴 컴포넌트 추가 시 이미지 아이콘 추가 규칙](#새로운-툴-컴포넌트-추가-시-이미지-아이콘-추가-규칙) 에서 툴 아이콘으로 추가한 이미지 파일명을 따른다. ex) calculator.png로 툴 이미지 지정 시, `case "calculator":` 형식으로 지정한다.   
해당 케이스 내부에는 `toolElement = createYourCustomElement();` 형식으로 작성한다. 여기까지 완료하면, index.html 메인 화면이나 table.html의 사이드 메뉴에서 해당 툴을 클릭하면 table.html의 메인에서 해당 툴을 볼 수 있고, 사용도 할 수 있게 된다. 
