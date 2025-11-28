-- Allow users to view other users' basic info (needed for sending emails)
create policy "Users can view all users basic info" on public.users
  for select using (true);

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, phone)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
