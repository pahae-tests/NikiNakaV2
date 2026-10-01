CREATE DATABASE IF NOT EXISTS football6_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE football6_manager;

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  shirt_number INT NOT NULL,
  image LONGTEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_players_active_number (is_active, shirt_number)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opponent_name VARCHAR(160) NOT NULL,
  date DATETIME NOT NULL,
  team_score INT UNSIGNED NOT NULL,
  opponent_score INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS match_players (
  match_id INT NOT NULL,
  player_id INT NOT NULL,
  name_snapshot VARCHAR(120) NOT NULL,
  shirt_number_snapshot INT NOT NULL,
  image_snapshot LONGTEXT NULL,
  position VARCHAR(3) NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  PRIMARY KEY (match_id, player_id),
  CONSTRAINT fk_mp_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT fk_mp_player FOREIGN KEY (player_id) REFERENCES players(id),
  INDEX idx_mp_player (player_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id INT NOT NULL,
  scorer_id INT NOT NULL,
  assist_id INT NULL,
  goal_order INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_goal_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT fk_goal_scorer FOREIGN KEY (scorer_id) REFERENCES players(id),
  CONSTRAINT fk_goal_assist FOREIGN KEY (assist_id) REFERENCES players(id),
  UNIQUE KEY uq_goal_order (match_id, goal_order),
  INDEX idx_goal_scorer (scorer_id),
  INDEX idx_goal_assist (assist_id)
) ENGINE=InnoDB;