document.getElementById('docs_submit').addEventListener('click',save,false)
document.getElementById("add_todolist").addEventListener('click', addTodoList, false);
document.getElementById("add_toggle").addEventListener('click', addToggleList, false);

var todo_count = 0;
var toggle_count = 0;
var image_count = 0;
var title;
var body;

function save() {

    if(document.getElementById("docs_title").value.length === 0) {
        alert("제목을 입력하세요.");
    }else{
        title = document.getElementById("docs_title").value;
        body =  document.getElementById("docs_contents_container").innerHTML;

        /* chrome.storage.sync.get('doc_id', async function (items) {
             alert(3333333333333);
             doc_id = items.doc_id;
             if (!chrome.runtime.error) {
                 alert(items.doc_id);
             }
         });
 */

        /*
                chrome.storage.sync.get('user_id', async function (items) {
                    alert(111111111);
                    user_id = items.user_id;
                    if (!chrome.runtime.error) {
                        alert(items.user_id);
                    }
                    await cibal();
                });*/


        cibal();
    }
}

function cibal(){
    var http = new XMLHttpRequest();
    try {
        http.open('POST',"https://sharesdocument.ml/doc", false );
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("user_id=" + user_id + "&doc_id=" + doc_id + "&doc_title=" + title + "&doc_body=" + body);
        //alert("hi");
        //alert(http.readyState);
        //alert(http.status);
        if(http.readyState === 4 && http.status === 201){
            //alert("hi");
            var response = JSON.parse(http.responseText);
            //alert(response.message);
            //alert(response.doc_id);
        }
        //alert("hi");
    }catch (e) {
        alert(e.toString());
    }
}

function addTodoList(){
    var addFormDiv = document.getElementById("docs_contents_container");

    //var str ='<input type="checkbox" id="todo'+todo_count+'" name="todo'+todo_count+'"style="margin-right: 8px; width: 20px; height: 20px;"/>'

    var str = '<img src="images/check_off.png id="todo_button'+todo_count+'" name="off" style="margin-right: 8px; width: 14px; height: 14px; margin-top: 2px;"><div id="todo_text' + todo_count +'" contenteditable="true" placeholder ="To-do" style="display: inline; "></div>'
    var addedDiv = document.createElement("div");
    addedDiv.setAttribute('class', 'todo');
    addedDiv.innerHTML = str;
    addFormDiv.appendChild(addedDiv);

    var emptyDiv = document.createElement("div");
    emptyDiv.innerHTML = '<br>'
    addFormDiv.appendChild(emptyDiv)


    preventTodoEnter(todo_count);
    addTodoButtonEventListener('todo_button' + todo_count, 'todo_text' + todo_count);
    todo_count++;
}

function addTodoButtonEventListener(buttonId, textId) {
    document.getElementById(buttonId).addEventListener('click', function(ev) {
        var button = document.getElementById(buttonId);
        var text = document.getElementById(textId)

        if(button.name == "off") {
            button.src = "images/check_on.png";
            button.name = "on";
            text.style.textDecoration = "line-through";
            text.style.color = "#aaaaaa"
        }
        else if(button.name == "on") {
            button.src = "images/check_off.png";
            button.name = "off";
            text.style.textDecoration = "none";
            text.style.color = "#000000"
        }
    })
}

function preventTodoEnter(count){
    var id = 'todo_text' + (count-1);
    $(id).keypress(function(e) {
        if (e.keyCode == 13)
            e.preventDefault();
    });

}


