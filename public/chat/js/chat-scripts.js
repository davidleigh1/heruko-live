window.chat = localStorage.getItem("chat") ? JSON.parse( localStorage.getItem("chat") ) : {};
window.chat.user_id = window.chat.user_id || getUUID();
var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        console.log(">>>","chat_message", input.value, getStoredSettings("user_id"));
        socket.emit("chat_message", input.value, getStoredSettings("user_id") );
        input.value = "";
    }
});

socket.on("connect", () => {
    console.log("LOCAL - We've just (re)connected!",socket);
    console.log("LOCAL - Checking that we have a UUID:", getStoredSettings("user_id") );
    if ( !getStoredSettings("user_id") ){
        // TODO: Replace with UUID
        updateStoredSettings("user_id", getUUID());
    }

    console.log("LOCAL - Checking for change in socket_id. Old:", getStoredSettings("socket_id")," New:", socket.id );
    if ( getStoredSettings("socket_id") !== socket.id ){
        console.log("Updating!");
        updateStoredSettings("socket_id", socket.id);
        updateStoredSettings("last_connected_at", new Date() );
    }

    socket.emit("client_connection", getStoredSettings() );
});

socket.on("notify", function(eventObj) {
    console.log("event", eventObj);
    // event {"type":"notify","level":"info","dest":"all","content":"User connected"}

    if (eventObj.type == "notify"){
        notify(eventObj.content, eventObj.level);
    }

});

socket.on('chat_message', function(msg, origin_user_name) {
    var item = document.createElement('li');
    item.textContent = (origin_user_name + ": "+ msg);
    item.classList.add("chat");
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('info_message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    item.classList.add("info");
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

document.addEventListener("DOMContentLoaded", function (event) {

    /* Let's check if we know this user */
    if ( !getStoredSettings("user_name") ){
        chat.user_name = prompt('What is your name?');
        updateStoredSettings();
    } else {
        notify("Welcome back <strong>"+chat.user_name+"</strong>!","success");
        console.log("'window.chat' settings found:",window.chat)
    }
    // socket.emit("chat_message", window.chat.user_name + " has joined! ("+window.chat.socket_id+")", getStoredSettings("user_id") );
});

/* Toast Notifications */

function notify(message = "default_message", messageType = "info") {
    // console.log("notify()", message, messageType);
    
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "16000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    
    toastr[messageType](message);
}

/* Notifications */

function userAlert(message = "default_message", alertType = "info", dismissAfterSecs = 3) {

    /* 
    alertType => Bootstrap Classes 
    alert-primary
    alert-secondary
    alert-success
    alert-danger
    alert-warning
    alert-info
    alert-light
    alert-dark
    */

    $("#alert").addClass('alert-'+alertType);
    $("#alert-content").html(message);
    $("#alert").addClass('show');

    $('#alert').on('closed.bs.alert', function () {
        // do something…
    });

}


function showalert(message,alerttype) {

    $('#alertAnchor').after(''
    +'<div id="alertdiv" class="alert alert-dismissible fade show ' +  alerttype + '" role="alert">'
    +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    +'<span>'+message+'</span></div>');

    setTimeout(function() { 
        // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
        $("#alertdiv").remove();
    }, 10000);
}

/* Helper Functions */

function getUUID() {

    if (!!crypto.randomUUID) {
        /* Not supported in all browers */
        return crypto.randomUUID();
    } else {
        /* Fallback... */
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}

// console.log(uuidv4());

/* Storage */

function updateStoredSettings(settingKey, settingValue, storageKey = "chat") {
    let chatObject = localStorage.getItem(storageKey) ? JSON.parse( localStorage.getItem(storageKey) ) : {};

    if ( !!settingKey && !!settingValue ){
        // If we get a single key to save...
        chatObject[settingKey] = settingValue; 
        localStorage.setItem(storageKey,JSON.stringify(chatObject));
    } else {
        // Otherwise we assume it's already been updated and just save the whole object
        localStorage.setItem(storageKey,JSON.stringify(window.chat));
    }

    return getStoredSettings(null, storageKey);
}

function getStoredSettings(settingKey, storageKey = "chat") {
    if (!localStorage.getItem(storageKey)){
        return false;
    }

    let chatObject = JSON.parse(localStorage.getItem(storageKey));
    if (!!settingKey){
        return chatObject[settingKey];
    } else {
        return chatObject;
    }
}

// console.log(socket.id);