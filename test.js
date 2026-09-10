let textEditor=document.querySelector('.text-editor-content');

let italicBtn=document.querySelector('.tef1-italic-btn');
let boldBtn=document.querySelector('.tef1-bold-btn');
let strokeBtn=document.querySelector('.tef1-stroke-btn');
let underlineBtn=document.querySelector('.tef1-underline-btn');
let aboveRegBtn=document.querySelector('.tef1-aboveReg-btn');
let underRegBtn=document.querySelector('.tef1-underReg-btn');

//хранит состояния стилей (вкл/выкл)
let formateStatesList={
    em: false,
    strong: false,
    del: false,
    u: false,
    sup: false, //выше
    sub: false //ниже
}

//возвращает диапазон выделения
function getRangeSelected(){
    let selection=window.getSelection();
    if(!selection||selection.rangeCount===0)return null;
    const range=selection.getRangeAt(0);
    if(textEditor.contains(range.commonAncestorContainer)&&range.toString().length>0){
        return range;
    }
    return null;
}

//возвращает какие стили включены
function formateState(){
    let statesEnabled=[];
    for(let key in formateStatesList){
        if(formateStatesList[key]===true){
            statesEnabled.push(key);
        }
    }
    return statesEnabled;
}

//сброс
function resetFormateStatesList(){
    for(let key in formateStatesList){
        formateStatesList[key]=false;
    }
}

//форматирует !!выделенный!! текст
function formateText(){
    const range=getRangeSelected();
    if(!range)return;
    const activeTags=formateState();
    if(activeTags.length===0)return;

    const extractedContent = range.extractContents(); 
    let parentElement=null;
    let innerElement=null;
    activeTags.forEach((tag,index)=>{
        const newElement=document.createElement(tag);
        index===0?parentElement=newElement:innerElement.appendChild(newElement);
        innerElement=newElement;
    });
    innerElement.appendChild(extractedContent);
    range.insertNode(parentElement);

    window.getSelection().removeAllRanges();
    resetFormateStatesList();
}
//добавить форматирование текста, который пишет пользователь

function chooseFormBtn(e){    
    if(e.ctrlKey||e.metaKey){
        switch(e.key.toLowerCase()){
            case 'i':
                e.preventDefault();
                formateStatesList.em=!formateStatesList.em;
                break;
            case 'b':
                e.preventDefault();
                formateStatesList.strong=!formateStatesList.strong;
                break;
            case 'd':
                e.preventDefault();
                formateStatesList.del=!formateStatesList.del;
                break;
            case 'u':
                e.preventDefault();
                formateStatesList.u=!formateStatesList.u;
                break;
        }
    }
    if((e.ctrlKey||e.metaKey)&&e.shiftKey){
        switch(e.code){
            case 'Equal':
                e.preventDefault();
                formateStatesList.sup=!formateStatesList.sup;
                break;
            case 'Minus':
                e.preventDefault();
                formateStatesList.sub=!formateStatesList.sub;
                break;
        }
    }
}

// нажатие на ctrl+someKey
// текст выделен?получить диапазон выделения, обернуть его в необходимый тег, поменять значение кнопки:поменять значение кнопки

textEditor.addEventListener('keydown',(e)=>{
    // if()   sth for buttons if text was not selected
    chooseFormBtn(e);
    formateText();
})


