var linkTag = document.getElementsByTagName("link");
console.log(linkTag[1]);

if(localStorage.getItem('theme_tsm')){
    linkTag[1].href =  localStorage.getItem('theme_tsm');
};
console.log(linkTag[1]);

function displayTheme(){
    var res = {dark: "stylesheets/sticky-footer-navbar-dark.css",light: "stylesheets/sticky-footer-navbar-light.css"};
    var theme = this.value; 
        
    localStorage.setItem('theme_tsm', res[theme]);
    linkTag[1].href = localStorage.getItem('theme_tsm');

    console.log(linkTag[1]);
    
}

document.getElementById("dark").addEventListener("click", displayTheme);
document.getElementById("light").addEventListener("click", displayTheme);

