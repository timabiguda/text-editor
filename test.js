let textEditor=document.querySelector('.text-editor-content');

let italicsBtn=document.querySelector('.tef1-italics-btn');
let boldBtn=document.querySelector('.tef1-bold-btn');
let strokeBtn=document.querySelector('.tef1-stroke-btn');
let underlineBtn=document.querySelector('.tef1-underline-btn');
let underRegBtn=document.querySelector('.tef1-underReg-btn');
let aboveRegBtn=document.querySelector('.tef1-aboveReg-btn');


function getRangeSelected(){
    let selection=window.getSelection();
    if(!selection||selection.rangeCount===0)return null;
    const range=getRangeAt(0);
    if(textEditor.contains(range.commonAncestorContainer)&&range.toString().length>0){
        return range;
    }
    return null;
}

function formatingSelected(){

}


function formatingBtn(){

}
function chooseFormBtn(){

}

// нажатие на ctrl+someKey
// текст выделен?получить диапазон выделения, обернуть его в необходимый тег, поменять значение кнопки:поменять значение кнопки

textEditor.addEventListener('keydown',(e)=>{
    getRangeSelected();
    if(range){
        
    }
    // if()   sth for buttons if text was not selected

    if(e.ctrlKey&&e.code==='KeyB'){

    }
})


