
let todos = [];

const submitTodo = (e) => {
  const title = document.getElementById('title');

  if (title !== '') {
    addTodo(title.value.trim());
    title.value = '';
    title.focus();
  }
    // getTodos()
  e.preventDefault();
}

const form = document.getElementById('form');
form.addEventListener("submit", submitTodo);

const renderTodo = (todo) => {
  // console.log(todos)
  const ul = document.querySelector('.todo-list');
  const item = document.querySelector(`[data-key='${todo._id}']`);

  const isCompleted = todo.is_completed ? 'completed': '';
  const iconChecked = todo.is_completed ? 'bi-check-circle': 'bi-circle';
  const li = document.createElement("li");
  li.setAttribute('data-key', todo._id);
  li.innerHTML = `
  <i class="btn-check bi bi-circle"></i>
    <span>${todo.title}</span>
    <i class="btn-remove bi bi-trash3"></i>
  `;

  if (item) {
    li.setAttribute('class', isCompleted);
    li.innerHTML = `
  <i class="btn-check bi ${iconChecked}"></i>
    <span>${todo.title}</span>
    <i class="btn-remove bi bi-trash3"></i>
  `;
    // replace it
    ul.replaceChild(li, item);
  } else {
    // otherwise append it to the end of the ul
    ul.append(li);
  }
}

const getTodos = () => {
  fetch("http://localhost:3001/v1/tasks", {
    method: 'GET'
  })
  .then(response => response.json())
  .then(result=> {
    todos = result
    todos.tasks.map(i =>{
      renderTodo(i)
    })
  })
  // .then(todos => {
  //   console.log(todos)
  //   todos.tasks.map(todo =>{
  //     renderTodo(todo)
  //     console.log(todo.is_completed)
  //     todos = todo

  //   })
  // })
  .catch(error => console.log('error', error));
}

const addTodo = (title) => {
  console.log(todos)
  const newTodo = {title,is_complete:false}
  fetch("http://localhost:3001/v1/tasks", {
    method: 'POST',
    body: JSON.stringify(newTodo),
    headers:{
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(todo =>{  // console.log(response)
    console.log("ini todo",todo)
    todox = todos.tasks
    newTodo._id = todo.id
    console.log("ini todos",todox)
    todox.push(newTodo)
    console.log("ini log newTodo",newTodo)
    renderTodo(newTodo)

  })
  .catch(error => console.log('error', error));
};

const deleteTodo = (id) => {
  const li = document.querySelector(`[data-key='${id}']`);
  li.remove();
  console.log(id)
  fetch(`http://localhost:3001/v1/tasks/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.text())
    .then(todo => {
      li.remove();
    })
  .catch(error => console.log('error', error));
};


const toggleCompleted = (id) => {
  // console.log(todos.tasks)
  test = todos.tasks
  const idx = test.findIndex(t => t._id === id);
  test[idx].is_completed = !test[idx].is_completed;
  const state = test[idx].is_completed;
  fetch(`http://localhost:3001/v1/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      is_completed: state
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(todos => {
    renderTodo(test[idx]);
  })
  .catch(error => console.log('error', error));
};


const ul = document.querySelector('.todo-list');
ul.addEventListener('click', e => {
  if (e.target.classList.contains('btn-check')) {
    const id = e.target.parentElement.dataset.key;
    toggleCompleted(id);
    // console.log("succkes");
  }

  // add this `if` block
  if (e.target.classList.contains('btn-remove')) {
    const id = e.target.parentElement.dataset.key;
    deleteTodo(id);
    // console.log("remove");
  }
});

getTodos()