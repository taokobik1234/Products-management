import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


// FileUploadWithPreview

const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image',{
  multiple: true,
  maxFileCount: 6
});

// client send message
const formSendData = document.querySelector(".chat .inner-form");

if(formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const images = upload.cachedFileArray || [];
    const content = e.target.elements.content.value;
    if(content|| images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
    }
  });
}

// server return message

socket.on("SERVER_RETURN_MESSAGE",(data)=>{
  // console.log(data);
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");

  let htmlFullName =""
  if(myId == data.userId){
    div.classList.add("inner-outgoing");
  }else{
    div.classList.add("inner-incoming");
    htmlFullName= `<div class="inner-name">${data.fullName}</div>`
  }
  
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
})

// sroll chat 

const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// emoji picker
// show popup
const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon){
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}

//insert icon
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker){
  const inputChat = document.querySelector(".chat .inner-form input[name='content']")
  emojiPicker.addEventListener('emoji-click', event =>{
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
    inputChat.setSelectionRange(inputChat.value.length,inputChat.value.length);
    inputChat.focus();
  });
}


