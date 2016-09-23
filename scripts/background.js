////////////////////////////////////////////////////////////////////////////////
//Configuration
////////////////////////////////////////////////////////////////////////////////
    var debug = "No";

    var sCredentials = "cookies"; // "settings" or "cookies"

    var sCheckURL = ["tnt.com"];
    
    var id = "";
    var pw = "";
                
    var sCountry = "";
    var sLanguage = "";                       
////////////////////////////////////////////////////////////////////////////////
//0 load background file
////////////////////////////////////////////////////////////////////////////////
debug == "Yes" ? console.log("**BACKGROUND** FILE LOADED: background.js ") : ""
    
            // myTNT credentials from settings    
            if (sCredentials == "settings") 
            {
                                       
                var id = "xxx@xxx.com";
                var pw = "zzzzz";
                
                var sCountry = "sk";
                var sLanguage = "sk";

                debug == "Yes" ? console.log("**BACKGROUND** SETTINGS ID LOADED: " + id) : ""
                debug == "Yes" ? console.log("**BACKGROUND** SETTINGS PW LOADED: " + pw) : ""
              
            } 
        
            // myTNT credentials from cookies    
            if (sCredentials == "cookies") 
            {
        
                function getCookies(domain, name) 
                {
                    chrome.cookies.get({"url": domain, "name": name}, function(cookie) 
                                                                      {
                                                                          if (name == "userid" || name == "myTNT_userid") 
                                                                          {
                                                                              if (cookie !== null) { id = cookie.value; } 
                                                                              debug == "Yes" ? console.log("**BACKGROUND** COOKIE ID LOADED: " + id) : ""
                                                                          };
                                                                          if (name == "password" || name == "myTNT_password") 
                                                                          {
                                                                              if (cookie !== null) { pw = cookie.value; } 
                                                                              debug == "Yes" ? console.log("**BACKGROUND** COOKIE PW LOADED: " + pw) : ""
                                                                          };
                                                                          if (name == "respCountry") 
                                                                          {
                                                                              if (cookie !== null) { sCountry = cookie.value; } 
                                                                              debug == "Yes" ? console.log("**BACKGROUND** COOKIE respCountry LOADED: " + sCountry) : ""
                                                                          };            
                                                                          if (name == "respLang") 
                                                                          {
                                                                             if (cookie !== null) { sLanguage = cookie.value; } 
                                                                              debug == "Yes" ? console.log("**BACKGROUND** COOKIE respLang LOADED: " + sLanguage) : ""
                                                                          };
                                                                          if (name == "tc_locale") //cs_cz
                                                                          {
                                                                              if (cookie !== null) { sCountry = cookie.value.substring(3, 5); } 
                                                                              if (cookie !== null) { sLanguage = cookie.value.substring(0, 2); } 
                                                                              debug == "Yes" ? console.log("**BACKGROUND** COOKIE sCountry LOADED: " + sCountry) : ""
                                                                              debug == "Yes" ? console.log("**BACKGROUND** COOKIE sLanguage LOADED: " + sLanguage) : ""                                                                          
                                                                          };  
                                                                      }
                                      );
               }
                

                    getCookies("https://my.tnt.com/myTNT/login/", "userid"); 
                    getCookies("https://my.tnt.com/myTNT/login/", "password");

                    if (id ==""){ getCookies("http://www.tnt.com/express/sk_sk/site/", "myTNT_userid");}
                    if (pw ==""){ getCookies("http://www.tnt.com/express/sk_sk/site/", "myTNT_password"); }        
           
                    getCookies("https://my.tnt.com/myTNT/login/", "respCountry"); 
                    getCookies("https://my.tnt.com/myTNT/login/", "respLang");            
            
                    if (sCountry == "" || sLanguage == "" ) { getCookies("http://www.tnt.com/express/sk_sk/site/", "tc_locale"); }

            }



////////////////////////////////////////////////////////////////////////////////    
//1    chrome.runtime.onMessage() to catch a message from popup.js
////////////////////////////////////////////////////////////////////////////////
    var greet;
    chrome.runtime.onMessage.addListener
    (
      
        function(request, sender, sendResponse) 
        {
      
                debug == "Yes" ? console.log("**BACKGROUND** POPUP MESSAGE RECEIVED: " + request.greeting ) : ""
                greet = request.greeting;            
                openmyTNT(id,pw,sCountry,sLanguage);
                sendResponse({farewell: "thanks for openning Tab " + greet + " with ID: "+ tabId});
                                                    
        }
    
    );



