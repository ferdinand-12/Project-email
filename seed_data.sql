-- Ganti 'EMAIL_ANDA_DISINI' dengan email yang Anda gunakan untuk login di aplikasi
-- Contoh: target_email text := 'alice@example.com';

DO $$
DECLARE
  target_email text := 'EMAIL_ANDA_DISINI'; 
  user_id uuid;
BEGIN
  -- Dapatkan user_id dari email
  SELECT id INTO user_id FROM auth.users WHERE email = target_email;

  IF user_id IS NULL THEN
    RAISE NOTICE 'User dengan email % tidak ditemukan. Pastikan Anda sudah Sign Up dan Login di aplikasi terlebih dahulu.', target_email;
    RETURN;
  END IF;

  -- Insert Inbox Items
  INSERT INTO public.emails (user_id, from_email, to_emails, subject, body, folder, is_read, created_at) VALUES
  (user_id, 'welcome@pingme.com', ARRAY[target_email], 'Welcome to PingMe!', 'Welcome to your new inbox. We are glad to have you here.', 'inbox', false, now()),
  (user_id, 'boss@company.com', ARRAY[target_email], 'Project Update', 'Please send me the latest updates by EOD. We need to review the Q4 targets.', 'inbox', true, now() - interval '1 hour'),
  (user_id, 'newsletter@tech.com', ARRAY[target_email], 'Weekly Tech News', 'Here are the top stories of the week: \n1. AI takes over the world\n2. New JS framework released\n3. CSS is now a programming language', 'inbox', false, now() - interval '1 day'),
  (user_id, 'hr@company.com', ARRAY[target_email], 'Holiday Schedule', 'Please note the upcoming holiday schedule attached below.', 'inbox', false, now() - interval '3 days');

  -- Insert Sent Items
  INSERT INTO public.emails (user_id, from_email, to_emails, subject, body, folder, is_read, created_at) VALUES
  (user_id, target_email, ARRAY['client@example.com'], 'Meeting Proposal', 'Hi, I would like to propose a meeting for next Tuesday to discuss the project requirements.', 'sent', true, now() - interval '2 days'),
  (user_id, target_email, ARRAY['boss@company.com'], 'Re: Project Update', 'I will send the report shortly.', 'sent', true, now() - interval '30 minutes');

  -- Insert Drafts
  INSERT INTO public.emails (user_id, from_email, to_emails, subject, body, folder, is_read, created_at) VALUES
  (user_id, target_email, ARRAY['support@tool.com'], 'Bug Report', 'I found a bug in the system...', 'drafts', true, now() - interval '5 hours');

  -- Insert Contacts
  INSERT INTO public.contacts (user_id, name, email, phone) VALUES
  (user_id, 'Boss', 'boss@company.com', '08123456789'),
  (user_id, 'Client', 'client@example.com', '08987654321'),
  (user_id, 'HR Dept', 'hr@company.com', '0215555555');

  RAISE NOTICE 'Data dummy berhasil ditambahkan untuk %', target_email;

END $$;
