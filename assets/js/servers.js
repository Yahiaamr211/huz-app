// window.electronAPI.homeDir().then(async(e) => {
//   console.log(location.href.split(e).join(""))
// })

if(location.href.substr(-6) == "s.html") {
  (async () => {
    await fetch(localStorage.getItem("panel_url") + "api/client", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("client_api"),
      },
    }).then(async (res) => {
      if (res.redirected) {
        localStorage.setItem("err", "redirected")
        location.href = "home.html";
      }
      const data2 = await res.json();
      data2.data.map((servers) => {
        const serverElement = document.createElement("div");
        serverElement.innerHTML =
          // servers.attributes.uuid.substring(0, 8) +
          // " - " +
          servers.attributes.name +
          " " +
          '<button class="select">Select server</button>';
        document.getElementById("servers").appendChild(serverElement);
        
        document.getElementById("loading").style = "display: none;"
        const selectButton = serverElement.querySelector(".select");
        console.log(servers.attributes.uuid.substring(0, 8));
        selectButton.addEventListener("click", () => {
          // let newData = {
          //   panel_url: data.panel_url,
          //   client_api: data.client_api,
          //   server: servers.attributes.uuid.substring(0, 8),
          //   servers: {},
          // };
  
          // console.log("selected " + servers.attributes.uuid.substring(0, 8));
          // newData = JSON.stringify(newData);
          // window.electronAPI.writeFile("./config/config.json", newData);
  
          localStorage.setItem("panel_url", localStorage.getItem("panel_url"));
          localStorage.setItem("client_api", localStorage.getItem("client_api"));
          localStorage.setItem("server", servers.attributes.uuid.substring(0, 8));
          localStorage.setItem(
            "servers",
            JSON.stringify({
              [servers.attributes.uuid.substring(0, 8)]: {
                files: [],
              },
            })
          );  
          location.href = "manage.html";
        });
      });
    });
  })();
  
  document.getElementById("logout").addEventListener("click", () => {
    // let emptydata = {};
  
    // emptydata = JSON.stringify(emptydata);
    // window.electronAPI.writeFile("./config/config.json", emptydata);
  
    // localStorage.clear();
    localStorage.removeItem("panel_url")
    localStorage.removeItem("client_api")
    localStorage.removeItem("server")
    localStorage.removeItem("servers")
    location.href = "home.html";
  });
} else {
  // console.log()
  if (location.href.substr(-6) == "e.html") {
      // document.getElementById("status").innerHTML =
      // "Wrong client API or panel URL";\
      // console.log(err)
      if(localStorage.getItem('err') == "redirected") {
        alert("Wrong client API or panel URL")
        localStorage.removeItem("err")
        localStorage.removeItem("panel_url")
        localStorage.removeItem("client_api")
      }
  }
}
