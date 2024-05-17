// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length >0){
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")
    

    buttonsChangeStatus.forEach(button =>{
        button.addEventListener("click",() =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active"
            
            const action = path + `/${statusChange}/${id}?_method=PATCH`
            formChangeStatus.action = action;
            // console.log(action);
            formChangeStatus.submit();
        })
    })
}
// end change status

//delete item

const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length >0){
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");
    buttonsDelete.forEach(button =>{
        button.addEventListener("click",()=>{
            console.log("delte");
            const isConfirm = confirm("Are you sure to delete this product")
            
            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
    
}

// restore item
const buttonsRestore = document.querySelectorAll("#button-restore");
console.log(buttonsRestore);
if(buttonsRestore.length >0){
    const formRestoreItem = document.querySelector("#form-restore-item");
    const path = formRestoreItem.getAttribute("data-path");
    buttonsRestore.forEach(button =>{
        button.addEventListener("click",()=>{
            console.log("hello");
            const isConfirm = confirm("Are you sure to restore this product")
            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=PATCH`;
                formRestoreItem.action = action;
                
                formRestoreItem.submit();
            }
        })
    })
    
}
