// src/types/index.ts - TypeScript Type Definitions

export interface User {
  email: string;
  password: string;
  name: string;
  phone: string;
  contacts: Contact[];
  emails: {
    inbox: Email[];
    sent: Email[];
    drafts: Email[];
    trash: Email[];
    starred: Email[];
  };
}

export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  time: string;
  attachments: string[];
  starred: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Session {
  current: string | null;
}