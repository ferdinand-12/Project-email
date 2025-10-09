/* js/app.js - core logic for PingMe (frontend-only using localStorage)
   - Provides user auth, email CRUD, contacts, profile updates
   - Simple validation per Functional Requirements PDF
*/

/* Utilities */
const $ = sel => document.querySelector(sel);
const q = sel => Array.from(document.querySelectorAll(sel));
const uid = () => 'id-' + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

/* Data helpers using localStorage */
const LS = {
    get(key) { return JSON.parse(localStorage.getItem(key) || 'null'); },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

function seedIfEmpty() {
    if (!LS.get('pingme_users')) {
        const demoUser = {
            email: 'alice@example.com',
            password: 'password123',
            name: 'Alice Demo',
            phone: '081234567890',
            contacts: [],
            emails: {
                inbox: [
                    { id: uid(), from: 'bob@example.com', to: ['alice@example.com'], subject: 'Welcome to PingMe', body: 'This is a demo inbox message.', time: now(), attachments: [], starred: false }
                ],
                sent: [],
                drafts: [],
                trash: [],
                starred: []
            }
        };
        LS.set('pingme_users', [demoUser]);
    }
    if (!LS.get('pingme_session')) LS.set('pingme_session', { current: null });
}
seedIfEmpty();

/* User management */
function usersAll() { return LS.get('pingme_users') || []; }
function saveUsers(list) { LS.set('pingme_users', list); }
function findUserByEmail(email) { return usersAll().find(u => u.email.toLowerCase() === email.toLowerCase()); }
function createUser({ email, password, name, phone }) {
    const list = usersAll();
    list.push({ email, password, name, phone, contacts: [], emails: { inbox: [], sent: [], drafts: [], trash: [], starred: [] } });
    saveUsers(list);
}
function loginUser(email) {
    const s = LS.get('pingme_session') || {};
    s.current = email;
    LS.set('pingme_session', s);
}
function logoutUser() {
    LS.set('pingme_session', { current: null });
}
function currentUserEmail() { return (LS.get('pingme_session') || {}).current; }
function currentUser() {
    const e = currentUserEmail();
    return e ? findUserByEmail(e) : null;
}
function updateCurrentUserData(cb) {
    const email = currentUserEmail();
    if (!email) return;
    const list = usersAll();
    const idx = list.findIndex(u => u.email === email);
    if (idx < 0) return;
    const copy = JSON.parse(JSON.stringify(list[idx]));
    cb(copy);
    list[idx] = copy;
    saveUsers(list);
}

/* Email operations */
function sendEmail(fromEmail, toEmails, subject, body, attachments = []) {
    // create message object
    const message = { id: uid(), from: fromEmail, to: toEmails, subject, body, attachments, time: now(), starred: false };
    // add to sender's sent
    updateCurrentUserData(u => {
        u.emails.sent.unshift(message);
    });
    // add to recipients' inbox if they exist
    toEmails.forEach(rec => {
        const recip = findUserByEmail(rec);
        if (recip) {
            const list = usersAll();
            const idx = list.findIndex(x => x.email === rec);
            list[idx].emails.inbox.unshift(message);
            saveUsers(list);
        }
    });
}
function saveDraft(subject, body, toEmails = [], attachments = []) {
    const draft = { id: uid(), from: currentUserEmail(), to: toEmails, subject, body, attachments, time: now(), starred: false };
    updateCurrentUserData(u => {
        u.emails.drafts.unshift(draft);
    });
}
function moveToTrash(emailId, folder) {
    updateCurrentUserData(u => {
        const src = u.emails[folder];
        const idx = src.findIndex(m => m.id === emailId);
        if (idx >= 0) {
            const [m] = src.splice(idx, 1);
            u.emails.trash.unshift(m);
        }
    });
}
function restoreFromTrash(emailId) {
    updateCurrentUserData(u => {
        const idx = u.emails.trash.findIndex(m => m.id === emailId);
        if (idx >= 0) {
            const [m] = u.emails.trash.splice(idx, 1);
            u.emails.inbox.unshift(m);
        }
    });
}
function deletePermanently(emailId) {
    updateCurrentUserData(u => {
        u.emails.trash = u.emails.trash.filter(m => m.id !== emailId);
    });
}
function toggleStar(emailId, folder) {
    updateCurrentUserData(u => {
        const list = u.emails[folder];
        const m = list.find(x => x.id === emailId);
        if (m) {
            m.starred = !m.starred;
            if (m.starred) u.emails.starred.unshift(m);
            else u.emails.starred = u.emails.starred.filter(x => x.id !== emailId);
        }
    });
}
function getEmail(folder, id) {
    const u = currentUser();
    if (!u) return null;
    return u.emails[folder].find(m => m.id === id) || null;
}