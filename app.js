// Exam Preparation Dashboard - standalone (localStorage persistence + session timers & Web Audio alarm)

const SUBJECTS = [
  { key: "AI", label: "AI" },
  { key: "InfoSec", label: "InfoSec" },
  { key: "Sim", label: "Sim & Modeling" },
  { key: "Mixed", label: "Mixed" },
];

// Timetable sessions through 16:00. Buffer 16:00–16:30 is NOT tracked.
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
  { date: "2025-12-09", day: "Tue", sessions: [
      { time: "09:00–10:30", subject: "AI" },
      { time: "10:40–12:10", subject: "InfoSec" },
      { time: "12:50–14:20", subject: "Sim" },
      { time: "14:30–16:00", subject: "Mixed" },
    ]
  },
];

const PROJECT_TIME = "19:00–20:00";
const STORAGE_KEY = "exam_dashboard_v1";
const EXAM_DATE_ISO = "2025-12-09";

function isoDate(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function parseISO(iso){
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

function sessionId(date, time, subject){
  return `${date}__${time}__${subject}`;
}

function getTodayISO(){
  return isoDate(new Date());
}

// Parse time range "09:00–10:30" into start/end minutes from midnight & duration in seconds
function parseTimeRange(rangeStr){
  const parts = rangeStr.split(/[–-]/);
  const [sh, sm] = parts[0].split(":").map(Number);
  const [eh, em] = parts[1].split(":").map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  return {
    startMins,
    endMins,
    durationSec: Math.max(60, (endMins - startMins) * 60)
  };
}

function formatTimerClock(totalSec){
  const s = Math.max(0, Math.floor(totalSec));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if(hrs > 0){
    return `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  }
  return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

// --- Web Audio API Synthesized Alarm ---
let audioCtx = null;
let alarmLoopInterval = null;

function playAlarmChime(){
  try {
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(audioCtx.state === "suspended"){
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0.001, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.5);
    });
  } catch (e) {
    console.warn("Audio playback blocked or unsupported:", e);
  }
}

function startAlarm(){
  stopAlarm();
  playAlarmChime();
  alarmLoopInterval = setInterval(playAlarmChime, 2200);
  document.getElementById("timerCard").classList.add("alarming");
  document.getElementById("btnStopAlarm").classList.remove("hidden");
}

function stopAlarm(){
  if(alarmLoopInterval){
    clearInterval(alarmLoopInterval);
    alarmLoopInterval = null;
  }
  document.getElementById("timerCard").classList.remove("alarming");
  document.getElementById("btnStopAlarm").classList.add("hidden");
}

// --- Timer State & Logic ---
const timer = {
  id: null,          // sessionId or `${date}__PROJECT`
  type: null,        // "session" | "project"
  date: null,
  time: null,
  subject: null,
  totalSec: 0,
  remainingSec: 0,
  running: false,
  endTimestamp: null,
  intervalHandle: null,
  autoStartedIds: new Set()
};

function selectSessionForTimer(date, time, subject, type = "session", autoStart = true, customRemainingSec = null){
  stopAlarm();
  if(timer.intervalHandle){
    clearInterval(timer.intervalHandle);
    timer.intervalHandle = null;
  }

  const parsed = parseTimeRange(time);
  const id = type === "project" ? `${date}__PROJECT` : sessionId(date, time, subject);

  timer.id = id;
  timer.type = type;
  timer.date = date;
  timer.time = time;
  timer.subject = subject;
  timer.totalSec = parsed.durationSec;
  timer.remainingSec = customRemainingSec !== null ? customRemainingSec : parsed.durationSec;
  timer.running = false;
  timer.endTimestamp = null;

  if(autoStart){
    resumeTimer();
  } else {
    updateTimerUI();
    renderDays();
  }
}

function resumeTimer(){
  if(!timer.id || timer.running) return;
  if(timer.remainingSec <= 0){
    timer.remainingSec = timer.totalSec;
  }
  // Initialize AudioContext on user gesture so alarm works reliably later
  if(!audioCtx){
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  timer.running = true;
  timer.endTimestamp = Date.now() + timer.remainingSec * 1000;
  timer.intervalHandle = setInterval(tickTimer, 250);
  updateTimerUI();
  renderDays();
}

function pauseTimer(){
  if(!timer.running) return;
  timer.remainingSec = Math.max(0, Math.ceil((timer.endTimestamp - Date.now()) / 1000));
  timer.running = false;
  timer.endTimestamp = null;
  if(timer.intervalHandle){
    clearInterval(timer.intervalHandle);
    timer.intervalHandle = null;
  }
  updateTimerUI();
  renderDays();
}

function resetTimer(){
  stopAlarm();
  if(timer.intervalHandle){
    clearInterval(timer.intervalHandle);
    timer.intervalHandle = null;
  }
  timer.running = false;
  timer.endTimestamp = null;
  timer.remainingSec = timer.totalSec;
  updateTimerUI();
  renderDays();
}

function addFiveMinutes(){
  if(!timer.id) return;
  timer.totalSec += 300;
  timer.remainingSec += 300;
  if(timer.running && timer.endTimestamp){
    timer.endTimestamp += 300 * 1000;
  }
  updateTimerUI();
}

function tickTimer(){
  if(!timer.running) return;
  const rem = Math.ceil((timer.endTimestamp - Date.now()) / 1000);
  if(rem <= 0){
    timer.remainingSec = 0;
    completeActiveSession(true);
  } else {
    timer.remainingSec = rem;
    updateTimerUI();
  }
}

function completeActiveSession(triggerAlarmSound = true){
  if(timer.intervalHandle){
    clearInterval(timer.intervalHandle);
    timer.intervalHandle = null;
  }
  timer.running = false;
  timer.endTimestamp = null;
  timer.remainingSec = 0;

  // Mark session or project complete in persistent state
  if(timer.id){
    if(timer.type === "project"){
      state.project[timer.id] = true;
    } else {
      state.sessions[timer.id] = true;
    }
    saveState();
  }

  updateTimerUI(true);
  refreshUI();

  if(triggerAlarmSound){
    startAlarm();
  }
}

function updateTimerUI(justFinished = false){
  const card = document.getElementById("timerCard");
  const badge = document.getElementById("timerStatusBadge");
  const label = document.getElementById("timerSessionLabel");
  const sub = document.getElementById("timerSessionSub");
  const clock = document.getElementById("timerDisplay");
  const fill = document.getElementById("timerProgressFill");

  const btnToggle = document.getElementById("btnTimerToggle");
  const btnAdd5 = document.getElementById("btnTimerAdd5");
  const btnReset = document.getElementById("btnTimerReset");
  const btnComplete = document.getElementById("btnTimerComplete");

  if(!timer.id){
    card.classList.remove("running");
    badge.className = "status-pill idle";
    badge.textContent = "IDLE";
    label.textContent = "No active study session selected";
    sub.innerHTML = "Click <b>Start Timer</b> on any scheduled session below, or enable auto-schedule sync.";
    clock.textContent = "00:00";
    fill.style.width = "0%";
    document.title = "Exam Preparation Dashboard";

    btnToggle.disabled = true;
    btnToggle.textContent = "Start";
    btnAdd5.disabled = true;
    btnReset.disabled = true;
    btnComplete.disabled = true;
    return;
  }

  btnToggle.disabled = false;
  btnAdd5.disabled = false;
  btnReset.disabled = false;
  btnComplete.disabled = false;

  const formatted = formatTimerClock(timer.remainingSec);
  clock.textContent = formatted;
  const elapsedPct = timer.totalSec > 0 ? Math.min(100, Math.max(0, ((timer.totalSec - timer.remainingSec) / timer.totalSec) * 100)) : 0;
  fill.style.width = `${elapsedPct}%`;

  const titleText = timer.type === "project" ? "Evening Project Block" : `${timer.subject} Study Session`;
  label.textContent = `${titleText} (${timer.time})`;
  sub.textContent = `Date: ${timer.date} · Total duration: ${Math.round(timer.totalSec / 60)} mins`;

  if(justFinished || timer.remainingSec === 0){
    card.classList.remove("running");
    badge.className = "status-pill done";
    badge.textContent = "SESSION ENDED";
    btnToggle.textContent = "Restart";
    document.title = `⏰ Done! - ${titleText}`;
  } else if(timer.running){
    card.classList.add("running");
    badge.className = "status-pill running";
    badge.textContent = "IN PROGRESS";
    btnToggle.textContent = "Pause";
    document.title = `(${formatted}) ${titleText}`;
  } else {
    card.classList.remove("running");
    badge.className = "status-pill paused";
    badge.textContent = "PAUSED";
    btnToggle.textContent = "Resume";
    document.title = `[Paused] ${titleText}`;
  }
}

// Auto-detect current scheduled block based on system clock
function checkAutoScheduleSync(){
  const autoSync = document.getElementById("chkAutoSync")?.checked;
  if(!autoSync) return;

  const now = new Date();
  const todayISO = isoDate(now);
  const dayObj = timetable.find(d => d.date === todayISO);
  if(!dayObj) return;

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowSecOfDay = nowMins * 60 + now.getSeconds();

  // Check regular study sessions
  for(const sess of dayObj.sessions){
    const sid = sessionId(dayObj.date, sess.time, sess.subject);
    if(state.sessions[sid]) continue; // already done

    const { startMins, endMins } = parseTimeRange(sess.time);
    if(nowMins >= startMins && nowMins < endMins){
      if(!timer.running && timer.id !== sid && !timer.autoStartedIds.has(sid)){
        timer.autoStartedIds.add(sid);
        const remSec = Math.max(60, endMins * 60 - nowSecOfDay);
        selectSessionForTimer(dayObj.date, sess.time, sess.subject, "session", true, remSec);
      }
      return;
    }
  }

  // Check evening project block (19:00–20:00)
  const pid = `${dayObj.date}__PROJECT`;
  if(!state.project[pid]){
    const { startMins, endMins } = parseTimeRange(PROJECT_TIME);
    if(nowMins >= startMins && nowMins < endMins){
      if(!timer.running && timer.id !== pid && !timer.autoStartedIds.has(pid)){
        timer.autoStartedIds.add(pid);
        const remSec = Math.max(60, endMins * 60 - nowSecOfDay);
        selectSessionForTimer(dayObj.date, PROJECT_TIME, "Evening Project", "project", true, remSec);
      }
    }
  }
}

setInterval(checkAutoScheduleSync, 5000);

// --- Countdown & Dashboard Rendering ---
function formatCountdown(targetISO){
  const now = new Date();
  const target = parseISO(targetISO);
  target.setHours(23,59,59,999);
  const diff = target - now;
  if(diff <= 0) return "Exam day: 0d 0h 0m";
  const mins = Math.floor(diff/60000);
  const d = Math.floor(mins/(60*24));
  const h = Math.floor((mins%(60*24))/60);
  const m = mins%60;
  return `${d}d ${h}h ${m}m`;
}

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

    overallAll++;
    const pid = `${day.date}__PROJECT`;
    const pChecked = !!state.project[pid];
    if(pChecked) overallDone++;
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
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.target = `day_${day.date}`;
    b.innerHTML = `<div style="font-weight:900">${day.date}</div><div class="small">${day.day}</div>`;
    b.addEventListener("click", () => {
      document.getElementById(`day_${day.date}`).scrollIntoView({ behavior: "smooth", block: "start" });
      b.blur();
    });
    nav.appendChild(b);

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
    const isProjectActive = timer.id === pid;

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
          const isActive = timer.id === sid;
          const durMins = Math.round(parseTimeRange(sess.time).durationSec / 60);
          return `
            <div class="session ${isActive ? "active-timer" : ""}">
              <input type="checkbox" id="chk_${sid}" ${checked ? "checked" : ""} />
              <div class="session-meta">
                <div class="session-time">${sess.time}</div>
                <div class="session-subject">${sess.subject} · ${durMins} min</div>
              </div>
              <button type="button" class="btn ${isActive ? "success" : "secondary"} xs btn-start-session"
                data-date="${day.date}"
                data-time="${sess.time}"
                data-subject="${sess.subject}"
                data-type="session">
                ${isActive ? (timer.running ? "Running…" : "Selected") : "Start Timer"}
              </button>
            </div>
          `;
        }).join("")}
      </div>

      <div class="note">
        <label for="note_${day.date}">Daily notes (topics covered / struggled with)</label>
        <textarea id="note_${day.date}" placeholder="Write here...">${escapeHTML(state.notes[day.date] || "")}</textarea>
      </div>

      <div style="margin-top:12px;">
        <div class="session ${isProjectActive ? "active-timer" : ""}" style="background: rgba(124,92,255,.08);">
          <input type="checkbox" id="proj_${day.date}" ${projectDone ? "checked" : ""} />
          <div class="session-meta">
            <div class="session-time">Project tracker: ${PROJECT_TIME}</div>
            <div class="session-subject">Evening work block · 60 min</div>
          </div>
          <button type="button" class="btn ${isProjectActive ? "success" : "secondary"} xs btn-start-session"
            data-date="${day.date}"
            data-time="${PROJECT_TIME}"
            data-subject="Evening Project"
            data-type="project">
            ${isProjectActive ? (timer.running ? "Running…" : "Selected") : "Start Timer"}
          </button>
        </div>
      </div>
    `;

    // Checkbox listeners
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

    // Start Timer button listeners
    dayEl.querySelectorAll(".btn-start-session").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { date, time, subject, type } = btn.dataset;
        selectSessionForTimer(date, time, subject, type, true);
        document.getElementById("timerCard").scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    // Notes listener
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
  renderDays();
  renderProjectSummary();
}

// Timer Control Event Listeners
document.getElementById("btnTimerToggle").addEventListener("click", () => {
  stopAlarm();
  if(timer.running){
    pauseTimer();
  } else {
    resumeTimer();
  }
});

document.getElementById("btnTimerAdd5").addEventListener("click", () => {
  stopAlarm();
  addFiveMinutes();
});

document.getElementById("btnTimerReset").addEventListener("click", () => {
  resetTimer();
});

document.getElementById("btnTimerComplete").addEventListener("click", () => {
  completeActiveSession(true);
});

document.getElementById("btnStopAlarm").addEventListener("click", () => {
  stopAlarm();
});

document.getElementById("btnTestAlarm").addEventListener("click", () => {
  playAlarmChime();
});

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
  for(const day of timetable){
    if(!(day.date in state.notes)) state.notes[day.date] = state.notes[day.date] || "";
  }
  saveState();

  renderOverall();
  renderSubjectProgress();
  renderToday();
  renderDays();
  renderProjectSummary();
  updateTimerUI();
  checkAutoScheduleSync();
}

init();
