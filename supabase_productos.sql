-- Ejecuta esto en el SQL Editor de Supabase
create table public.products (
  id uuid default gen_random_uuid() primary key,
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  price numeric not null,
  stock integer default 0,
  image_url text, -- Por ahora usaremos URLs, luego podemos integrar Supabase Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- Los dueños pueden hacer todo (crear, editar, borrar) con sus propios productos
create policy "Dueños gestionan sus productos" on products for all using (
  store_id in (select id from stores where owner_id = auth.uid())
);

-- Todo el mundo puede ver los productos
create policy "Público ve productos" on products for select using (true);
