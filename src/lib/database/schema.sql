-- Database schema for Nightreign Seed Finder

-- User sessions table for tracking active users
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Search logs table for analytics
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES user_sessions(session_id),
  action TEXT NOT NULL, -- 'seed_found', 'search_performed', 'error_occurred'
  map_type TEXT,
  seed_id TEXT,
  search_criteria JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  response_time_ms INTEGER,
  status_code INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_search_logs_session_id ON search_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_timestamp ON search_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_endpoint ON performance_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Bug report submissions
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NULL,
  email TEXT NULL,
  subject TEXT NULL,
  message TEXT NOT NULL,
  user_url TEXT NULL,
  user_agent TEXT NULL,
  client_ip INET NULL,
  is_suspected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraints to mirror application-level limits
ALTER TABLE bug_reports
  ADD CONSTRAINT chk_bug_reports_name_length CHECK (name IS NULL OR CHAR_LENGTH(name) <= 50),
  ADD CONSTRAINT chk_bug_reports_email_length CHECK (email IS NULL OR CHAR_LENGTH(email) <= 50),
  ADD CONSTRAINT chk_bug_reports_subject_length CHECK (subject IS NULL OR CHAR_LENGTH(subject) <= 100),
  ADD CONSTRAINT chk_bug_reports_message_length CHECK (CHAR_LENGTH(message) >= 1 AND CHAR_LENGTH(message) <= 1000),
  ADD CONSTRAINT chk_bug_reports_user_url_length CHECK (user_url IS NULL OR CHAR_LENGTH(user_url) <= 2048);

CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports (created_at DESC);