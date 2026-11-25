// Exam Preparation Dashboard - standalone (localStorage persistence)

const SUBJECTS = [
  { key: "AI", label: "AI" },
  { key: "InfoSec", label: "InfoSec" },
  { key: "Sim", label: "Sim & Modeling" },
  { key: "Mixed", label: "Mixed" },
];

// Timetable sessions through 16:00 (as provided). Buffer 16:00–16:30 is NOT tracked.
const timetable = [
  { date: "2025-11-25", day: "Tue", sessions: [
      { time: "09:00–10:30", subject: "AI" },
      { time: "10:40–12:10", subject: "InfoSec" },
      { time: "12:50–14:20", subject: "Sim" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-11-26", day: "Wed", sessions: [
      { time: "09:00–10:30", subject: "InfoSec" },
      { time: "10:40–12:10", subject: "Sim" },
      { time: "12:50–14:20", subject: "AI" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-11-27", day: "Thu", sessions: [
      { time: "09:00–10:30", subject: "Sim" },
      { time: "10:40–12:10", subject: "AI" },
      { time: "12:50–14:20", subject: "InfoSec" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-11-28", day: "Fri", sessions: [
      { time: "09:00–10:30", subject: "AI" },
      { time: "10:40–12:10", subject: "InfoSec" },
      { time: "12:50–14:20", subject: "Sim" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-11-29", day: "Sat", sessions: [
      { time: "09:00–10:30", subject: "InfoSec" },
      { time: "10:40–12:10", subject: "Sim" },
      { time: "12:50–14:20", subject: "AI" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-11-30", day: "Sun", sessions: [
      { time: "09:00–10:30", subject: "Sim" },
      { time: "10:40–12:10", subject: "AI" },
      { time: "12:50–14:20", subject: "InfoSec" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-01", day: "Mon", sessions: [
      { time: "09:00–10:30", subject: "Sim" },
      { time: "10:40–12:10", subject: "AI" },
      { time: "12:50–14:20", subject: "InfoSec" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-02", day: "Tue", sessions: [
      { time: "09:00–10:30", subject: "AI" },
      { time: "10:40–12:10", subject: "InfoSec" },
      { time: "12:50–14:20", subject: "Sim" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-03", day: "Wed", sessions: [
      { time: "09:00–10:30", subject: "Sim" },
      { time: "10:40–12:10", subject: "AI" },
      { time: "12:50–14:20", subject: "InfoSec" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-04", day: "Thu", sessions: [
      { time: "09:00–10:30", subject: "Sim" },
      { time: "10:40–12:10", subject: "AI" },
      { time: "12:50–14:20", subject: "InfoSec" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-05", day: "Fri", sessions: [
      { time: "09:00–10:30", subject: "AI" },
      { time: "10:40–12:10", subject: "InfoSec" },
      { time: "12:50–14:20", subject: "Sim" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-06", day: "Sat", sessions: [
      { time: "09:00–10:30", subject: "InfoSec" },
      { time: "10:40–12:10", subject: "Sim" },
      { time: "12:50–14:20", subject: "AI" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-07", day: "Sun", sessions: [
      { time: "09:00–10:30", subject: "Sim" },
      { time: "10:40–12:10", subject: "AI" },
      { time: "12:50–14:20", subject: "InfoSec" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  { date: "2025-12-08", day: "Mon", sessions: [
      { time: "09:00–10:30", subject: "InfoSec" },
      { time: "10:40–12:10", subject: "Sim" },
      { time: "12:50–14:20", subject: "AI" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
  // Exam day: per your note, “only 30–45 min quick recall… No new material.”
  // We'll still show sessions, but you can treat them as checklist placeholders.
  // If you want, tell me and I’ll customize exam day to a single "Quick recall" card.
  { date: "2025-12-09", day: "Tue", sessions: [
      { time: "09:00–10:30", subject: "AI" },
      { time: "10:40–12:10", subject: "InfoSec" },
      { time: "12:50–14:20", subject: "Sim" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
];

// Project tracker is every evening 19:00–20:00
const PROJECT_TIME = "19:00–20:00";

const STORAGE_KEY = "exam_dashboard_v1";

function isoDate(d){
  // d is Date
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function parseISO(iso){
  // treat as local date at 00:00
  const [y,m,day] = iso.split("-").map(Number);
  return new Date(y, m-1, day);
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    return { sessions: {}, project: {}, notes: {} };
  }
  try{
    const data = JSON.parse(raw);
    return data || { sessions: {}, project: {}, notes: {} };
  }catch{
    return { sessions: {}, project: {}, notes: {} };
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// Build helpers
function sessionId(date, time, subject){
  return `${date}__${time}__${subject}`;
}

function getTodayISO(){
  return isoDate(new Date());
}

function formatCountdown(targetISO){
  const now = new Date();
  const target = parseISO(targetISO);
  // countdown to end of exam day (23:59:59)
  target.setHours(23,59,59,999);
  const diff = target - now;
  if(diff <= 0) return "Exam day: 0d 0h 0m";
  const mins = Math.floor(diff/60000);
  const d = Math.floor(mins/(60*24));
  const h = Math.floor((mins%(60*24))/60);
  const m = mins%60;
  return `${d}d ${h}h ${m}m`;
}

const EXAM_DATE_ISO = "2025-12-09";

function renderSubjectProgress(){
  const subjectList = document.getElementById("subjectList");
  subjectList.innerHTML = "";

  const totals = computeTotals();
  for(const s of SUBJECTS){
    const key = s.key;
    const done = totals.bySubject[key]?.done ?? 0;
    const all  = totals.bySubject[key]?.all ?? 0;
    const pct = all ? (done/all)*100 : 0;

    const item = document.createElement("div");
    item.className = "subject-item";

    item.innerHTML = `
      <div class="subject-top">
        <div class="subject-name">${s.label}</div>
        <div class="badge">${done}/${all}</div>
      </div>
      <div class="subject-bar">
        <div class="subject-fill" style="width:${pct}%;"></div>
      </div>
    `;
    subjectList.appendChild(item);
  }
}

function computeTotals(){
  // overall = all sessions + project checkboxes
  let overallAll = 0, overallDone = 0;

  const bySubject = {};
  for(const s of SUBJECTS){
    bySubject[s.key] = { all:0, done:0 };
  }

  for(const day of timetable){
    for(const sess of day.sessions){
      overallAll++;
      const sid = sessionId(day.date, sess.time, sess.subject);
      const checked = !!state.sessions[sid];
      if(checked) overallDone++;
      if(bySubject[sess.subject]){
        bySubject[sess.subject].all++;
        if(checked) bySubject[sess.subject].done++;
      }
    }

    // project tracker
    overallAll++;
    const pid = `${day.date}__PROJECT`;
    const pChecked = !!state.project[pid];
    if(pChecked) overallDone++;
    // project doesn't belong to subject; we keep it only for overall progress
  }

  const todayISO = getTodayISO();
  return {
    overall: { all: overallAll, done: overallDone },
    bySubject,
    today: computeTodayTotals(todayISO),
  };
}

function computeTodayTotals(todayISO){
  const day = timetable.find(d => d.date === todayISO);
  if(!day){
    return { sessionsAll:0, sessionsDone:0, projectDone:false, projectAll:1 };
  }
  let sessionsAll = day.sessions.length;
  let sessionsDone = 0;
  for(const sess of day.sessions){
    const sid = sessionId(day.date, sess.time, sess.subject);
    if(state.sessions[sid]) sessionsDone++;
  }
  const pid = `${day.date}__PROJECT`;
  const projectDone = !!state.project[pid];
  return { sessionsAll, sessionsDone, projectAll:1, projectDone };
}

function renderOverall(){
  const totals = computeTotals();
  const pct = totals.overall.all ? (totals.overall.done/totals.overall.all)*100 : 0;

  document.getElementById("overallBar").style.width = `${pct}%`;
  document.getElementById("overallText").textContent = `${totals.overall.done}/${totals.overall.all}`;
  document.getElementById("overallMeta").textContent = `Progress includes all timetable sessions + ${PROJECT_TIME} checkboxes.`;
}

function renderToday(){
  const totals = computeTotals();
  const todayISO = getTodayISO();
  const day = timetable.find(d => d.date === todayISO);

  const todayDateEl = document.getElementById("todayDate");
  const todayProgressEl = document.getElementById("todayProgress");

  if(!day){
    todayDateEl.textContent = `Today: ${todayISO} (not in range)`;
    todayProgressEl.textContent = "—";
    return;
  }

  todayDateEl.textContent = `Today: ${day.date} (${day.day})`;

  const sessionsPart = `${totals.today.sessionsDone}/${totals.today.sessionsAll} sessions`;
  const projectPart = `+ Project: ${totals.today.projectDone ? "done" : "not yet"}`;
  todayProgressEl.textContent = `${sessionsPart} · ${projectPart}`;
}

function renderProjectSummary(){
  const daySummary = document.getElementById("projectSummary");
  let all = 0, done = 0;
  for(const day of timetable){
    all++;
    const pid = `${day.date}__PROJECT`;
    if(state.project[pid]) done++;
  }
  daySummary.textContent = `${done}/${all} days completed (${PROJECT_TIME})`;
}

function renderDays(){
  const nav = document.getElementById("dayNav");
  const container = document.getElementById("dayContainer");
  nav.innerHTML = "";
  container.innerHTML = "";

  for(const day of timetable){
    // nav button
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.target = `day_${day.date}`;
    b.innerHTML = `<div style="font-weight:900">${day.date}</div><div class="small">${day.day}</div>`;
    b.addEventListener("click", () => {
      document.getElementById(`day_${day.date}`).scrollIntoView({ behavior: "smooth", block: "start" });
      b.blur();
    });
    nav.appendChild(b);

    // day block
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.id = `day_${day.date}`;

    const doneCount = day.sessions.reduce((acc, sess) => {
      const sid = sessionId(day.date, sess.time, sess.subject);
      return acc + (state.sessions[sid] ? 1 : 0);
    }, 0);

    const dayAll = day.sessions.length;
    const pid = `${day.date}__PROJECT`;
    const projectDone = !!state.project[pid];

    dayEl.innerHTML = `
      <div class="day-header">
        <div class="day-title">
          <div class="day-date">${day.date}</div>
          <div class="day-dow">${day.day}</div>
        </div>
        <div class="day-actions">
          <div class="day-progress">${doneCount}/${dayAll} sessions</div>
          <div class="muted small">${PROJECT_TIME}: ${projectDone ? "done" : "not yet"}</div>
        </div>
      </div>

      <div class="session-grid">
        ${day.sessions.map((sess) => {
          const sid = sessionId(day.date, sess.time, sess.subject);
          const checked = !!state.sessions[sid];
          return `
            <div class="session">
              <input type="checkbox" id="chk_${sid}" ${checked ? "checked" : ""} />
              <div class="session-meta">
                <div class="session-time">${sess.time}</div>
                <div class="session-subject">${sess.subject}</div>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <div class="note">
        <label for="note_${day.date}">Daily notes (topics covered / struggled with)</label>
        <textarea id="note_${day.date}" placeholder="Write here...">${escapeHTML(state.notes[day.date] || "")}</textarea>
      </div>

      <div style="margin-top:12px;">
        <div class="session" style="background: rgba(124,92,255,.08);">
          <input type="checkbox" id="proj_${day.date}" ${projectDone ? "checked" : ""} />
          <div class="session-meta">
            <div class="session-time">Project tracker: ${PROJECT_TIME}</div>
            <div class="session-subject">Evening work block</div>
          </div>
        </div>
      </div>
    `;

    // attach checkbox listeners
    dayEl.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.id;
        if(id.startsWith("chk_")){
          const sid = id.slice(4);
          state.sessions[sid] = e.target.checked;
        }else if(id.startsWith("proj_")){
          const d = id.slice(5);
          state.project[`${d}__PROJECT`] = e.target.checked;
        }
        saveState();
        refreshUI();
      });
    });

    // notes listener
    const ta = dayEl.querySelector(`#note_${day.date}`);
    ta.addEventListener("input", (e) => {
      state.notes[day.date] = e.target.value;
      saveState();
    });

    container.appendChild(dayEl);
  }
}

function escapeHTML(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function refreshUI(){
  renderOverall();
  renderSubjectProgress();
  renderToday();
  renderDays(); // rerender to update counts
  renderProjectSummary();
}

// Export/Import/Reset
function getAllBackup(){
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    state
  };
}

function applyBackup(backup){
  if(!backup || !backup.state) throw new Error("Invalid backup file.");
  state = backup.state;
  saveState();
}

document.getElementById("btnReset").addEventListener("click", () => {
  if(!confirm("Reset all saved progress + notes on this device?")) return;
  state = { sessions: {}, project: {}, notes: {} };
  saveState();
  refreshUI();
});

document.getElementById("btnExport").addEventListener("click", () => {
  const payload = getAllBackup();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `exam-dashboard-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

document.getElementById("fileImport").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if(!file) return;
  try{
    const text = await file.text();
    const backup = JSON.parse(text);
    applyBackup(backup);
    alert("Import complete.");
    refreshUI();
  }catch(err){
    alert("Import failed: " + (err?.message || err));
  }finally{
    e.target.value = "";
  }
});

// Countdown
function renderCountdown(){
  document.getElementById("countdown").textContent = formatCountdown(EXAM_DATE_ISO);
}
setInterval(renderCountdown, 30000);
renderCountdown();

function init(){
  // Ensure timetable range notes keys exist (optional)
  for(const day of timetable){
    if(!(day.date in state.notes)) state.notes[day.date] = state.notes[day.date] || "";
  }
  saveState();

  renderOverall();
  renderSubjectProgress();
  renderToday();
  renderDays();
  renderProjectSummary();
}

init();
