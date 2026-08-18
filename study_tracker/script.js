// --- 1. Data setup ---
const presetSubjects = ["Linear Algebra", "Physics", "Chemistry", "Biology", "Programming", "Liberal Arts", "Social Studies", "P.E."];
console.log(presetSubjects);

// Initialize as empty arrays. We will populate these from Supabase.
let customSubjects = [];
let sessions = [];

// --- 2. Grab references to the HTML elements ---
const subjectSelect = document.getElementById("subject-select");
const newSubjectInput = document.getElementById("new-subject-input");
const addSubjectBtn = document.getElementById("add-subject-btn");
const minutesInput = document.getElementById("minutes-input");
const unitsRead = document.getElementById("unit-input");
const logSessionBtn = document.getElementById("log-session-btn");
const sessionList = document.getElementById("session-tracker");
const subjectList = document.getElementById("subject-list");
const subjectCalc = document.getElementById("subject-calc");

const SUPABASE_URL = "https://joezzajidlsuegbantaw.supabase.co";
const SUPABASE_KEY = "sb_publishable_BBVaqDKEKO5oJyfPmb2GNA_c4s-nASm";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 3. Render functions (Unchanged) ---
function renderSubjectDropdown() {
    const allSubjects = presetSubjects.concat(customSubjects);
    subjectSelect.innerHTML = ""; 

    for (const subject of allSubjects) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    }
}

async function testConnection() {
    // Replace 'your_table_name' with an actual table from your database
    const { data, error } = await supabaseClient.from(
        'main_study_tracker'
    ).select('subject').limit(1)
    if (error) {
        console.error('Connection failed:', error.message)
    } else {
        console.log('Connected successfully! Data:', data)
    }
}

function renderSessionList() {
    sessionList.innerHTML = "";
    const li = document.createElement("p");
    const label = document.createElement("span");
    const unit = document.createElement("span");
    const time = document.createElement("span");
    const deleteBtn = document.createElement("div");
    deleteBtn.textContent = "X";
    label.textContent = "Subject Studied";
    unit.textContent = "Units Studied";
    time.textContent = "Minutes Studied";
    label.className = "session_label";
    deleteBtn.className = "session_delete";
    li.className = "session_row";
    li.appendChild(label);
    li.appendChild(unit);
    li.appendChild(time);
    li.appendChild(deleteBtn);
    sessionList.appendChild(li);
    for (const session of sessions) {
        const li = document.createElement("li");
        const label = document.createElement("span");
        const unit = document.createElement("span");
        const time = document.createElement("span");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.dataset.uuid = session.uuid; 
        deleteBtn.className = "session_delete";
        label.textContent = `${session.subject}`;
        unit.textContent = `${session.units} Unit(s)`;
        time.textContent = `${session.minutes} Minute(s)`;
        label.className = "session_label";
        li.className = "session_row";
        li.appendChild(label);
        li.appendChild(unit);
        li.appendChild(time);
        li.appendChild(deleteBtn);
        sessionList.appendChild(li);
    }
}

function renderSubjectList() {
    subjectList.innerHTML = "";
    const allSubjects = presetSubjects.concat(customSubjects);
    for (const subject of allSubjects) {
        const item = document.createElement("div");        
        const label = document.createElement("span");      
        label.textContent = subject;
        item.className = "subject_row";
        label.className = "subject_label";
        item.appendChild(label);
        if (!presetSubjects.includes(subject)) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.dataset.subject = subject; 
            deleteBtn.className = "subject_delete";
            item.appendChild(deleteBtn);
        } else {
            const dfsubject = document.createElement("span");
            dfsubject.textContent = "Default Subject";
            dfsubject.className = "not_button";
            item.appendChild(dfsubject);
        }
        subjectList.appendChild(item);
    }
}

function computeTotals() {
    const totals = {};
    const allSubjects = presetSubjects.concat(customSubjects);
    for (const subject of allSubjects) {
        totals[subject] = { minutes: Number(0), units: Number(0) };
    }
    for (const session of sessions) {
        // Only aggregate if the subject still exists in our lists
        if(totals[session.subject]) {
            totals[session.subject].minutes += Number(session.minutes);
            totals[session.subject].units += Number(session.units);
        }
    }
    return totals;
}

