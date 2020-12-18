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
    var members = getCheckedPeople();

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
      console.log("current Projects: " + res);
    },
  });
}
function getPeople() {
  $.ajax({
    type: "POST",
    url: "allPeople",
    success: function (res) {
      for (var names = 0; names < res.length; names++) {
        $("div#members").append(
          "<input name=" +
            res[names] +
            ' type="checkbox" class="person_clickable">' +
            res[names] +
            "</input> <br>"
        );
      }
    },
  });
}

function getCheckedPeople() {
  var checked = [];
  var checkboxes = document.getElementsByClassName("person_clickable");
  for (var boxes = 0; boxes < checkboxes.length; boxes++) {
    if (checkboxes[boxes].checked == true) {
      checked.push(checkboxes[boxes].name);
    }
  }
  console.log(checked);
  return checked;
}

getPeople();
getProjects();
