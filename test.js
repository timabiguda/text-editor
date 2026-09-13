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
    if(textEditor.contains(range.commonAncestorContainer)){
        return range;
    }
    return null;
}

//возвращает какие стили включены
function formateState(){
    // let statesEnabled=[];
    // for(let key in formateStatesList){
    //     formateStatesList[key]?statesEnabled.push(key):console.log('стиль не задан');
    // }
    // return statesEnabled;
    return Object.keys(formateStatesList).filter(key=>formateStatesList[key]);
}

//сброс
function resetFormateStatesList(){
    for(let key in formateStatesList){
        formateStatesList[key]=false;
    }
}


function removeTag(range,tagName){
    if(!tagName)return false;
    let parent=range.commonAncestorContainer;
    if(parent.nodeType===Node.TEXT_NODE){
        parent=parent.parentNode;
    }

    const closestTag=parent.closest(tagName);
    if(closestTag&&textEditor.contains(closestTag)){
        const parentOfTag = closestTag.parentNode;        
        while(closestTag.firstChild){
            parentOfTag.insertBefore(closestTag.firstChild, closestTag);
        }
        parentOfTag.removeChild(closestTag);
        return true;
    }
    return false;
}


//форматирует !!выделенный!! текст
function formateSelectedText(range,pressedTag){
    // const range=getRangeSelected();
    // if(!range||range.toString().length===0)return;
    if(removeTag(range,pressedTag)){
        window.getSelection().removeAllRanges();
        resetFormateStatesList();
        return;
    }

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


//вставляет теги в место где курсор
function formateEnteringText(range,pressedTag){
    if(removeTag(range,pressedTag)){
        resetFormateStatesList();
        return;
    }
    const activeTags=formateState();
    if(activeTags.length===0)return;

    let parentElement=null;
    let innerElement=null;

    activeTags.forEach((tag, index)=>{
        const newElement=document.createElement(tag);
        index===0?parentElement=newElement:innerElement.appendChild(newElement)
        innerElement = newElement;
    });
    const dietSpace = document.createTextNode('\u200B');
    innerElement.appendChild(dietSpace);

    range.deleteContents();
    range.insertNode(parentElement);

    const selection=window.getSelection();
    const newRange=document.createRange();

    newRange.setStart(dietSpace,1); 
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    resetFormateStatesList();
}

//добавить форматирование текста, который пишет пользователь

function chooseFormBtn(e){
    let isFormattingKey=false;
    let pressedTag='';

    if((e.ctrlKey||e.metaKey)&&e.shiftKey){
        switch(e.code){
            case 'Equal':
                e.preventDefault();
                formateStatesList.sup=!formateStatesList.sup;
                isFormattingKey=true;
                pressedTag = 'sup';
                break;
            case 'Minus':
                e.preventDefault();
                formateStatesList.sub=!formateStatesList.sub;
                isFormattingKey=true;
                pressedTag='sub';
                break;
        }
    }
    else if(e.ctrlKey||e.metaKey){
        switch(e.key.toLowerCase()){
            case 'i':
                e.preventDefault();
                formateStatesList.em=!formateStatesList.em;
                isFormattingKey=true;
                pressedTag='em';
                break;
            case 'b':
                e.preventDefault();
                formateStatesList.strong=!formateStatesList.strong;
                isFormattingKey=true;
                pressedTag='strong';
                break;
            case 'd':
                e.preventDefault();
                formateStatesList.del=!formateStatesList.del;
                isFormattingKey=true;
                pressedTag='del';
                break;
            case 'u':
                e.preventDefault();
                formateStatesList.u=!formateStatesList.u;
                isFormattingKey=true;
                pressedTag='u';
                break;
        }
    }

    if(isFormattingKey){
        const range = getRangeSelected();
        if(!range)return;
        const hasSelection=range.toString().length>0;
        if(hasSelection){
            formateSelectedText(range,pressedTag);
        }else{
            formateEnteringText(range,pressedTag);
        }
    }
}

// нажатие на ctrl+someKey
// текст выделен?получить диапазон выделения, обернуть его в необходимый тег, поменять значение кнопки:поменять значение кнопки

textEditor.addEventListener('keydown',(e)=>{
    // if()   sth for buttons if text was not selected
    chooseFormBtn(e);
})


