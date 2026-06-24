/* ============================================================
   CAMPUS HELP DESK — script.js
   Rule-based chatbot with keyword matching, Local Storage
   session management, typing animation, and quick replies.
   ============================================================ */

'use strict';

/* ============================================================
   1. KNOWLEDGE BASE
   Each rule has an array of keywords and a response string.
   The engine matches the user's lowercased input against every
   keyword list; the first matching rule wins.
   ============================================================ */
const KNOWLEDGE_BASE = [
  {
    id: 'admission',
    keywords: ['admission', 'apply', 'application', 'registration', 'enroll', 'enrollment', 'joining', 'how to join', 'new student', 'prospectus'],
    response: `📋 <strong>Admissions are open!</strong><br><br>
Students can apply through the college admission portal at <em>admissions.college.edu</em>. You'll need to submit:<br>
• Mark sheets (10th &amp; 12th)<br>
• Transfer certificate<br>
• Passport-size photographs<br>
• ID proof (Aadhaar / Passport)<br><br>
The deadline for the current academic year is <strong>July 31</strong>. Walk-in counselling is available Monday–Friday, 10 AM – 4 PM at the Admissions Office (Block A, Room 101).`,
  },
  {
    id: 'courses',
    keywords: ['course', 'courses', 'program', 'programs', 'subject', 'subjects', 'degree', 'stream', 'specialization', 'bca', 'btech', 'b.tech', 'mba', 'mca', 'bba'],
    response: `📚 <strong>Programs offered:</strong><br><br>
<strong>Undergraduate</strong><br>
• B.Tech (CS, ECE, ME, CE) — 4 years<br>
• BCA — 3 years<br>
• BBA — 3 years<br>
• B.Sc (Physics, Chemistry, Maths) — 3 years<br><br>
<strong>Postgraduate</strong><br>
• MBA — 2 years<br>
• MCA — 2 years<br>
• M.Tech — 2 years<br><br>
For full course details and syllabi, visit the <em>Academics</em> section on our website or contact the Registrar's office.`,
  },
  {
    id: 'fees',
    keywords: ['fee', 'fees', 'payment', 'tuition', 'cost', 'charges', 'due', 'pay', 'invoice', 'receipt', 'challan', 'semester fee'],
    response: `💳 <strong>Fee structure:</strong><br><br>
Fees vary by program. As a general guide:<br>
• B.Tech / MCA — ₹ 80,000 – ₹ 1,20,000 per year<br>
• BCA / BBA — ₹ 40,000 – ₹ 60,000 per year<br>
• MBA — ₹ 90,000 – ₹ 1,40,000 per year<br><br>
Fees can be paid online via the student portal or by DD at the Accounts Department (Block B, Ground Floor).<br><br>
<strong>Last date for semester fee payment:</strong> 15th of the first month of each semester. Late fines apply after this date.`,
  },
  {
    id: 'scholarship',
    keywords: ['scholarship', 'scholarships', 'financial aid', 'waiver', 'concession', 'stipend', 'bursary', 'merit scholarship', 'free education'],
    response: `🏅 <strong>Scholarship &amp; Financial Aid:</strong><br><br>
We offer several scholarship programs:<br>
• <strong>Merit Scholarship</strong> — for students with 85%+ in qualifying exam (up to 50% fee waiver)<br>
• <strong>SC/ST/OBC Scholarship</strong> — Government-funded, applied via the National Scholarship Portal<br>
• <strong>Sports Excellence Award</strong> — for national-level athletes<br>
• <strong>Single-Girl Child Scholarship</strong> — full tuition waiver<br><br>
Apply within 30 days of admission with supporting documents. Contact the Scholarship Cell in Block C, Room 203.`,
  },
  {
    id: 'hostel',
    keywords: ['hostel', 'accommodation', 'dormitory', 'dorm', 'mess', 'room', 'boarding', 'stay', 'residence', 'pg', 'living'],
    response: `🏠 <strong>Hostel facilities:</strong><br><br>
Separate, secure hostels are available for boys and girls on campus:<br>
• 24×7 Wi-Fi (100 Mbps fibre)<br>
• Subsidised multi-cuisine mess<br>
• CCTV and biometric access<br>
• Common room, TV lounge, gym<br>
• Warden available round the clock<br><br>
<strong>Hostel fee:</strong> ₹ 60,000 – ₹ 80,000 per year (inclusive of mess).<br>
Apply at the time of admission. Seats are limited — apply early!`,
  },
  {
    id: 'library',
    keywords: ['library', 'books', 'borrow', 'issue', 'return', 'digital library', 'e-books', 'reading room', 'journals', 'reference'],
    response: `📖 <strong>Central Library:</strong><br><br>
• <strong>Timings:</strong> Monday – Saturday, 8:00 AM – 8:00 PM<br>
• Sunday: 10:00 AM – 4:00 PM (reading room only)<br><br>
• Over 45,000 physical books and 10,000+ e-books<br>
• Access to <em>IEEE Xplore, JSTOR,</em> and <em>Springer</em> databases<br>
• Students may borrow up to 4 books for 14 days<br>
• Fine for late return: ₹ 2/day per book<br><br>
Use your student ID card to access the library and borrow books.`,
  },
  {
    id: 'exams',
    keywords: ['exam', 'exams', 'examination', 'test', 'schedule', 'timetable', 'result', 'results', 'grade', 'marks', 'paper', 'internal', 'external', 'practical', 'backlog', 'arrear'],
    response: `📝 <strong>Examination information:</strong><br><br>
• Semester exam schedules are published on the <em>Student Portal</em> 4 weeks before exams begin.<br>
• <strong>Internal assessment</strong> comprises assignments, quizzes, and mid-term tests (40% weightage).<br>
• <strong>End-semester exams</strong> are conducted by the university (60% weightage).<br>
• Hall tickets are issued online — download from the portal before the exam.<br>
• Results are declared within 45 days of the last exam date.<br><br>
For re-evaluation or backlog exams, contact the Examination Section (Block D, Room 5).`,
  },
  {
    id: 'placements',
    keywords: ['placement', 'placements', 'job', 'jobs', 'career', 'recruitment', 'hire', 'hiring', 'internship', 'campus drive', 'ctc', 'package', 'company', 'interview'],
    response: `💼 <strong>Placement &amp; Career Cell:</strong><br><br>
Our dedicated Training &amp; Placement Office (TPO) has a strong track record:<br>
• 92% placement rate (2023–24 batch)<br>
• Highest CTC: ₹ 18 LPA | Average CTC: ₹ 6.5 LPA<br>
• 150+ companies visit campus each year<br><br>
<strong>Services offered:</strong><br>
• Aptitude training &amp; mock interviews<br>
• Resume building workshops<br>
• Industry internship tie-ups<br>
• Alumni mentoring sessions<br><br>
Register with the TPO in Block E, Room 12. Email: tpo@college.edu`,
  },
  {
    id: 'contact',
    keywords: ['contact', 'phone', 'email', 'helpdesk', 'help desk', 'support', 'number', 'address', 'location', 'reach', 'call', 'office', 'principal', 'website'],
    response: `📞 <strong>Contact us:</strong><br><br>
<strong>General Helpdesk</strong><br>
✉️ helpdesk@college.edu<br>
📱 +91-9876543210 (Mon–Sat, 9 AM – 5 PM)<br><br>
<strong>Address</strong><br>
Campus Help Desk, Block A, Ground Floor<br>
College Road, Education Hub – 560001<br><br>
<strong>Quick links:</strong><br>
• Admissions: admissions@college.edu<br>
• Accounts (fees): accounts@college.edu<br>
• Placement: tpo@college.edu<br>
• IT Support: ithelp@college.edu`,
  },
];

