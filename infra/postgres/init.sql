-- Create Databases
CREATE DATABASE user_db;
CREATE DATABASE content_db;
CREATE DATABASE moderation_db;

-- Connect to user_db and create users table
\c user_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connect to content_db and create submissions table
\c content_db;

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  author_id VARCHAR(50),
  media_url TEXT,
  exif_metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connect to moderation_db and create votes table
\c moderation_db;

CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  submission_id VARCHAR(50) NOT NULL,
  voter_id VARCHAR(50) NOT NULL,
  vote_value INTEGER NOT NULL,
  comment TEXT,
  moderation_status VARCHAR(50) DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
