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