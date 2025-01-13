const socket = io()

const clientstotal = document.getElementById('client-total')
const messagecontainer = document.getElementById('message-container');
const nameinput = document.getElementById('name-input');
const messageform = document.getElementById('message-form');
const messageinput=document.getElementById('message-input');

const username= localStorage.getItem('username');

if(!username){
    window.location.href='/'
}
else{
    nameinput.value=username;
}

messageform.addEventListener('submit',(e) => {
    e.preventDefault();
    submitmessage()
})

socket.on('totalclients',(data)=>{
    clientstotal.innerText = `Total Clients : ${data}`
})

function submitmessage(){
    if(messageinput.value==''){
        return
    }
    // console.log(messageinput.value);
    const data = {
        name: nameinput.value,
        message: messageinput.value,
        datetime: new Date(),
    }
    socket.emit('message',data)
    addmessagetoui(true,data);
    messageinput.value='';
}

socket.on('chatmessage',(data)=>{
    addmessagetoui(false,data);
    // console.log(data);
})

function addmessagetoui(isownmessage,data){
    const element = `<li class="${isownmessage ? 'message-right' : 'message-left'}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.datetime).fromNow()}</span>
          </p>
        </li>`

    messagecontainer.innerHTML += element;
    scrolltobottom()
    clearfeedback()

}

function scrolltobottom(){
    messagecontainer.scrollTo(0,messagecontainer.scrollHeight)
}

messageinput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback: `${nameinput.value} is typing a message`
    })
})

messageinput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback: `${nameinput.value} is typing a message`
    })
})

messageinput.addEventListener('blur',(e)=>{
    socket.emit("feedback",{
        feedback: ''
    })
})

socket.on('feedbackdata',(data)=>{
    clearfeedback();
    const element=
    `<li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback} </p>
        </li>`

    messagecontainer.innerHTML+=element
})

function clearfeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element)
    })
}