/* Fallback when no rule matches */
const FALLBACK_RESPONSE = `🤔 I couldn't find a specific answer to that. Here are some things I can help you with:<br><br>
<strong>Admission · Courses · Fees · Scholarship · Hostel · Library · Exams · Placements · Contact</strong><br><br>
Try rephrasing your question or click one of the quick-reply buttons above. For urgent matters, reach us at <em>helpdesk@college.edu</em>.`;


/* ============================================================
   2. ENGINE — keyword matching
   Returns the matched response string, or FALLBACK_RESPONSE.
   ============================================================ */
function getResponse(userText) {
  /* Normalise: lowercase, strip extra whitespace */
  const normalised = userText.toLowerCase().trim();

  for (const rule of KNOWLEDGE_BASE) {
    /* Check every keyword in this rule */
    const matched = rule.keywords.some(kw => normalised.includes(kw));
    if (matched) return rule.response;
  }

  return FALLBACK_RESPONSE;
}


/* ============================================================
   3. LOCAL STORAGE — session management
   Data structure:
   sessions: [ { id, title, createdAt, messages: [ {role, text, timestamp} ] } ]
   ============================================================ */
const STORAGE_KEY = 'campus_helpdesk_sessions_v2';

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}


/* ============================================================
   4. STATE
   ============================================================ */
let sessions     = loadSessions();   /* all sessions array           */
let activeId     = null;             /* currently open session id    */

function getActiveSession() {
  return sessions.find(s => s.id === activeId) || null;
}

