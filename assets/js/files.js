const enterKeyDownEvent = new KeyboardEvent("keydown", {
  key: "Control",
  keyCode: 18,
});

(async () => {
  await fetch(
    `${localStorage.getItem(
      "panel_url"
    )}api/client/servers/${localStorage.getItem("server")}/files/list`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("client_api"),
      },
    }
  ).then(async (res2) => {
    if (res2.ok) {
      const data2 = await res2.json();
      data2.data.map((file) => {
        const newElement = document.createElement("option");
        newElement.innerHTML = file.attributes.name;
        document.getElementById("files").appendChild(newElement);
      });
      document.getElementById("select").addEventListener("click", () => {
        var files = document.getElementById("files");
        var selectedFiles = Array.from(files.selectedOptions).map(
          (option) => option.value
        );

        // let dataToWrite = {
        //   panel_url: data.panel_url,
        //   client_api: data.client_api,
        //   server: data.server,
        //   servers: {
        //     [data.server]: {
        //       files: selectedFiles,
        //     },
        //   },
        // };
        // dataToWrite = JSON.stringify(dataToWrite);
        // window.electronAPI.writeFile("./config/config.json", dataToWrite);

        localStorage.setItem("panel_url", localStorage.getItem("panel_url"));
        localStorage.setItem("client_api", localStorage.getItem("client_api"));
        localStorage.setItem("server", localStorage.getItem("server"));
        localStorage.setItem(
          "servers",
          JSON.stringify({
            [localStorage.getItem("server")]: {
              files: selectedFiles,
            },
          })
        );

        if(selectedFiles.length == 0) {
          alert("You have to select at least 1 file")
          files.focus()
        } else {
        location.href = "manage.html";
        }
      });
    }
  });
})();

function listen(size) {}
document.getElementById("servers").addEventListener("click", (e) => {
  // localStorage.setItem("server", "");
  location.href = "manage.html";
});