function renderSubjectCalc() {
    subjectCalc.innerHTML = "";
    const totals = computeTotals();
    const item = document.createElement("p");
    const label = document.createElement("span");
    label.textContent = "Subject";
    label.className = "session_label";
    const minutes = document.createElement("span");
    minutes.textContent = "Total Minutes";
    const units = document.createElement("span");
    units.textContent = "Total Units"
    const unpm = document.createElement("span");
    unpm.textContent = "Time per unit"
    item.className = "session_columns";
    item.appendChild(label);
    item.appendChild(units);
    item.appendChild(minutes);
    item.append(unpm);
    subjectCalc.appendChild(item);
    
    for (const [subject, data] of Object.entries(totals)) {
        const item = document.createElement("li");        
        const label = document.createElement("span");      
        const minutes = document.createElement("span");
        const units = document.createElement("span");
        const unpm = document.createElement("span");
        label.textContent = subject;
        minutes.textContent = data.minutes;
        units.textContent = data.units;
        if (data.units == 0) {
            unpm.textContent = "-";
        } else {
            unpm.textContent = (data.minutes / data.units).toFixed(3);
        }
        item.className = "session_row";
        label.className = "session_label";
        item.appendChild(label);
        item.appendChild(units);
        item.appendChild(minutes);
        item.append(unpm);
        subjectCalc.appendChild(item);
    }
}

// --- 4. Database Initialization ---
async function fetchInitialData() {
    // 1. Fetch custom subjects
    const { data: subjectData, error: subjectError } = await supabaseClient
        .from('study_custom_subjects')
        .select('subject_name');
    
    if (!subjectError && subjectData) {
        customSubjects = subjectData.map(row => row.subject_name);
    } else {
        console.error("Failed to load subjects:", subjectError);
    }

    // 2. Fetch sessions
    const { data: sessionData, error: sessionError } = await supabaseClient
        .from('main_study_tracker')
        .select('*');

    if (!sessionError && sessionData) {
        sessions = sessionData;
    } else {
        console.error("Failed to load sessions:", sessionError);
    }

    // 3. Render everything now that data is loaded
    renderSubjectDropdown();
    renderSessionList();
    renderSubjectList();
    renderSubjectCalc();
}

// --- 5. Event handlers (Updated for Async Database logic) ---
addSubjectBtn.addEventListener("click", async () => {
    const newSubject = newSubjectInput.value.trim();
    if (newSubject === "") return;

    // Send to Supabase first
    const { error } = await supabaseClient
        .from('study_custom_subjects')
        .insert([{ subject_name: newSubject }]);

    if (error) {
        console.error("Error saving subject:", error);
        return; 
    }

    // Update Local memory and UI only if DB push succeeds
    customSubjects.push(newSubject);
    newSubjectInput.value = "";
    renderSubjectDropdown(); 
    renderSubjectList();
    renderSubjectCalc();
});

logSessionBtn.addEventListener("click", async () => {
    const subject = subjectSelect.value;
    const minutes = Number(minutesInput.value);
    const units_read = Number(unitsRead.value);

    if (!minutes || minutes <= 0 || !units_read || units_read <= 0 || !subject || subject === "undefined") return;

    const newSession = { 
        uuid: crypto.randomUUID(), 
        subject: subject, 
        minutes: minutes, 
        units: units_read 
    };

    // Send to Supabase
    const { error } = await supabaseClient
        .from('main_study_tracker')
        .insert([newSession]);

    if (error) {
        console.error("Error saving session:", error);
        return;
    }

    // Update Local Memory & UI
    sessions.push(newSession);
    minutesInput.value = "";
    unitsRead.value = "";
    renderSessionList();
    renderSubjectCalc();
});

subjectList.addEventListener("click", async (event) => {
    if (event.target.tagName === "BUTTON") {
        const subjectToDelete = event.target.dataset.subject;

        // Delete subject from Supabase
        const { error: subjectError } = await supabaseClient
            .from('study_custom_subjects')
            .delete()
            .eq('subject_name', subjectToDelete);

        // Delete associated sessions from Supabase
        await supabaseClient
            .from('main_study_tracker')
            .delete()
            .eq('subject', subjectToDelete);

        if (!subjectError) {
            customSubjects = customSubjects.filter(subject => subject !== subjectToDelete);
            sessions = sessions.filter(session => session.subject !== subjectToDelete);
            
            renderSubjectList();
            subjectSelect.value = presetSubjects[0];
            renderSubjectDropdown();
            renderSessionList();
            renderSubjectCalc();
        }
    }
});

sessionList.addEventListener("click", async (event) => {
    if (event.target.tagName === "BUTTON") {
        const idToDelete = event.target.dataset.uuid;

        // Delete from Supabase
        const { error } = await supabaseClient
            .from('main_study_tracker')
            .delete()
            .eq('uuid', idToDelete);

        if (!error) {
            sessions = sessions.filter(s => s.uuid !== idToDelete);
            renderSessionList();
            renderSubjectCalc();
        }
    }
});
testConnection();
// --- 6. Initial render on page load ---
// Replaces the immediate sync renders. This will fetch from DB, then render.
fetchInitialData();