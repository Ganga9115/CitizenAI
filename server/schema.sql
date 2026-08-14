-- ====================================================
-- AI-POWERED CITIZEN CALL INTELLIGENCE PLATFORM
-- DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('CITIZEN', 'OFFICER', 'ADMIN')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(20) UNIQUE NOT NULL,
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    audio_duration INTEGER DEFAULT 0,
    transcript TEXT NOT NULL,
    summary TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Emergency', 'High', 'Medium', 'Low')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    department_name VARCHAR(100) NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('Positive', 'Neutral', 'Negative', 'Highly Critical')),
    emotion VARCHAR(50),
    confidence NUMERIC(5, 2) DEFAULT 0.0,
    urgency VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected')),
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location TEXT,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    duplicate_probability NUMERIC(5, 2) DEFAULT 0.0,
    possible_duplicate_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
    suggested_action TEXT,
    keywords TEXT[],
    estimated_resolution VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. INTERNAL COMPLAINT NOTES TABLE
CREATE TABLE IF NOT EXISTS complaint_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) CHECK (type IN ('COMPLAINT_CREATED', 'STATUS_UPDATED', 'EMERGENCY_ALERT', 'ASSIGNED')),
    is_read BOOLEAN DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ACTIVITY LOGS / AUDIT TRAIL TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DEPARTMENTS IF EMPTY
INSERT INTO departments (name, code, description, contact_email) VALUES
('Water Board', 'WATER', 'Manages public water supply, pipe repairs, and water quality.', 'water@citygov.org'),
('Electricity Board', 'ELEC', 'Manages power lines, transformers, outages, and street lights.', 'elec@citygov.org'),
('Municipality', 'MUNI', 'Manages sanitation, garbage disposal, parks, and general municipal issues.', 'muni@citygov.org'),
('Police', 'POLICE', 'Public safety, noise complaints, law enforcement, and traffic.', 'police@citygov.org'),
('Fire Department', 'FIRE', 'Fire hazards, emergency rescues, and disaster management.', 'fire@citygov.org'),
('Health Department', 'HEALTH', 'Public healthcare, mosquito control, disease outbreak alerts.', 'health@citygov.org'),
('Public Works', 'PWD', 'Road repairs, drainage systems, construction, and bridge maintenance.', 'pwd@citygov.org'),
('Transport Department', 'TRANS', 'Public transit, bus stop maintenance, and traffic signals.', 'transport@citygov.org'),
('Revenue Department', 'REV', 'Property taxes, land records, and civic revenue matters.', 'revenue@citygov.org')
ON CONFLICT (code) DO NOTHING;

-- INDEXES FOR MAXIMUM SPEED
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);
