-- ============================================
-- TÍCH CÔNG ĐỨC - SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extended user profile (linked to auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    dharma_name TEXT NOT NULL,
    avatar_emoji TEXT DEFAULT '🙏',
    avatar_color TEXT DEFAULT 'bg-amber-100',
    total_merits INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_session_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles (for leaderboard)
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- MERIT_LOGS TABLE
-- Track each merit earned with timestamp
-- ============================================
CREATE TABLE public.merit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID, -- Reference to meditation session
    merits_earned INTEGER NOT NULL DEFAULT 1,
    duration_seconds INTEGER, -- How long they prayed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.merit_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can read all merit logs (for transparency)
CREATE POLICY "Merit logs are viewable by everyone"
    ON public.merit_logs FOR SELECT
    USING (true);

-- Users can insert their own merit logs (via app)
CREATE POLICY "Users can insert own merit logs"
    ON public.merit_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- MEDITATION_SESSIONS TABLE
-- Track meditation sessions
-- ============================================
CREATE TABLE public.meditation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    merits_earned INTEGER DEFAULT 0,
    prayers_completed INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Users can read their own sessions
CREATE POLICY "Users can read own sessions"
    ON public.meditation_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
    ON public.meditation_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
    ON public.meditation_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, dharma_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'dharma_name', 'Tân Viên') -- Default dharma name
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update merit count and streak
CREATE OR REPLACE FUNCTION public.add_merit(
    p_user_id UUID,
    p_merits INTEGER DEFAULT 1,
    p_duration INTEGER DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_yesterday DATE;
    v_today DATE;
    v_last_session DATE;
    v_current_streak INTEGER;
BEGIN
    v_yesterday := CURRENT_DATE - INTERVAL '1 day';
    v_today := CURRENT_DATE;
    
    -- Update total merits
    UPDATE public.profiles
    SET total_merits = total_merits + p_merits,
        total_sessions = total_sessions + 1,
        last_session_at = NOW(),
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Update streak
    SELECT last_session_at::date INTO v_last_session
    FROM public.profiles
    WHERE id = p_user_id;
    
    IF v_last_session IS NULL THEN
        -- First session ever
        UPDATE public.profiles SET current_streak = 1 WHERE id = p_user_id;
    ELSIF v_last_session = v_yesterday THEN
        -- Consecutive day
        UPDATE public.profiles
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1)
        WHERE id = p_user_id;
    ELSIF v_last_session = v_today THEN
        -- Same day, don't change streak
        NULL;
    ELSE
        -- Streak broken
        UPDATE public.profiles SET current_streak = 1 WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEWS
-- ============================================

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
    ROW_NUMBER() OVER (ORDER BY total_merits DESC, longest_streak DESC) AS rank,
    id,
    dharma_name,
    avatar_emoji,
    avatar_color,
    total_merits,
    current_streak,
    longest_streak,
    total_sessions,
    joined_at
FROM public.profiles
ORDER BY total_merits DESC, longest_streak DESC;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_merit_logs_user_id ON public.merit_logs(user_id);
CREATE INDEX idx_merit_logs_created_at ON public.merit_logs(created_at DESC);
CREATE INDEX idx_meditation_sessions_user_id ON public.meditation_sessions(user_id);
CREATE INDEX idx_profiles_total_merits ON public.profiles(total_merits DESC);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- Uncomment to add mock data
-- ============================================
/*
INSERT INTO public.profiles (id, email, dharma_name, total_merits, current_streak, longest_streak, total_sessions)
VALUES
    (uuid_generate_v4(), 'minhtam@email.com', 'Minh Tâm', 12580, 156, 200, 890),
    (uuid_generate_v4(), 'tinhthan@email.com', 'Tịnh Thân', 8430, 89, 120, 567),
    (uuid_generate_v4(), 'huongnghiem@email.com', 'Hương Niệm', 6200, 45, 78, 412),
    (uuid_generate_v4(), 'phatnguyen@email.com', 'Phật Nguyên', 4890, 23, 56, 334),
    (uuid_generate_v4(), 'thanhtam@email.com', 'Thanh Tâm', 3650, 12, 45, 256);
*/
