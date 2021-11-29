// Global variables
let todosList={pinned:[],others:[]};

// Element reference
const input=document.getElementById("input");
const submit=document.getElementById("submit");
const todos=document.getElementById("todos");
const pinnedContainer=document.querySelector(".pinned-container");
const othersContainer=document.querySelector(".others-container");
const todoHeader=document.querySelectorAll(".todo-header");
const modalContainer=document.querySelector(".modal-container");
const modalInput=document.querySelector(".modal-input");
const closeBtn=document.querySelector(".close-btn");

// Event Listeners
document.addEventListener("DOMContentLoaded",loadLocalTodos);
submit.addEventListener("click",(e)=>{
    e.preventDefault();
    // Check the input value
    if(input.value){
        addTodo();
    }
} 
)
// Event handles delete, edit, pin, and unpin
todos.addEventListener("click",operationOnTodos);
// handles close button of modal
closeBtn.addEventListener("click",()=>{
    modalContainer.classList.remove("active");
})
// Functions

// Loads todos from local storage if any
function loadLocalTodos(){
    let li_Element;let thumb_tack;let delete_Btn;
    // handles the pin and other container heading
    manageHeaderDisplay();
    if(localStorage.getItem("todos")){
        todosList=JSON.parse(localStorage.getItem("todos"));
        for(i=0;i<todosList.pinned.length;i++){
            // Creates container element for user input
            li_Element=document.createElement("li");
            li_Element.className="todo pinned";
            thumb_tack=document.createElement("i");
            thumb_tack.className="fa fa-thumb-tack";
            delete_Btn=document.createElement("button");
            delete_Btn.className="delete-btn";
            delete_Btn.innerHTML='<i class="fa fa-lg fa-trash trash-btn" aria-hidden="true"></i>'
            li_Element.append(todosList.pinned[i]);
            li_Element.append(thumb_tack);
            li_Element.append(delete_Btn);
            pinnedContainer.append(li_Element);
         }
        for(i=0;i<todosList.others.length;i++){
            li_Element=document.createElement("li");
            li_Element.className="todo";
            thumb_tack=document.createElement("i");
            thumb_tack.className="fa fa-thumb-tack";
            delete_Btn=document.createElement("button");
            delete_Btn.className="delete-btn";
            delete_Btn.innerHTML='<i class="fa fa-lg fa-trash trash-btn" aria-hidden="true"></i>'
            li_Element.append(todosList.others[i]);
            li_Element.append(thumb_tack);
            li_Element.append(delete_Btn);
            othersContainer.append(li_Element);
        }
       
    }
    manageHeaderDisplay();
    
    
}                      

function manageHeaderDisplay(){
    if(todosList.pinned.length<1){    
        //Makes pin header display to none if pinned container is empty  
        todoHeader[0].style.display="none"   
    }
    if(todosList.others.length<1){
        //Makes other header display to none if others container is empty
        todoHeader[1].style.display="none"   
    }
    if(todosList.pinned.length>0){
        //Makes pin header display to block if pinned container is not empty
        todoHeader[0].style.display="block";    
    }
    if(todosList.others.length>0){
        if(todosList.pinned.length<1){
            //Makes other header display to none if pinned container is empty
            todoHeader[1].style.display="none";
        }
        else{
            //Makes other header display to block if pinned container is not empty
            todoHeader[1].style.display="block";
        }
    }
    
}
// Add todos to local storage
function addTodoToLocalStorage(){
    todosList.others.push(input.value)
    localStorage.setItem("todos",JSON.stringify(todosList));
    manageHeaderDisplay();
}

// Add todo to the view
function addTodo(){
    // Used createElement not innerHTML to avoid DOM XSS
    let li_Element=document.createElement("li");
    li_Element.className="todo";
    let thumb_tack=document.createElement("i");
    thumb_tack.className="fa fa-thumb-tack";
    let delete_Btn=document.createElement("button");
    delete_Btn.className="delete-btn";
    delete_Btn.innerHTML='<i class="fa fa-lg fa-trash trash-btn" aria-hidden="true"></i>'
    li_Element.append(input.value);
    li_Element.append(thumb_tack);
    li_Element.append(delete_Btn);
    othersContainer.append(li_Element);
    // to add todo to local storage
    addTodoToLocalStorage();
    // Clears the input after adding the user note
    input.value=""
}

// Delete todo from local Storage
function deleteLocalTodo(element){
    todosList=JSON.parse(localStorage.getItem("todos"));
    // Checks if note to be deleted is in pinned container or in others container
    if(element.classList.contains("pinned")){ 
        for(i=0;i<todosList.pinned.length;i++){
            if(todosList.pinned[i]==element.firstChild.textContent){
                todosList.pinned.splice(i,1);
            }
        }
    }
    else{
        for(i=0;i<todosList.others.length;i++){
            if(todosList.others[i]==element.firstChild.textContent){
                todosList.others.splice(i,1);
            }
        }
    }
    
    localStorage.setItem("todos",JSON.stringify(todosList));
}

// Edits todo in local Storage
function editLocalTodo(editted_text,index){
    todosList[index]=editted_text;
    localStorage.setItem("todos",JSON.stringify(todosList));
}

// Edits todo on the view
function editTodo(element,index){
    element.firstChild.textContent=modalInput.value;
    editLocalTodo(element.firstChild.textContent,index);
}

// Finds the index of editted todo in local storage
function indexOfLocalTodo(text){
    todosList=JSON.parse(localStorage.getItem("todos"));
    for(i=0;i<todosList.length;i++){
        if(todosList[i]==text){
            return i
        }
    }
}

// Pin todo to the view and add to local storage
function pinTodo(element){
    todosList.pinned.push(element.firstChild.textContent)
    removeLocalTodo(element) 
    element.classList.add("pinned")  // Mark the element as pinned todo
    pinnedContainer.append(element);
    localStorage.setItem("todos",JSON.stringify(todosList));
}

// Unpin todo to the view and add to local storage
function unpinTodo(element){
    todosList.others.push(element.firstChild.textContent);
    removeLocalTodo(element);
    element.classList.remove("pinned") // Unmark the element as pinned todo
    othersContainer.append(element);
    localStorage.setItem("todos",JSON.stringify(todosList));
}

function removeLocalTodo(element){
    if(element.classList.contains("pinned")){
        for(i=0;i<todosList.pinned.length;i++){
            if(todosList.pinned[i]==element.firstChild.textContent){
                todosList.pinned.splice(i,1);
            }
        }
    }
    else{
        for(i=0;i<todosList.others.length;i++){
            if(todosList.others[i]==element.firstChild.textContent){
                todosList.others.splice(i,1);
            }
        } 
    } 
}

// Does delete, edit, pinning and unpinning operations on todos
function operationOnTodos(event){
   if(event.target.className=="delete-btn"){
       deleteLocalTodo(event.target.parentElement)
       event.target.parentElement.remove();
       // Handles pin header and other header display after deletion of a note
       manageHeaderDisplay();
    }
    else if(event.target.classList.contains("todo")){
        modalContainer.classList.add("active");
        modalInput.value=event.target.firstChild.textContent;
        // Used once:true to create one time handler
        modalInput.addEventListener("change",()=>editTodo(event.target,indexOfLocalTodo(event.target.firstChild.textContent)),{once:true})
    }
    else if(event.target.className==="fa fa-thumb-tack"){
        if(event.target.parentElement.classList.contains("pinned")){
            unpinTodo(event.target.parentElement)
            manageHeaderDisplay();
        }
        else{
            pinTodo(event.target.parentElement)
            manageHeaderDisplay();
        }
    }
}