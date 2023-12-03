const servers = JSON.parse(localStorage.getItem("servers"));
const panelUrl = localStorage.getItem("panel_url");
const serverId = localStorage.getItem("server");
const clientApi = localStorage.getItem("client_api");

(async () => {
  const res5 = await fetch(`${panelUrl}api/client/servers/${serverId}`, {
    headers: {
      Authorization: `Bearer ${clientApi}`,
    },
  });

  if (res5.ok) {
    const data4 = await res5.json();
    const state = await getState();
    console.log(state);
    document.getElementById(
      "name"
    ).innerHTML = `Name: ${data4.attributes.name}`;
    document.getElementById("state").innerHTML = `State: ${state}`;
    document.getElementById(
      "uuid"
    ).innerHTML = `UUID: ${data4.attributes.identifier}`;
    document.getElementById(
      "node"
    ).innerHTML = `Node: ${data4.attributes.node}`;
    document.getElementById(
      "ram"
    ).innerHTML = `Ram: ${data4.attributes.limits.memory} MB`;
    document.getElementById(
      "disk"
    ).innerHTML = `Disk: ${data4.attributes.limits.disk} MB`;
    document.getElementById(
      "cpu"
    ).innerHTML = `CPU: ${data4.attributes.limits.cpu} %`;
  }
  let filess = [];
  for (let server in servers) {
    // skip loop if the property is from prototype
    if (!servers.hasOwnProperty(server)) continue;
    var obj = servers[server];
    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) continue;
      if (localStorage.getItem("server") == server) {
        filess.push(obj[prop]);
      }
    }
  }
  const filesToCompress = Object.values(filess[0]).map(function (value) {
    return value;
  });

  if(filesToCompress.length == 0) {
    document.getElementById("edit-files").style.display = "none";
    document.getElementById("files-list").style.display = "none";
  }
  document.getElementById("files-list").innerHTML = filesToCompress.join("<br>");
  
  document.getElementById("backup").addEventListener("click", async () => {
    if(filesToCompress.length == 0 || filesToCompress == undefined || filesToCompress == null) location.href = "files.html"
    const res1 = await fetch(
      `${panelUrl}api/client/servers/${serverId}/files/list`,
      {
        headers: {
          Authorization: `Bearer ${clientApi}`,
        },
      }
    );
  
    if (res1.ok) {
      const data1 = await res1.json();
      const filesToIgnore = [
        ".cache",
        ".config",
        ".git",
        ".npm",
        ".upm",
        "node_modules",
        "Lunox.zip",
        "package-lock.json",
        "replit_zip_error_log.txt",
        "replit.nix",
        ".env.example",
        ".replit",
        "**.tar.gz",
      ];
      const neededFiles = data1.data
        .map((file1) => file1.attributes.name)
        .filter((name) => !filesToIgnore.includes(name));
  
      const filesToCompress = Object.values(servers[serverId] || {});
  
      if(filesToCompress.length == 0) location.href = "files.html"
      // console.log(JSON.stringify(filesToCompress)
      // console.log(JSON.stringify(neededFiles))
      const res2 = await fetch(
        `${panelUrl}api/client/servers/${serverId}/files/compress`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${clientApi}`,
          },
          body: JSON.stringify({
            root: "/",
            files: neededFiles,
          }),
        }
      );
  
      if (res2.ok) {
        const data2 = await res2.json();
        const res3 = await fetch(
          `${panelUrl}api/client/servers/${serverId}/files/download?file=%2F${data2.attributes.name}`,
          {
            headers: {
              Authorization: `Bearer ${clientApi}`,
            },
          }
        );
  
        const data3 = await res3.json();
        console.log(data3.attributes.url);
  
        const iframe = document.createElement("iframe");
        iframe.src = data3.attributes.url;
        iframe.width = "500";
        iframe.height = "300";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
  
        const res4 = await fetch(
          `${panelUrl}api/client/servers/${serverId}/files/delete`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${clientApi}`,
            },
            body: JSON.stringify({
              root: "/",
              files: [data2.attributes.name],
            }),
          }
        );
  
        if (res4.ok) {
          const data = await res4.json();
          console.log("delete request", res4, data);
        }
      }
    }
  });
  
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    location.href = "home.html";
  });
  
  document.getElementById("edit-files").addEventListener("click", () => {
    location.href = "files.html";
  });
  
  const buttons = {
    start: document.getElementById("start"),
    restart: document.getElementById("restart"),
    kill: document.getElementById("stop"),
  };
  
  for (const key in buttons) {
    buttons[key].addEventListener("click", () => {
      changeState(key);
    });
  }
  
  async function changeState(state) {
    let success;
    const res7 = await fetch(`${panelUrl}api/client/servers/${serverId}/power`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientApi}`,
      },
      body: JSON.stringify({
        signal: state,
      }),
    });
  
    if (res7.ok) {
      success = true;
      console.log("ok", state);
  
      if (state === "start") {
        document.getElementById("state").innerHTML = "State: starting";
        setTimeout(async () => {
          document.getElementById(
            "state"
          ).innerHTML = `State: ${await getState()}`;
        }, 20000);
      }
  
      if (state === "restart") {
        // await changeState("kill");
        document.getElementById("state").innerHTML = "State: stopping";
        setTimeout(async () => {
          // await changeState("start"); 
          document.getElementById("state").innerHTML = "State: starting";
          setTimeout(async () => {
            document.getElementById(
              "state"
            ).innerHTML = `State: ${await getState()}`;
          }, 20000);
        }, 20000);
      }
  
      if (state === "kill") {
        document.getElementById("state").innerHTML = "State: stopping";
        setTimeout(async () => {
          document.getElementById(
            "state"
          ).innerHTML = `State: ${await getState()}`;
        }, 20000);
      }
    }
  
    return success ? "Successfully changed state" : "An error has occurred";
  }
  
  async function getState() {
    const res6 = await fetch(
      `${panelUrl}api/client/servers/${serverId}/resources`,
      {
        headers: {
          Authorization: `Bearer ${clientApi}`,
        },
      }
    );
  
    if (res6.ok) {
      const data5 = await res6.json();
      return data5.attributes.current_state;
    }
  }
})();
