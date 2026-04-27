// Thay vì http://localhost:3000
const API_URL = 'https://opulent-space-fortnight-ww476g7q6vj39w6w-3000.app.github.dev/api';
let token = localStorage.getItem('token');

// Tự động kiểm tra nếu đã có token thì vào thẳng Todo
if (token) showTodoSection();

async function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        token = data.token;
        showTodoSection();
    } else {
        alert("Sai tài khoản!");
    }
}

function showTodoSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    loadTodos();
}

async function loadTodos() {
    const res = await fetch(`${API_URL}/todos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const todos = await res.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = todos.map(t => `
        <li>
            <span class="${t.completed ? 'completed' : ''}" onclick="toggleTodo(${t.id}, ${t.completed})">${t.title}</span>
            <button style="width:auto; background:red;" onclick="deleteTodo(${t.id})">Xóa</button>
        </li>
    `).join('');
}

async function addTodo() {
    const title = document.getElementById('todo-input').value;
    await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title })
    });
    document.getElementById('todo-input').value = '';
    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTodos();
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}