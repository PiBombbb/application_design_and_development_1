const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const USERNAME_KEY = 'username';
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const changeUsernameBtn = document.getElementById('change-username');
const saved = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; //Does system prefer dark?
const startDark = saved ? saved === 'dark' : systemPrefersDark; //Condition for dark mode

function applyTheme(isDark) {
    root.classList.toggle('dark', isDark);
    toggleBtn.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

function getUsername() {
    return localStorage.getItem(USERNAME_KEY);
}

function setUsername(name) {
    localStorage.setItem(USERNAME_KEY, name);
}

function clearUsername() {
    localStorage.removeItem(USERNAME_KEY);
}

function renderUserState() {
    const username = getUsername();
    const hasUser = Boolean(username);
    usernameForm.hidden = hasUser;
    changeUsernameBtn.hidden = !hasUser;

    if (hasUser) {
        userGreeting.textContent = `Current Username: ${username}`;
    }else{
        userGreeting.textContent = 'No Username Set';
    }
}


toggleBtn.addEventListener('click', () => {
    const isDark = !root.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = usernameInput.value.trim().toLowerCase();
    if (!name) return;
    setUsername(name);
    renderUserState();
});

changeUsernameBtn.addEventListener('click', () => {
    clearUsername();
    usernameInput.value = '';
    renderUserState();
});

renderUserState();
applyTheme(startDark); //run theme function on load