/* Create a brand-new session and make it active */
function createSession() {
  const session = {
    id: 'sess_' + Date.now(),
    title: 'New chat',
    createdAt: new Date().toISOString(),
    messages: [],
  };
  sessions.unshift(session);
  saveSessions(sessions);
  return session;
}

/* Add a message object to the active session */
function persistMessage(role, text) {
  const session = getActiveSession();
  if (!session) return;
  session.messages.push({ role, text, timestamp: new Date().toISOString() });
  /* Use first user message as the session title (truncated) */
  if (role === 'user' && session.title === 'New chat') {
    session.title = text.length > 38 ? text.slice(0, 36) + '…' : text;
  }
  saveSessions(sessions);
}


/* ============================================================
   5. DOM HELPERS
   ============================================================ */
const feed          = document.getElementById('messageFeed');
const input         = document.getElementById('userInput');
const sendBtn       = document.getElementById('sendBtn');
const sessionList   = document.getElementById('sessionList');
const clearHistBtn  = document.getElementById('clearHistoryBtn');
const welcomeCard   = document.getElementById('welcomeCard');
const newChatBtn    = document.getElementById('newChatBtn');
const menuBtn       = document.getElementById('menuBtn');
const closeSideBar  = document.getElementById('closeSidebar');
const sidebarEl     = document.querySelector('.sidebar');
const overlay       = document.getElementById('sidebarOverlay');

/* Format a Date object as "h:mm AM/PM" */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/* Format a Date object as a short date string */
function formatDate(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}


/* ============================================================
   6. RENDER HELPERS
   ============================================================ */

/* Append a message bubble to the feed */
function renderMessage(role, htmlText, isoTimestamp) {
  const time   = formatTime(new Date(isoTimestamp));
  const isUser = role === 'user';

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  /* Avatar */
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.innerHTML = isUser ? 'You' : '🎓';

  /* Bubble */
  const body = document.createElement('div');
  body.className = 'msg-body';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  /* We allow HTML from our own knowledge base only;
     user input is text-escaped to prevent XSS */
  if (isUser) {
    bubble.textContent = htmlText;   /* safe: user content is plain text */
  } else {
    bubble.innerHTML = htmlText;     /* trusted: from our knowledge base  */
  }

  const timeEl = document.createElement('div');
  timeEl.className = 'msg-time';
  timeEl.textContent = time;

  body.appendChild(bubble);
  body.appendChild(timeEl);

  if (isUser) {
    row.appendChild(body);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(body);
  }

  feed.appendChild(row);
  scrollToBottom();

  return row;
}

/* Show / remove typing indicator */
let typingEl = null;

function showTyping() {
  typingEl = document.createElement('div');
  typingEl.className = 'msg-row bot';
  typingEl.setAttribute('aria-label', 'Bot is typing');
  typingEl.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">🎓</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  feed.appendChild(typingEl);
  scrollToBottom();
}

function removeTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

function scrollToBottom() {
  feed.scrollTop = feed.scrollHeight;
}

/* Hide welcome card after first message */
function hideWelcomeCard() {
  if (welcomeCard && welcomeCard.style.display !== 'none') {
    welcomeCard.style.display = 'none';
  }
}


/* ============================================================
   7. SIDEBAR RENDERING
   ============================================================ */
