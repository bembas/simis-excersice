// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Add a "checked" symbol when clicking on a list item
let list = document.querySelector("ul");
list.addEventListener(
  "click",
  function (ev) {
    if (ev.target.tagName === "LI") {
      ev.target.classList.toggle("checked");
    }
  },
  false
);

// Create a new list item when clicking on the "Add" button
function newElement(input) {
  let li = document.createElement("li");
  let t = document.createTextNode(`${input.id}. ${input.name}`);
  li.appendChild(t);
  li.setAttribute("id", `li${input.id}`);
  li.setAttribute("onclick", `updateTask(${input.id})`);
  li.setAttribute("class", "");
  document.getElementById("myUL").appendChild(li);
  document.getElementById("myInput").value = "";
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.setAttribute("id", `span ${input.id}`);
  span.setAttribute("onclick", `deleteTask(${input.id})`);
  span.appendChild(txt);
  li.appendChild(span);
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      var div = this.parentElement;
      div.style.display = "none";
    };
  }
}
function createTaskList(input) {
  let list = document.getElementById("myUL");
  list.innerHTML = "";
  for (let i = 0; i < input.length; i++) {
    let li = document.createElement("li");
    let inputValue = input[i];
    let inputName = input[i].name;
    let inputId = input[i].id;
    let t = document.createTextNode(`${inputId}. ${inputName}`);
    li.appendChild(t);
    li.setAttribute("id", `li${inputId}`);
    li.setAttribute("onclick", `updateTask(${inputId})`);
    document.getElementById("myUL").appendChild(li);
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.setAttribute("id", `span ${inputId}`);
    span.setAttribute("onclick", `deleteTask(${inputId})`);
    span.appendChild(txt);
    li.appendChild(span);
  }
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement;
      div.style.display = "none";
    };
    document.getElementById("myInput").value = "";
  }
}

async function fetchTasks() {
  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const tasks = await response.json();
    tasks.sort((a, b) => a.id - b.id);
    if (response.status == 404) {
      return "error";
    }
    createTaskList(tasks);
    checkMarks(tasks);
    console.log(tasks);
    return tasks;

    async function checkMarks(tasks) {
      for (i = 0; i < tasks.length; i++) {
        let checked = tasks[i].checked;
        if (checked === true) {
          let li = document.getElementById(`li${tasks[i].id}`);
          if (li) li.setAttribute("class", "checked");
        }
        if (checked === false) {
          let li = document.getElementById(`li${tasks[i].id}`);
          if (li) li.setAttribute("class", "");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchTask() {
  try {
    let path = requestedPath();
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const task = await response.json();
    return task;
  } catch (error) {
    console.log(error);
  }
}
async function postTask() {
  try {
    let input = document.getElementById("myInput");
    let inputName = document.getElementById("myInput").value;
    let newTask = { name: inputName };

    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) {
      const result = await response.text();
      // console.log(`Error status ${response.status}. ${response.statusText}`);
      console.log(result);
      alert(result);
      document.getElementById("myInput").value = "";
      return result;
    } else {
      const task = await response.json();
      newElement(task);
      console.log(task);
      return task;
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateTask(id) {
  let path = `http://localhost:3000/tasks/${id}`;
  let li = document.getElementById(`li${id}`);
  let updatedTask;
  if (li.className === "checked") {
    updatedTask = { checked: false };
  }
  if (li.className === "") {
    updatedTask = { checked: true };
  }
  try {
    const response = await fetch(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
     // console.log(`Error status ${response.status}. ${response.statusText}. Initializing PUT request in non-existant Task.`);
     const result = await response.text();
     console.log(result);
     document.getElementById("myInput").value = "";
     return;
    } else {
      const task = await response.json();
      console.log(task);
      return task;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteTask(ID) {
  let path;
  let deletedTask;
  path = `http://localhost:3000/tasks/${ID}`;
  deletedTask = { id: ID };
  try {
    const response = await fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deletedTask),
    });
    if (!response.ok) {
     const result = await response.text();
     console.log(`${result}. ${Response.status}`);
      // console.log(`Error status ${response.status}. ${response.statusText}.`);
      return result;
    } else {
      const task = await response.json();
      console.log(task);
      fetchTasks();
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//Auto-Add Task with Enter Key.
let input = document.getElementById("myInput");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    document.getElementById("postBtn").click();
  }
});
function clearText() {
  document.getElementById("myInput").innerHTML = "";
  return;
}
