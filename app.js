const hamburger_menu = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");
let isSidebar = false;
hamburger_menu.addEventListener("click" , ()=>{
    if(isSidebar == false){
        sidebar.classList.remove("hide");
        sidebar.classList.add("show");
        isSidebar = true;
    }
    else{
        sidebar.classList.add("hide");
        sidebar.classList.remove("show");
        isSidebar = false;
    }
})