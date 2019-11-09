var doc_id = "";
var user_id;
var doc_content;
var doc_title;
var todo_count;
var toggle_count;


document.getElementById('docs_title_emoji').addEventListener('click', back, false);
window.onload = function () {

    document.getElementById("docs_contents_container").focus();

    $(function (){
        $("#ff").on("change", function (){
            var _range = window.getSelection().getRangeAt(0);
            var _node = document.createElement('span');
            _node.innerHTML = '<font style="font-family: '+ $(this).val() + '">' + _range.toString() + '</font>'
            if (_node) _node = _node.childNodes[0];
            _range.deleteContents();
            _range.insertNode(_node);
        });

        $("#fs").on("change", function (){
            var _range = window.getSelection().getRangeAt(0);
            var _node = document.createElement('span');
            _node.innerHTML = '<font style="font-size: '+ $(this).val() +"px" + '">' + _range.toString() + '</font>'
            if (_node) _node = _node.childNodes[0];
            _range.deleteContents();
            _range.insertNode(_node);

        });
    })

    chrome.storage.sync.get('user_id', async function (items) {
        user_id = items.user_id;
        if (!chrome.runtime.error) {
        }
        await hhhhha();
    });
}

async function hhhhha(){
    chrome.storage.sync.get('doc_id', async function (items) {
        doc_id = items.doc_id;
        if (!chrome.runtime.error) {
        }
        await hhha();
    });
}

async function hhha() {
    var xhttp = new XMLHttpRequest();
    try {

        xhttp.open("GET", "https://sharesdocument.ml/doc/" + doc_id,false);
        xhttp.send(null);

        if(xhttp.readyState == 4 && xhttp.status == 201){
            var response = JSON.parse(xhttp.responseText);
            doc_id = response.doc_id;
            doc_title = response.doc_title;
            doc_content = response.content;
            todo_count = response.todo_count;
            toggle_count = response.toggle_count;
            chrome.storage.sync.set({"doc_content": doc_content}, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error");
                }
            });
            document.getElementById("docs_contents_container").innerHTML = doc_content;
            document.getElementById("docs_title").value = doc_title;

            for (var i = 0; i < todo_count; i++){
                preventTodoEnter(i);
                addTodoButtonEventListener('todo_button' + i, 'todo_text' + i);
            }
            for (var j = 0; j < toggle_count; j++){
                setToggleImgEventListener(j);
                setToggleTextColorEventListener(j)
                preventToggleEnter(j)
            }

        }
    }catch (e) {
        alert(e.toString());
    }
}

function back() {

    if(document.getElementById("docs_title").value.length === 0) {
        alert("제목을 입력하세요.");
    }else{
        doc_title = document.getElementById("docs_title").value;
        body =  document.getElementById("docs_contents_container").innerHTML;

        chrome.storage.sync.get('doc_content', async function (items) {
            doc_content = items.doc_content;
            if (!chrome.runtime.error) {
            }
            await back_ha();
        });
    }
}

async function back_ha() {

    var body = document.getElementById("docs_contents_container").innerHTML;

    var http = new XMLHttpRequest();
    try {
        http.open('Post',"https://sharesdocument.ml/doc", false );
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("user_id=" + user_id + "&doc_id=" + doc_id + "&doc_title=" + doc_title + "&doc_body=" + body + "&todo_count=" + todo_count + "&toggle_count=" + toggle_count ); //doc_alarm 추가

        if(http.readyState === 4 && http.status === 201){
            var response = JSON.parse(http.responseText);
        }
        document.location.replace("list.html");
    }catch (e) {
        alert(e.toString());
    }
}

var div_ = document.getElementById('docs_title');
div_.onkeyup = function () {
    var strValue = document.getElementById('docs_title').value;
    var strLen = strValue.length;
    var totalByte = 0;
    var len = 0;
    var oneChar = "";
    var str2 = "";
    var maxByte = 10;

    for (var i = 0; i < strLen; i++){
        oneChar = strValue.charAt(i);
        if(escape(oneChar).length > 10){
            totalByte += 2;
        } else{
            totalByte++;
        }

        if(totalByte <= maxByte){
            len = i + 1;
        }
    }

    if(totalByte > maxByte){
        alert(maxByte + "자를 초과 입력 할 수 없습니다.");
        str2 = strValue.substr(0, len);
        obj.value = str2;
    }
}

