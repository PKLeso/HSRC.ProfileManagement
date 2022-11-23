const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

function mySignUpbtn(){
  const container = document.querySelector(".container");
  container.classList.add("sign-up-mode");
}

function mySignInbtn(){
  const container = document.querySelector(".container"); 
  container.classList.remove("sign-up-mode");
}