function renderSidebar() {
  sessionList.innerHTML = '';

  if (sessions.length === 0) {
    sessionList.innerHTML = '<li class="sidebar-empty">No previous chats yet.</li>';
    return;
  }

  sessions.forEach(session => {
    const li = document.createElement('li');
    li.className = 'session-item' + (session.id === activeId ? ' active' : '');
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Open chat: ${session.title}`);

    li.innerHTML = `
      <div class="session-icon" aria-hidden="true">
        <i class="ti ti-message"></i>
      </div>
      <div class="session-meta">
        <div class="session-title">${escapeHtml(session.title)}</div>
        <div class="session-date">${formatDate(session.createdAt)}</div>
      </div>
      <button class="session-delete" aria-label="Delete this chat" title="Delete">
        <i class="ti ti-trash"></i>
      </button>`;

    /* Click to load session */
    li.addEventListener('click', (e) => {
      if (e.target.closest('.session-delete')) return;
      loadSession(session.id);
      closeSidebarMobile();
    });

    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.target.closest('.session-delete')) {
        loadSession(session.id);
        closeSidebarMobile();
      }
    });

    /* Delete button */
    li.querySelector('.session-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSession(session.id);
    });

    sessionList.appendChild(li);
  });
}

/* Escape HTML for safely rendering user-provided strings */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


/* ============================================================
   8. LOAD / DELETE SESSION
   ============================================================ */
function loadSession(id) {
  activeId = id;
  const session = getActiveSession();
  if (!session) return;

  /* Clear the feed */
  feed.innerHTML = '';

  /* Show / hide welcome card */
  if (session.messages.length === 0) {
    const wc = document.createElement('div');
    wc.className = 'welcome-card';
    wc.id = 'welcomeCard';
    wc.innerHTML = `
      <div class="welcome-icon" aria-hidden="true">🎓</div>
      <h1>Hello, I'm your Campus Assistant</h1>
      <p>Ask me anything about admissions, courses, fees, hostel, library, or placements — or pick a topic below.</p>`;
    feed.appendChild(wc);
  }

  /* Replay messages with date dividers */
  let lastDateLabel = '';
  session.messages.forEach(msg => {
    const dateLabel = formatDate(msg.timestamp);
    if (dateLabel !== lastDateLabel) {
      const divider = document.createElement('div');
      divider.className = 'date-divider';
      divider.textContent = dateLabel;
      feed.appendChild(divider);
      lastDateLabel = dateLabel;
    }
    renderMessage(msg.role, msg.text, msg.timestamp);
  });

  renderSidebar();
  scrollToBottom();
}

function deleteSession(id) {
  sessions = sessions.filter(s => s.id !== id);
  saveSessions(sessions);

  /* If we deleted the active session, start fresh */
  if (id === activeId) {
    startNewChat();
  } else {
    renderSidebar();
  }
}


/* ============================================================
   9. NEW CHAT
   ============================================================ */
function startNewChat() {
  const session = createSession();
  activeId = session.id;
  loadSession(activeId);
}


/* ============================================================
   10. SEND MESSAGE FLOW
   ============================================================ */
function sendMessage(text) {
  /* Trim whitespace */
  const userText = (text || input.value).trim();
  if (!userText) return;

  /* Ensure we have an active session */
  if (!activeId || !getActiveSession()) startNewChat();

  /* Hide welcome card on first message */
  hideWelcomeCard();

  /* Render user message immediately */
  const now = new Date().toISOString();
  persistMessage('user', userText);
  renderMessage('user', userText, now);

  /* Clear input */
  input.value = '';
  autoResizeTextarea();

  /* Disable send while bot "thinks" */
  sendBtn.disabled = true;
  input.disabled   = true;

  /* Show typing animation */
  showTyping();

  /* Simulate a short thinking delay for natural feel */
  const delay = 600 + Math.random() * 600;
  setTimeout(() => {
    removeTyping();

    const botReply   = getResponse(userText);
    const botNow     = new Date().toISOString();
    persistMessage('bot', botReply);
    renderMessage('bot', botReply, botNow);

    /* Re-enable input */
    sendBtn.disabled = false;
    input.disabled   = false;
    input.focus();

    /* Keep sidebar title up to date */
    renderSidebar();
  }, delay);
}


/* ============================================================
   11. INPUT EVENTS
   ============================================================ */

/* Auto-expand textarea as user types */
function autoResizeTextarea() {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

input.addEventListener('input', autoResizeTextarea);

/* Enter = send (Shift+Enter = newline) */
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', () => sendMessage());

/* Quick-reply chips */
document.getElementById('quickReplies').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (chip) {
    sendMessage(chip.dataset.query);
    input.focus();
  }
});

/* New chat button */
newChatBtn.addEventListener('click', () => {
  startNewChat();
  input.focus();
});

/* Clear all history */
clearHistBtn.addEventListener('click', () => {
  if (!confirm('Delete all chat history? This cannot be undone.')) return;
  sessions = [];
  saveSessions(sessions);
  startNewChat();
});


/* ============================================================
   12. MOBILE SIDEBAR TOGGLE
   ============================================================ */
function openSidebarMobile() {
  sidebarEl.classList.add('open');
  overlay.classList.add('visible');
  overlay.removeAttribute('aria-hidden');
}

function closeSidebarMobile() {
  sidebarEl.classList.remove('open');
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
}

menuBtn.addEventListener('click', openSidebarMobile);
closeSideBar.addEventListener('click', closeSidebarMobile);
overlay.addEventListener('click', closeSidebarMobile);


/* ============================================================
   13. INIT — boot the app
   ============================================================ */
function init() {
  if (sessions.length > 0) {
    /* Resume the most recent session */
    activeId = sessions[0].id;
    loadSession(activeId);
  } else {
    /* Fresh first visit */
    startNewChat();
  }

  /* Render sidebar with all saved sessions */
  renderSidebar();

  /* Focus the input so user can type immediately */
  input.focus();
}

init();