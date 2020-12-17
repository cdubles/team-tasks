const socket = io("http://localhost:8080");

var cookie = document.cookie;
var userName;
var cookies = cookie.split("=");
for (var i = 0; i <= cookies.length; i++) {
  if (cookies[i] == "username") {
    userName = cookies[i + 1];
    break;
  }
}

$(function () {
  $("#header").load("header.html");

  //show create new project forum
  $("button#createNew").click(function () {
    $("div#newProject").toggle();
  });

  //submit new project
  $("button#makeProjectButton").click(function () {
    var name = $("input#projectName").val();
    var desc = $("input#description").val();
    var members = $("input#members").val();

    var projectData = { name: name, description: desc, members: members };
    $.ajax({
      type: "POST",
      url: "makeProject",
      data: projectData,
      success: function (res) {
        console.log(res);
        getProjects();
      },
    });
  });
});

function getProjects() {
  var data = { userName: userName };
  $.ajax({
    type: "POST",
    url: "findProjects",
    data: data,
    success: function (res) {
      console.log(res);
    },
  });
}
function getPeople() {
  $.ajax({
    type: "POST",
    url: "allPeople",
    success: function (res) {
      for(var names = 0;names<=res.length;names++){
        $("div#members").append('<input type="checkbox" class="person_clickable">'+res[names]+"</input> <br>")
      }
    },
  });
}

getPeople();
getProjects();