function addToggleList(){
    var addFormDiv = document.getElementById("docs_contents_container");

    var str ='<div style="display: flex; flex-direction: row"><div style="display: inline; width: 13px; height: 13px; margin-right: 5px;"><img id="toggle_button'+toggle_count +'" class="toggle_button" src="images/send-docs@3x.png"></div><div id="toggle_parent_text' + toggle_count +'" contenteditable="true" placeholder ="상위 항목을 입력하세요." style="display: inline; color: rgb(55, 53, 47);-webkit-text-fill-color: rgba(55, 53, 47, 0.4) ;"></div></div><div id = toggle_child' + toggle_count + ' style="display: none; margin-left: 18px; margin-top: 3px"><div id="toggle_child_text' + toggle_count +'" contenteditable="true" placeholder ="하위 항목을 입력하세요." style=" height: auto; color: rgb(55, 53, 47);-webkit-text-fill-color: rgba(55, 53, 47, 0.4) ;" ></div></div>'
    var addedDiv = document.createElement("div");
    addedDiv.innerHTML = str;
    addFormDiv.appendChild(addedDiv);

    var emptyDiv = document.createElement("div");
    emptyDiv.innerHTML = '<br>'
    addFormDiv.appendChild(emptyDiv)

    setToggleImgEventListener('toggle_button' + (toggle_count));
    setToggleTextColorEventListener(toggle_count)
    preventToggleEnter(toggle_count)
    toggle_count++;
}


// Todo: toggle img위에 커서 올려 놨을 때  1.background 생기도록, 2. cursor가 pointer이도록
function setToggleImgEventListener(id) {
    var childId = '#toggle_child' + toggle_count;

    document.getElementById(id).addEventListener('click', function(ev){
        var obj = document.getElementById(childId)
        var img = document.getElementById(id);

        if(obj.style.display == "none"){
            obj.style.display = "block";
            img.src = "images/toggle_down.png"
        }else{
            obj.style.display ="none";
            img.src = "images/toggle_right.png"
        }
    });
}

function addImage(input) {
    var addFormDiv = document.getElementById("docs_contents_container");

    var str = '<img id="image'+ image_count +'"src=""/>';
    var addedDiv = document.createElement("div");
    addedDiv.setAttribute("id", "image");
    addedDiv.innerHTML = str;
    addFormDiv.appendChild(addedDiv);

    setImageUrl(image_count, input)
    image_count++;
}

function setImageUrl(count, input){
    if (input.files && input.files[image_count]) {
        var reader = new FileReader();

        var size = prompt("사진의 크기를 입력해주세요");

        reader.onload = function(e) {
            var obj = document.getElementById('image' + count);
            obj.setAttribute('src', e.target.result);
            obj.setAttribute('width', size+'px');
            obj.setAttribute('height', size+'px');
        }
        reader.readAsDataURL(input.files[image_count]);
    }
}

function clickTodo(id){
    var obj = document.getElementById(id);
    obj.style.background = rgb(255, 142, 80);

    var selector = document.getElementById('todo_selector' + id.substring(13));
}

function addNotionTodoList(){
    var button = '<div style="margin-right: 4px; width: 24px; display: flex; align-items: center; justify-content: center; flex-grow: 0; flex-shrink: 0; min-height: calc((1.5em + 3px) + 3px); padding-right: 2px;"><div style="width: 16px; height: 16px; display: flex; align-items: stretch; justify-content: stretch; flex-shrink: 0; flex-grow: 0; cursor: pointer; transition: background 200ms ease-out 0s; background: rgb(46, 170, 220);"> <div role="button" aria-disabled="false" style="cursor: pointer; user-select: none; transition: background 120ms ease-in 0s; display: flex; align-items: center; justify-content: center; width: 100%;"> <svg viewBox="0 0 14 14" class="check" style="width: 12px; height: 12px; display: block; fill: white; flex-shrink: 0; backface-visibility: hidden;"> <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon></svg></div></div></div>'
    var text = '<div style="flex: 1 1 0px; min-width: 1px; display: flex; flex-direction: column;"> <div> <div contenteditable="true"  style="max-width: 100%; padding-top: 3px; padding-bottom: 3px; text-align: left; text-decoration: line-through; opacity: 0.375;"></div></div><div></div></div>'
    var str = '<div class="todo" style="width: 100%; max-width: 100%; margin-top: 1px; margin-bottom: 1px; position: relative;"><div style="display: flex; align-items: flex-start; width: 100%; padding-left: 2px; color: inherit; fill:inherit">' + button + text +'</div></div>'
}

