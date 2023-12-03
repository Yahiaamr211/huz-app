"use strict";

const parentElement = document.getElementById("window-controls");
const urlInput = document.getElementById("url");
const savedLogin = document.getElementById("saved-login");
const form = document.getElementById("tform");
const clientApiInput = document.getElementById("client_api");
const ul = document.getElementById("saved-login-ul");
const panelUrlKey = "panel_url";
const clientApiKey = "client_api";
const serverKey = "server";
const serversKey = "servers";
const localStorage = window.localStorage;

// parentElement.addEventListener('click', handleButtonClick);

// localStorage.clear()
localStorage.setItem("url-id", "transparent");
let saved_login = [];
const saved = JSON.parse(localStorage.getItem("saved-login")) || [];

for (let login in saved) {
  if (!saved.hasOwnProperty(login)) continue;
  var obj = saved[login];
  // console.log(login, saved[login].clientApiKey)
  makeOption(saved[login].panelUrlKey, saved[login].clientApiKey)

  // for (var prop in obj) {
  //   if (!obj.hasOwnProperty(prop)) continue;
  //   console.log(login == obj, login, obj)
  // }
}

function makeOption(link, api) {
  if(link == undefined || api == undefined) return;
    const info = document.createElement("li");
    info.textContent = link;
    info.id = "url-id"
    info.class = api.substr(-6)
    ul.appendChild(info);
}


urlInput.addEventListener("focus", () => {
  const urlElements = document.querySelectorAll("#url-id");
  urlElements.forEach((element) => {
    element.style.color = "white";
  });
  localStorage.setItem("url-id", "white");
});

urlInput.addEventListener("blur", () => {
  setTimeout(() => localStorage.setItem("url-id", "transparent"), 120);
  savedLogin.style.backgroundColor = "transparent";
  const urlElements = document.querySelectorAll("#url-id");
  urlElements.forEach((element) => {
    element.style.color = "transparent";
  });
});

form.addEventListener("submit", handleFormSubmit);

let saved_login2 = [];
// document.addEventListener("click", function (event) {
//   console.log(event.target);
// });
if (document.getElementById("url-id")) {
  ul.addEventListener("click", (e) => {
    const target = e.target;
    if (target.matches("#url-id")) {
      console.log(localStorage.getItem("url-id"));
      if (localStorage.getItem("url-id") !== "transparent") {
        console.log(target.style.color);
        // console.log("in lo2");
        const clickedClass = target.class;
        console.log(clickedClass)
        const data2 = JSON.parse(localStorage.getItem("saved-login"));
        for (let data3 in data2) {
          if (!data2.hasOwnProperty(data3)) continue;
          if(clickedClass == data3) {
            urlInput.value = data2[data3].panelUrlKey
            clientApiInput.value = data2[data3].clientApiKey
            break;
          }
        }
        // saved_login.forEach((login) => {
        //   // console.log("foreach", login)
        //   login.includes("https://")
        //     ? (urlInput.value = clickedUrl)
        //     : (clientApiInput.value = login);
        // });
      }
    }
  });
}

function handleButtonClick(event) {
  const { id } = event.target;
  if (id === "minimize" || id === "maximize" || id === "close") {
    window.electronAPI.windowControl(id);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  //   const data = {
  //     [panelUrlKey]: urlInput.value,
  //     [clientApiKey]: clientApiInput.value,
  //     [serverKey]: '',
  //     [serversKey]: JSON.stringify({})
  //   };

  localStorage.setItem(panelUrlKey, urlInput.value);
  localStorage.setItem(clientApiKey, clientApiInput.value);
  localStorage.setItem(serverKey, "");
  localStorage.setItem(serversKey, JSON.stringify({}));

  let data = JSON.parse(localStorage.getItem("saved-login"));
  let dataToSave = {
    ...data,
    [clientApiInput.value.substr(-6)]: {
      panelUrlKey: urlInput.value,
      clientApiKey: clientApiInput.value,
    },
  };
  if (document.getElementById("save").checked) {
    localStorage.setItem(
      "saved-login",

      JSON.stringify(dataToSave)
    );
  }
  location.href = "servers.html";
}


function debounce(func) {
  let executed = false;
  
  return function() {
    if (!executed) {
      func.apply(this, arguments);
      executed = true;
    }
  };
}