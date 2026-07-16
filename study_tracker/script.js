// --- 1. Data setup ---
// Presets you'll likely reuse a lot, since these are the subjects
// you mentioned studying. This is just a plain JS array, like a Python list.
const presetSubjects = ["Linear Algebra", "Physics", "Chemistry", "Biology", "Programming", "Liberal Arts", "Social Studies", "P.E."];

// We load any *saved* custom subjects and sessions from localStorage on
// page load, so nothing is lost between visits.
// localStorage.getItem returns a STRING (or null if the key was never set),
// so we JSON.parse it back into a real array/object.
// The `|| "[]"` means: "if getItem returned null, use the string '[]' instead"
// so JSON.parse always has valid JSON to work with.
let customSubjects = JSON.parse(localStorage.getItem("customSubjects") || "[]");
let sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

// --- 2. Grab references to the HTML elements we'll need ---
const subjectSelect = document.getElementById("subject-select");
const newSubjectInput = document.getElementById("new-subject-input");
const addSubjectBtn = document.getElementById("add-subject-btn");
const minutesInput = document.getElementById("minutes-input");
const unitsRead = document.getElementById("unit-input");
const logSessionBtn = document.getElementById("log-session-btn");
const sessionList = document.getElementById("session-tracker");
const subjectList = document.getElementById("subject-list");
const subjectCalc = document.getElementById("subject-calc");
 
// --- 3. Render functions ---
// Rebuilds the <select> dropdown from presetSubjects + customSubjects.
// We do this any time the subject list changes, rather than trying to
// track individual additions.
function renderSubjectDropdown() {
    const allSubjects = presetSubjects.concat(customSubjects); // like Python's + for lists
    subjectSelect.innerHTML = ""; // clear existing options first

    for (const subject of allSubjects) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    }
}

// Rebuilds the visible history list from the `sessions` array.
function renderSessionList() {
    sessionList.innerHTML = "";
    for (const session of sessions) {
        const li = document.createElement("li");
        const label = document.createElement("span");
        const unit = document.createElement("span");
        const time = document.createElement("span");
        label.textContent = `${session.subject}`;
        unit.textContent = `${session.units} Units`;
        time.textContent = `${session.minutes} Minutes`;
        li.className = "session_row";
        li.appendChild(label);
        li.appendChild(unit);
        li.appendChild(time);
        sessionList.appendChild(li);
    }
}

function renderSubjectList() {
    subjectList.innerHTML = "";
    const allSubjects = presetSubjects.concat(customSubjects);
    for (const subject of allSubjects) {
        const item = document.createElement("div");        // the row container
        const label = document.createElement("span");      // holds the subject name
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
        }else {
            const dfsubject = document.createElement("span");
            dfsubject.textContent = "Default Subject";
            dfsubject.className = "not_button";
            item.appendChild(dfsubject);
        }
        subjectList.appendChild(item);
    }
}

function renderSubjectCalc() {
    subjectCalc.innerHTML = "";
    const allSubjects = presetSubjects.concat(customSubjects);
    for (const subject of allSubjects) {
        const item = document.createElement("div");        // the row container
        const label = document.createElement("span");      // holds the subject name
        label.textContent = subject;
        item.className = "subject_row";
        label.className = "subject_label";
        item.appendChild(label);
        subjectCalc.appendChild(item);
    }
}

// --- 4. Event handlers ---
addSubjectBtn.addEventListener("click", () => {
    const newSubject = newSubjectInput.value.trim(); // trim = strip whitespace
    if (newSubject === "") return; // ignore empty submissions

    customSubjects.push(newSubject); // add to our in-memory array
    localStorage.setItem("customSubjects", JSON.stringify(customSubjects)); // persist it

    newSubjectInput.value = ""; // clear the text box
    renderSubjectDropdown(); // refresh the dropdown so it shows up immediately
    renderSubjectList();
    renderSubjectCalc();
});

logSessionBtn.addEventListener("click", () => {
    const subject = subjectSelect.value;
    const minutes = Number(minutesInput.value);
    const units_read = Number(unitsRead.value);

    if (!minutes || minutes <= 0 || !units_read || units_read <= 0) return; // basic validation

    sessions.push({ subject: subject, minutes: minutes, units: units_read });
    localStorage.setItem("sessions", JSON.stringify(sessions));

    minutesInput.value = "";
    unitsRead.value = "";
    renderSessionList();
    renderSubjectCalc();
});

subjectList.addEventListener("click", (event) => {
    // event.target = the exact element that was clicked
    if (event.target.tagName === "BUTTON") {
        const subjectToDelete = event.target.dataset.subject;
        customSubjects = customSubjects.filter(subject => subject !== subjectToDelete);
        localStorage.setItem("customSubjects", JSON.stringify(customSubjects));
        renderSubjectList();
        subjectSelect.value = presetSubjects[0];
        sessions = sessions.filter(session => session.subject !== subjectToDelete);
        localStorage.setItem("sessions", JSON.stringify(sessions));
        renderSubjectDropdown();
        renderSessionList();
        renderSubjectCalc();
    }
});
// --- 5. Initial render on page load ---
renderSubjectDropdown();
renderSessionList();
renderSubjectList();
renderSubjectCalc();