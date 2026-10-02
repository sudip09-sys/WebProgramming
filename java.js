const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("navMenu");
const themeBtn=document.getElementById("themeBtn");
const backTop=document.getElementById("backTop");
const year=document.getElementById("year");

menuBtn.addEventListener("click",()=>{
  nav.classList.toggle("open");
  menuBtn.textContent=nav.classList.contains("open")?"✕":"☰";
});

document.querySelectorAll("nav a").forEach(a=>{
  a.addEventListener("click",()=>{
    nav.classList.remove("open");
    menuBtn.textContent="☰";
  });
});

if(localStorage.getItem("sudip-theme")==="dark"){
  document.body.classList.add("dark");
  themeBtn.textContent="☀ Light";
}

themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  const dark=document.body.classList.contains("dark");
  localStorage.setItem("sudip-theme",dark?"dark":"light");
  themeBtn.textContent=dark?"☀ Light":"◐ Theme";
});

year.textContent=new Date().getFullYear();

window.addEventListener("scroll",()=>{
  backTop.classList.toggle("show",window.scrollY>450);
});

backTop.addEventListener("click",()=>{
  window.scrollTo({top:0,behavior:"smooth"});
});