////////////////////////////////////////////////////////////////////////////////
//2    chrome.tabs.create() to open login page and remember tab id;
////////////////////////////////////////////////////////////////////////////////
    var tabId;
    function openmyTNT(id,pw,sCountry,sLanguage) 
    {
    
          function onCreated(tabInfo) 
          {
                   tabId = tabInfo.id;
                   debug == "Yes" ? console.log("**BACKGROUND** TAB ID LOADED: " + tabId) : ""
          }
                 
          chrome.tabs.create({"url":"https://my.tnt.com/myTNT/login/LoginInitial.do?cmd=1&navigation=1&respLang=" + sLanguage + "&respCountry=" + sCountry + "&userid=" + id + "&password=" + pw}, onCreated);
 
    }

////////////////////////////////////////////////////////////////////////////////                              
//3    chrome.webNavigation.onCompleted.addEventListener() to detect tab is loaded (you need an event with tabId that you remembered and frameId === 0);
////////////////////////////////////////////////////////////////////////////////

       chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) 
                                         {
                                              if (changeInfo.status == 'complete' && tab.url.includes(sCheckURL[0])) 
                                                {
                                                       
                                                       debug == "Yes" ? console.log("**BACKGROUND** TAB ID CHECKING LOADED: " + tabId) : ""
                                                       debug == "Yes" ? console.log("**BACKGROUND** TAB START FUNCTION LOADED: " + greet) : "" 
                                                       debug == "Yes" ? console.log("**BACKGROUND** URL: " + tab.url) : ""
                                                                             
                                                       switch (greet) 
                                                       {
                                                        case "bWeb":
                                                          chrome.tabs.update(tabId, {url: "http://www.tnt.com/express/" + sLanguage + "_" + sCountry + "/site/home.html"});
                                                          greet = "stop";
                                                          tabId = "";
                                                          break;
                                                        case "bQuote":
                                                          chrome.tabs.update(tabId, {url: "https://my.tnt.com/myTNT/landing/sitemap.do?cmd=quote&setLocale=" + sLanguage + "_" + sCountry + ""});
                                                          greet = "stop";
                                                          tabId = "";
                                                          break;
                                                        case "bShip":
                                                          chrome.tabs.update(tabId, {url: "https://my.tnt.com/myTNT/landing/sitemap.do?cmd=shipping&setLocale=" + sLanguage + "_" + sCountry + ""});
                                                          greet = "stop";
                                                          tabId = "";
                                                          break;                                                                                 
                                                        case "bTrack":
                                                          chrome.tabs.update(tabId, {url: "https://my.tnt.com/myTNT/landing/sitemap.do?cmd=track&setLocale=" + sLanguage + "_" + sCountry + ""});
                                                          greet = "stop";
                                                          tabId = "";
                                                          break; 
                                                        case "bManage":
                                                          chrome.tabs.update(tabId, {url: "https://my.tnt.com/myTNT/landing/sitemap.do?cmd=shippingManager&setLocale=" + sLanguage + "_" + sCountry + ""});
                                                          greet = "stop";
                                                          tabId = "";
                                                          break;
                                                       case "bSettings":
                                                          chrome.tabs.update(tabId, {url: "https://my.tnt.com/myTNT/landing/sitemap.do?cmd=customise&setLocale=" + sLanguage + "_" + sCountry + ""});
                                                          greet = "stop";
                                                          tabId = "";
                                                          break;
                                                       }

                                                       debug == "Yes" ? console.log("**BACKGROUND** TAB END FUNCTION LOADED: " + greet) : "" 
                                                       

                           
                                                 }
                                          }
                                        );
     


                                                      
//4    chrome.tabs.executeScript() on that tab to inject content.js that will fill form and submit it;
//5    chrome.webNavigation.onCompleted.addEventListener() again to detect tab is loaded;
//6    chrome.tabs.update() to navigate to desired subpage;
//7    cleanup.
