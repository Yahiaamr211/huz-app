if (
  localStorage.getItem("panel_url") == undefined &&
  localStorage.getItem("client_api") == undefined
) {
  location.href = "home.html";
} else {
  if (localStorage.getItem("server") == "") {
    location.href = "servers.html";
  } else {
    location.href = "manage.html";
  }
}
