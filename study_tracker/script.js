// --- 1. Data setup ---
// Presets you'll likely reuse a lot, since these are the subjects
// you mentioned studying. This is just a plain JS array, like a Python list.
const presetSubjects = ["Math", "Physics", "Chemistry", "Programming"];

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
const logSessionBtn = document.getElementById("log-session-btn");
const sessionList = document.getElementById("session-list");

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
        li.textContent = `${session.subject} — ${session.minutes} min`;
        sessionList.appendChild(li);
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
});

logSessionBtn.addEventListener("click", () => {
    const subject = subjectSelect.value;
    const minutes = Number(minutesInput.value); // convert the input STRING to a number

    if (!minutes || minutes <= 0) return; // basic validation

    sessions.push({ subject: subject, minutes: minutes });
    localStorage.setItem("sessions", JSON.stringify(sessions));

    minutesInput.value = "";
    renderSessionList();
});

// --- 5. Initial render on page load ---
renderSubjectDropdown();
renderSessionList();