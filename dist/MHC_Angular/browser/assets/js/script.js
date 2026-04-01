// Active Class JS
// toggle Class 


let isNavMenuClick = false

function removeClass(ID,CLASS){
  // console.log(ID)
  ID.forEach((element) => {
    // debugger
    if((document.getElementById(element).classList.value.search("visibal-menu") > -1 && !isNavMenuClick)){
      document.getElementById(element).classList.remove(CLASS);
    };    
  });
  isNavMenuClick = false;
}

function toggleClass(ID,CLASS){
  console.log(ID)
  isNavMenuClick = true;
  document.getElementById(ID).classList.toggle(CLASS);
}


function toggleActive(Id, db) {
  var element = document.querySelector(Id);
  element.classList.toggle(db);
}
// add Class 
function addActive(Id, db) {
  var element = document.querySelector(Id);
  element.classList.add(db);
}
// remove Class 
function removeActive(Id, db) {
  var element = document.querySelector(Id);
  element.classList.remove(db);
}
