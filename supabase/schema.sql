-- =========================================================
-- Preferia Fusión 2026 — Schema completo
-- Pegar en: Supabase Dashboard > SQL Editor > New query
-- =========================================================

-- ─── Enums ───────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'user');
CREATE TYPE payment_status_enum AS ENUM ('sin_confirmar', 'pago_enviado', 'confirmado');

-- ─── Tablas ──────────────────────────────────────────────

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attendance (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  payment_status       payment_status_enum NOT NULL DEFAULT 'sin_confirmar',
  payment_confirmed_at TIMESTAMPTZ,
  confirmed_by         UUID REFERENCES profiles(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE TABLE drinks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE user_drink_preferences (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  drink_id   UUID NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  percentage INT NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, drink_id)
);

CREATE TABLE playlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spotify_url TEXT NOT NULL,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE norms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon       TEXT NOT NULL,
  text       TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE event_settings (
  id            INT PRIMARY KEY DEFAULT 1,
  bizum_number  TEXT NOT NULL DEFAULT '',
  bizum_holder  TEXT NOT NULL DEFAULT '',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Seed ────────────────────────────────────────────────

INSERT INTO drinks (name, emoji, sort_order) VALUES
  ('Rebujito',        '🥂', 1),
  ('Cerveza',         '🍺', 2),
  ('Cerveza 0.0',     '🫙', 3),
  ('Tinto de verano', '🍷', 4),
  ('Coca-Cola',       '🥤', 5),
  ('Fanta Naranja',   '🍊', 6),
  ('Nestea',          '🧊', 7),
  ('Aquarius',        '💧', 8);

INSERT INTO norms (icon, text, sort_order) VALUES
  ('🚫', 'Sin dramas. Aquí venimos a pasarlo bien.',          1),
  ('💧', 'Hidratación obligatoria. El sol de Sevilla no perdona.', 2),
  ('🏊', 'Piscina bajo tu responsabilidad.',                  3),
  ('🎵', 'Si suena tu canción, invitas una ronda.',           4),
  ('🔥', 'Respeto absoluto al parrillero.',                   5);

INSERT INTO event_settings (id, bizum_number, bizum_holder)
  VALUES (1, '', '');

-- ─── Trigger: auto-crear perfil al registrarse ───────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    CASE
      WHEN NEW.email = 'victor@fusionstartups.com' THEN 'superadmin'::user_role
      ELSE 'user'::user_role
    END
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ─── Trigger: auto-crear fila attendance al crear perfil ─

CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO attendance (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_new_profile();

-- ─── Trigger: límite 3 canciones por usuario ─────────────

CREATE OR REPLACE FUNCTION check_playlist_limit()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT COUNT(*) FROM playlist WHERE user_id = NEW.user_id) >= 3 THEN
    RAISE EXCEPTION 'Máximo 3 canciones por usuario';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_playlist_limit
  BEFORE INSERT ON playlist
  FOR EACH ROW EXECUTE FUNCTION check_playlist_limit();

-- ─── Vista para gráfico de bebidas (admin) ───────────────

CREATE OR REPLACE VIEW drink_totals AS
SELECT
  d.id,
  d.name,
  d.emoji,
  d.sort_order,
  COALESCE(ROUND(AVG(udp.percentage)::NUMERIC, 1), 0) AS avg_percentage,
  COUNT(udp.id) AS voter_count
FROM drinks d
LEFT JOIN user_drink_preferences udp ON d.id = udp.drink_id
WHERE d.active = TRUE
GROUP BY d.id, d.name, d.emoji, d.sort_order
ORDER BY d.sort_order;

-- ─── RLS ─────────────────────────────────────────────────

ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance             ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_drink_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist               ENABLE ROW LEVEL SECURITY;
ALTER TABLE norms                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE drinks                 ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "users_insert_own_profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_read_own_profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admins_read_all_profiles"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

CREATE POLICY "admins_update_all_profiles"
  ON profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- attendance
CREATE POLICY "users_own_attendance"
  ON attendance FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admins_all_attendance"
  ON attendance FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- drinks (lectura pública para autenticados)
CREATE POLICY "authenticated_read_drinks"
  ON drinks FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admins_manage_drinks"
  ON drinks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- user_drink_preferences
CREATE POLICY "users_own_prefs"
  ON user_drink_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admins_read_prefs"
  ON user_drink_preferences FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- playlist
CREATE POLICY "authenticated_read_playlist"
  ON playlist FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_insert_own_playlist"
  ON playlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_playlist"
  ON playlist FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "admins_manage_playlist"
  ON playlist FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- norms
CREATE POLICY "authenticated_read_norms"
  ON norms FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admins_manage_norms"
  ON norms FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- event_settings
CREATE POLICY "admins_read_settings"
  ON event_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

CREATE POLICY "superadmin_write_settings"
  ON event_settings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'superadmin'
  ));
