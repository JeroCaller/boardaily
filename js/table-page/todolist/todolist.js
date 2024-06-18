import * as helper from '../../helper.js';
import * as uiLogic from './todolist-ui-logic.js';

const TODO_ITEM_LIMIT = 10;

class TodoItem extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await this.combineStyleAndHTML();
        this.getElements();
        this.showTodoNum();
        this.setEventHandlers();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="/js/table-page/todolist/todoitem.css">`;
    }

    async _setInnerHTML() {
        return await fetch('/js/table-page/todolist/todoitem.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    getElements() {
        this.checkIcon = this.querySelector('.check-icon');
        this.inputText = this.querySelector('input[type="text"]');
        this.controlIcon = this.querySelector('.control');
        this.todoNumLabel = this.querySelector('label');
    }

    showTodoNum() {
        this.todoNumLabel.textContent = this.getAttribute('id').match(/\d+/)[0];
    }

    setEventHandlers() {
        // 체크박스를 누를 때마다 입력창의 텍스트 상태와 체크박스 아이콘 상태를 바꾼다. 
        this.checkIcon.addEventListener('click', event => {
            if (event.target.innerText == "check_box_outline_blank") {
                // 체크박스가 체크된 상황.
                event.target.innerText = "check_box";
                uiLogic.underlineInputText(true, this.inputText);
            } else if (event.target.innerText = "check_box") {
                event.target.innerText = "check_box_outline_blank";
                uiLogic.underlineInputText(false, this.inputText);
            }
        });

        /**
         * todo item 내 텍스트 변화 시 이를 로컬 스토리지에 저장한다. 
         * 저장 방식은 다음과 같다. 
         * (local storage 내부를 가상으로 나타냄)
         * {
         *     'todo-item-1': {state: stateValue, content: contentValue},
         *     'todo-item-2': {state: stateValue, content: contentValue},
         *     ...
         * }
         */
        this.inputText.addEventListener('change', () => {
            let objLiteral = {
                state: this.checkIcon.innerText, 
                content: this.inputText.value
            };
            localStorage.setItem(this.getAttribute('id'), JSON.stringify(objLiteral, null, 2));
            //uiLogic.printLocalStorage();
        });

        /**
         * 체크 버튼 클릭 시 해당 상태를 로컬 스토리지에 저장한다. 
         */
        this.checkIcon.addEventListener('click', () => {
            let targetKey = localStorage.getItem(this.getAttribute('id'));
            if (!targetKey) {
                return;
            }

            let targetValue = JSON.parse(targetKey);
            targetValue.state = this.checkIcon.innerText;
            localStorage.setItem(this.getAttribute('id'), JSON.stringify(targetValue, null, 2));

            //uiLogic.printLocalStorage();
        });
    }
}

class TodoList extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.getElement();
        this.initTodoFromLocalStorage();
        this.setEventHandlers();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="/js/table-page/todolist/todolist.css">`;
    }

    async _setInnerHTML() {
        return await fetch('/js/table-page/todolist/todolist.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    getElement() {
        this.ul = this.shadowRoot.querySelector('ul');
    }

    _getDataFromLocalStorage() {
        if (localStorage.length == 0) {
            return;
        }

        /**
         * todoData = {
         *     'key1' : {state: stateValue, content: contentValue},
         *     ...
         * }
         */
        let todoData = {};
        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (!key.match(/todo-item-\d+/)) {
                continue;
            }
            todoData[key] = JSON.parse(localStorage.getItem(key));
        }

        return todoData;
    }

    /**
     * @param {object} todoData - json 파싱된 로컬 스토리지 데이터.
     * @returns - todoKeyAndId = [
     *    [1, 'todo-item-1'],
     *    [3, 'todo-item-3],
     *    ...
     * ]
    */
    _getTodoIdNumFromLocalStorage(todoData) {
        let todoKeyAndId = [];
        for (let propKey in todoData) {
            todoKeyAndId.push([parseInt(propKey.match(/\d+/)[0]), propKey]);
        }
        todoKeyAndId.sort((a, b) => {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            return 0;
        });
        return todoKeyAndId
    }

    /**
     * 처음 투두 리스트 화면 진입 시 기존의 local storage 내 저장된 데이터가 있다면 
     * 이를 불러와 투두 아이템에 채워 화면에 출력한다. 
     * @returns {boolean} - true: 로컬 스토리지에 todo item 데이터가 있는 경우.
     * false: 로컬 스토리지에 todo item 데이터가 하나도 없는 경우.
     */
    initTodoFromLocalStorage() {
        //localStorage.clear();

        let todoData = this._getDataFromLocalStorage();
        if (!todoData) {
            return false;
        }

        // 현재 화면 상에 존재하는 투두 아이템들을 모두 삭제한다.
        for (let i = 0; i < this.ul.children.length; i++) {
            this.ul.removeChild(this.ul.children[i]);
        }

        let todoKeyAndId = this._getTodoIdNumFromLocalStorage(todoData);

        // <todo-item>의 id 지정.
        let todoItemElement;
        for (let [_, idStr] of todoKeyAndId) {
            todoItemElement = document.createElement('todo-item');
            todoItemElement.setAttribute('id', idStr);
            this.ul.appendChild(todoItemElement);
        }

        // <todo-item> 내 각 요소들에 로드된 텍스트 지정.
        helper.waitForRenderingAndExecuteFunc(() => {
            for (let i = 0; i < this.ul.children.length; i++) {
                let checkIcon = this.ul.children[i].querySelector('button[class~=check-icon]');
                let inputText = this.ul.children[i].querySelector('input[type="text"]');
                let todoLabel = this.ul.children[i].querySelector('label');
                checkIcon.innerText = todoData[this.ul.children[i].id].state;
                inputText.value = todoData[this.ul.children[i].id].content;
                todoLabel.textContent = this.ul.children[i].id.match(/\d+/)[0];
                uiLogic.underlineInputText(
                    checkIcon.innerText == 'check_box',
                    inputText
                );
            }
        }, this.ul.lastChild);

        return true;
        
        //uiLogic.printLocalStorage();
    }

    /**
     * local storage 내 저장되는 투두 아이템의 id 넘버값을 재할당하여 
     * 1, 2, 3, ... 형태의 연속된 자연수 배열이 되도록 한다.
     */
    _reassignIdToLocalStorage() {
        let todoIdArr = this._getTodoIdNumFromLocalStorage(this._getDataFromLocalStorage());
        let countCurrentNum = 0;
        for (let [idNum, idStr] of todoIdArr) {
            if (idNum - countCurrentNum != 1) {
                let contentStr = localStorage.getItem(idStr);
                localStorage.removeItem(idStr);
                idStr = 'todo-item-' + (countCurrentNum + 1);
                localStorage.setItem(idStr, contentStr);
            }
            countCurrentNum += 1;
        }
    }

    _checkIfEmptyTodoItem() {
        for (let i = 0; i < this.ul.children.length; i++) {
            if (!this.ul.children[i].querySelector('input[type="text"]').value) {
                return this.ul.children[i].id.match(/\d+/)[0];
            }
        }
        return null;
    }

    showTodoNums() {
        for (let i = 0; i < this.ul.children.length; i++) {
            this.ul.children[i].querySelector('label').textContent = this.ul.children[i].id.match(/\d+/)[0];
        }
    }

    addTodoItem() {
        if (this.ul.childElementCount >= TODO_ITEM_LIMIT) {
            // 아이템 개수 제한으로 새 아이템 생성 실패 시 false 반환.
            alert(`생성 가능한 최대 투두 목록 개수는 ${TODO_ITEM_LIMIT}입니다. 현재 최대 개수에 도달했습니다.`);
            return;
        }

        let checkResult = this._checkIfEmptyTodoItem();
        if (checkResult) {
            alert(`${checkResult}번째 투두 목록에 아무런 텍스트도 입력되지 않았습니다. \n현존하는 모든 투두 목록에 텍스트가 입력되어야만 새 투두 아이템이 생성됩니다.`);
            return;
        }

        const todoItemElement = document.createElement('todo-item');
        todoItemElement.setAttribute('id', `todo-item-${this.ul.childElementCount + 1}`);
        this.ul.appendChild(todoItemElement);
    }

    deleteTodoItem(eventTarget) {
        let targetTodoItem = eventTarget.parentNode.parentNode;
        localStorage.removeItem(targetTodoItem.id);
        this.ul.removeChild(targetTodoItem);

        // id 넘버 재할당.
        for (let i = 0; i < this.ul.children.length; i++) {
            this.ul.children[i].setAttribute('id', `todo-item-${i+1}`);
        }

        this._reassignIdToLocalStorage();
        this.showTodoNums();
    }

    /**
     * 로컬 스토리지 내 todo item에 해당하는 모든 데이터들을 삭제한다. 
     * 해당 웹 페이지에서 todo item과는 상관없는 다른 데이터들을 로컬 스토리지에 
     * 저장시킬 가능성도 있어 이 경우 localStorage.clear()를 사용하면 todo item이 아닌 
     * 다른 데이터들도 삭제되므로 todo item 데이터들만 삭제한다. 
     */
    _deleteAllTodoItemsInLocalStorage() {
        let keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (!key.match(/todo-item-\d+/)) {
                continue;
            }
            keys.push(key);
        }
        for (let k of keys) {
            localStorage.removeItem(k);
        }

        //uiLogic.printLocalStorage();
    }

    /**
     * 화면 상에 있는 모든 todo item 컴포넌트들을 DOM에서 삭제한다. 
     */
    _delelteAllTodoItemsInUl() {
        this.ul.replaceChildren(); // 아무런 인자를 대입하지 않으면 모든 자식 노드들이 삭제된다.
    }

    setEventHandlers() {
        // 클릭한 버튼 종류에 따른 이벤트 핸들러 설정.
        this.shadowRoot.addEventListener('click', event => {
            if (event.target.tagName == "BUTTON" 
            && event.target.attributes['class']) {
                if (event.target.attributes['class'].nodeValue.split(' ').indexOf('add') != -1) {
                    this.addTodoItem();
                } else if (event.target.attributes['class'].nodeValue.split(' ').indexOf('delete') != -1) {
                    this.deleteTodoItem(event.target);
                } else if (event.target.attributes['class'].nodeValue.split(' ').indexOf('delete-all') != -1) {
                    let ok = confirm(`정말로 모든 투두 아이템들을 삭제하시겠습니까? 해당되는 모든 데이터가 영구히 삭제됩니다.`);
                    if (ok) {
                        this._deleteAllTodoItemsInLocalStorage();
                        this._delelteAllTodoItemsInUl();
                    }
                }
            }
        });
    }
}

export function createTodoListElement() {
    try {
        customElements.define('todo-list', TodoList);
        customElements.define('todo-item', TodoItem);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('todo-list');
}
