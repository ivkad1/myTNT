var debug = "No";

debug == "Yes" ? console.log("**POPUP** FILE LOADED: popup.js ") : ""

var words = ["quote","ship","track","manage","settings"];

function TranslateMenu() {
  document.getElementById("bQuote").innerHTML = words[0];
  document.getElementById("bShip").innerHTML = words[1];
  document.getElementById("bTrack").innerHTML = words[2];
  document.getElementById("bManage").innerHTML = words[3];
  document.getElementById("bSettings").innerHTML = words[4];
}

window.onload = TranslateMenu;


function go()
{
  debug == "Yes" ? console.log("**POPUP** BUTTON CLICKED: " + this.id) : ""
  document.getElementById(this.id).style.color  = "orange";
  chrome.runtime.sendMessage
  (
       {greeting: this.id}, 
                           function(response) 
                           {
                              debug == "Yes" ? console.log("**POPUP** BACKGROUND MESSAGE SENT: " + response.farewell) : ""
                           }
  );
}


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("bQuote").addEventListener("click", go);
  document.getElementById("bShip").addEventListener("click", go);
  document.getElementById("bTrack").addEventListener("click", go);
  document.getElementById("bManage").addEventListener("click", go);
  document.getElementById("bSettings").addEventListener("click", go);        
});




