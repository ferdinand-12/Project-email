// src/lib/db.ts - Complete Database Utils
'use client';

import { User, Email, Contact, Session } from '@/types';

// Helper functions
const uid = () => 'id-' + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

// LocalStorage helpers
export const LS = {
  get(key: string) {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set(key: string, val: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
  },
};

// Seed initial data
export function seedIfEmpty() {
  if (!LS.get('pingme_users')) {
    const demoUser: User = {
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice Demo',
      phone: '081234567890',
      contacts: [],
      emails: {
        inbox: [
          {
            id: uid(),
            from: 'bob@example.com',
            to: ['alice@example.com'],
            subject: 'Welcome to PingMe',
            body: 'Hello Alice! Welcome to PingMe email application. This is your first demo email. You can star this email, reply to it, forward it, or delete it to test all features.',
            time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
            attachments: [],
            starred: false,
          },
          {
            id: uid(),
            from: 'team@pingme.com',
            to: ['alice@example.com'],
            subject: 'Getting Started with PingMe',
            body: 'Here are some tips to get started:\n\n1. Click the Compose button to write a new email\n2. Star important emails for quick access\n3. Use the search bar to find emails quickly\n4. Manage your contacts in the Contacts page\n\nEnjoy using PingMe!',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            attachments: [],
            starred: false,
          },
          {
            id: uid(),
            from: 'news@example.com',
            to: ['alice@example.com'],
            subject: 'Your Weekly Newsletter',
            body: 'Hello! Here is your weekly newsletter with the latest updates and news. Stay tuned for more exciting content coming your way!',
            time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            attachments: [],
            starred: false,
          },
          {
            id: uid(),
            from: 'support@pingme.com',
            to: ['alice@example.com'],
            subject: 'Need Help? We are here!',
            body: 'If you need any assistance with PingMe, feel free to reach out to our support team. We are always happy to help you with any questions or issues.',
            time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            attachments: [],
            starred: false,
          },
        ],
        sent: [],
        drafts: [],
        trash: [],
        starred: [],
      },
    };
    LS.set('pingme_users', [demoUser]);
  }
  if (!LS.get('pingme_session')) {
    LS.set('pingme_session', { current: null });
  }
}

// Reset all data and re-seed with dummy data
export function resetData() {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  seedIfEmpty();
}

// ========== USER MANAGEMENT ==========

export function usersAll(): User[] {
  return LS.get('pingme_users') || [];
}

export function saveUsers(list: User[]) {
  LS.set('pingme_users', list);
}

export function findUserByEmail(email: string): User | undefined {
  return usersAll().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: { email: string; password: string; name: string; phone: string }) {
  const list = usersAll();
  const newUser: User = {
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
    contacts: [],
    emails: {
      inbox: [],
      sent: [],
      drafts: [],
      trash: [],
      starred: [],
    },
  };
  list.push(newUser);
  saveUsers(list);
}

export function loginUser(email: string) {
  const s: Session = LS.get('pingme_session') || { current: null };
  s.current = email;
  LS.set('pingme_session', s);
}

export function logoutUser() {
  LS.set('pingme_session', { current: null });
}

export function currentUserEmail(): string | null {
  const session: Session = LS.get('pingme_session') || { current: null };
  return session.current;
}

export function currentUser(): User | null {
  const email = currentUserEmail();
  return email ? findUserByEmail(email) || null : null;
}

export function updateCurrentUserData(callback: (user: User) => void) {
  const email = currentUserEmail();
  if (!email) return;

  const list = usersAll();
  const idx = list.findIndex((u) => u.email === email);
  if (idx < 0) return;

  const userCopy = JSON.parse(JSON.stringify(list[idx]));
  callback(userCopy);
  list[idx] = userCopy;
  saveUsers(list);
}

// ========== EMAIL OPERATIONS ==========

export function sendEmail(
  fromEmail: string,
  toEmails: string[],
  subject: string,
  body: string,
  attachments: string[] = []
) {
  const message: Email = {
    id: uid(),
    from: fromEmail,
    to: toEmails,
    subject,
    body,
    attachments,
    time: now(),
    starred: false,
  };

  // Add to sender's sent folder
  updateCurrentUserData((u) => {
    u.emails.sent.unshift(message);
  });

  // Add to recipients' inbox (if they exist in system)
  toEmails.forEach((recipientEmail) => {
    const recipient = findUserByEmail(recipientEmail);
    if (recipient) {
      const list = usersAll();
      const idx = list.findIndex((x) => x.email === recipientEmail);
      if (idx >= 0) {
        list[idx].emails.inbox.unshift(message);
        saveUsers(list);
      }
    }
  });
}

export function saveDraft(
  subject: string,
  body: string,
  toEmails: string[] = [],
  attachments: string[] = []
) {
  const draft: Email = {
    id: uid(),
    from: currentUserEmail() || '',
    to: toEmails,
    subject,
    body,
    attachments,
    time: now(),
    starred: false,
  };

  updateCurrentUserData((u) => {
    u.emails.drafts.unshift(draft);
  });
}

export function moveToTrash(emailId: string, folder: keyof User['emails']) {
  updateCurrentUserData((u) => {
    const src = u.emails[folder];
    const idx = src.findIndex((m) => m.id === emailId);
    if (idx >= 0) {
      const [email] = src.splice(idx, 1);
      u.emails.trash.unshift(email);
    }
  });
}

export function restoreFromTrash(emailId: string) {
  updateCurrentUserData((u) => {
    const idx = u.emails.trash.findIndex((m) => m.id === emailId);
    if (idx >= 0) {
      const [email] = u.emails.trash.splice(idx, 1);
      u.emails.inbox.unshift(email);
    }
  });
}

export function deletePermanently(emailId: string) {
  updateCurrentUserData((u) => {
    u.emails.trash = u.emails.trash.filter((m) => m.id !== emailId);
  });
}

export function toggleStar(emailId: string, sourceFolder: keyof User['emails']) {
  updateCurrentUserData((u) => {
    // Find the email in any folder to get its new state
    let targetEmail: Email | undefined;
    const folders: Array<keyof User['emails']> = ['inbox', 'sent', 'drafts', 'trash'];

    // Toggle star status in all folders where this email exists
    folders.forEach(folder => {
      const email = u.emails[folder].find(e => e.id === emailId);
      if (email) {
        email.starred = !email.starred;
        targetEmail = email;
      }
    });

    // Also check if it's in the 'starred' folder (though it should be a copy/reference)
    // If we found it in a source folder, we know its new state.
    // If we only found it in 'starred' folder (unlikely if data is consistent), we toggle it there.

    if (targetEmail) {
      // Sync with starred folder
      if (targetEmail.starred) {
        // Add to starred if not already there
        if (!u.emails.starred.find(e => e.id === emailId)) {
          u.emails.starred.unshift(targetEmail);
        }
      } else {
        // Remove from starred
        u.emails.starred = u.emails.starred.filter(e => e.id !== emailId);
      }
    } else {
      // Fallback: if only in starred folder (edge case)
      const starIdx = u.emails.starred.findIndex(e => e.id === emailId);
      if (starIdx >= 0) {
        // It was starred, so we unstar it and remove it
        u.emails.starred.splice(starIdx, 1);
        // We should also try to unstar it in source folders if we missed it above
      }
    }
  });
}

export function getEmail(folder: keyof User['emails'], id: string): Email | null {
  const user = currentUser();
  if (!user) return null;
  return user.emails[folder].find((m) => m.id === id) || null;
}

// ========== CONTACTS ==========

export function addContact(data: { name: string; email: string; phone: string }) {
  updateCurrentUserData((u) => {
    const exists = u.contacts.find(
      (c) => c.email.toLowerCase() === data.email.toLowerCase()
    );
    if (!exists) {
      const newContact: Contact = {
        id: uid(),
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      u.contacts.push(newContact);
    }
  });
}

export function editContact(id: string, data: Partial<Contact>) {
  updateCurrentUserData((u) => {
    const contact = u.contacts.find((x) => x.id === id);
    if (contact) {
      Object.assign(contact, data);
    }
  });
}

export function removeContact(id: string) {
  updateCurrentUserData((u) => {
    u.contacts = u.contacts.filter((x) => x.id !== id);
  });
}

// ========== PROFILE ==========

export function updateProfile(data: { name: string; phone: string }) {
  updateCurrentUserData((u) => {
    u.name = data.name;
    u.phone = data.phone;
  });
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  const user = currentUser();
  if (!user) return false;
  if (user.password !== oldPassword) return false;

  updateCurrentUserData((u) => {
    u.password = newPassword;
  });
  return true;
}

// ========== VALIDATION ==========

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^08\d{8,14}$/.test(phone); // 10-16 digits, starting with 08
}

export function isValidFullName(name: string): boolean {
  return /^[A-Za-z ]{3,32}$/.test(name);
}