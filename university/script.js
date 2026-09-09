const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
const USERNAME_KEY = 'username';
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const userGreeting = document.getElementById('user-greeting');
const changeUsernameBtn = document.getElementById('change-username');

const saved = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; //Does system prefer dark?
const startDark = saved ? saved === 'dark' : systemPrefersDark; //Condition for dark mode

const mainTable = document.getElementById('main-table');

const SUPABASE_URL = "https://jooisbhkdnqtbsbxrhet.supabase.co";
const SUPABASE_KEY = "sb_publishable_y9goeAs-PsNrPzM0Y1KcNA_Hr3O1sm2";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let rows = [];

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
    usernameInput.value = username;

    if (hasUser) {
        userGreeting.textContent = `Current Username: ${username}`;
    }else{
        userGreeting.textContent = 'No Username Set';
    }
}

function renderTable() {
    mainTable.innerHTML = '';
}

async function testConnection() {
    const { data, error } = await supabaseClient.from(
        'University Rows'
    ).select('id').limit(1)
    if (error) {
        console.error('Connection failed:', error.message)
    } else {
        console.log('Connected successfully! Data:', data)
    }
}

async function fetchData() {
    const { data: rowData, error: rowError } = await supabaseClient
        .from('University Rows')
        .select('*');

    if (!rowError && rowData) {
        rows = rowData;
    } else {
        console.error("Failed to load main table:", rowError);
    }
    //add render functions here to render after
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
testConnection();
fetchData();