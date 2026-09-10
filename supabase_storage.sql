-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Agregar la columna logo_url a la tabla stores
alter table public.stores add column if not exists logo_url text;

-- 2. Crear un bucket público para subir imágenes (logos y productos)
insert into storage.buckets (id, name, public) 
values ('tiendas', 'tiendas', true)
on conflict (id) do nothing;

-- 3. Políticas de seguridad para el Storage
-- Cualquier persona puede ver las imágenes (Público)
create policy "Imágenes públicas" on storage.objects for select using ( bucket_id = 'tiendas' );

-- Solo los usuarios logueados pueden subir imágenes
create policy "Usuarios suben imágenes" on storage.objects for insert with check ( bucket_id = 'tiendas' AND auth.role() = 'authenticated' );

-- Los dueños pueden borrar sus propias imágenes
create policy "Usuarios borran imágenes" on storage.objects for delete using ( bucket_id = 'tiendas' AND auth.role() = 'authenticated' );
