-- ========================================================
-- ĐỒ ÁN CHUYÊN NGÀNH: XÂY DỰNG WEB GAME MINESWEEPER ĐA CHẾ ĐỘ
-- VÀ HỆ THỐNG QUẢN TRỊ BẰNG LARAVEL
-- Sinh viên thực hiện:
--   1. Nguyễn Phan Thiên Phước - MSSV: 25002451 (Lớp: 25C2-LTM1)
--   2. Tô Nguyễn Hoàng An      - MSSV: 25002441 (Lớp: 25C2-LTM1)
-- Giảng viên hướng dẫn: Mai Chiếm Tuấn
-- Trường Cao đẳng Lý Tự Trọng TP.HCM - Khoa Công nghệ Thông tin
-- ========================================================

CREATE DATABASE IF NOT EXISTS `minefield` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `minefield`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user_skins`;
DROP TABLE IF EXISTS `records`;
DROP TABLE IF EXISTS `games`;
DROP TABLE IF EXISTS `difficulties`;
DROP TABLE IF EXISTS `game_modes`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `failed_jobs`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. BẢNG users: Quản lý thông tin tài khoản & kinh tế xu
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL UNIQUE,
  `display_name` VARCHAR(24) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `is_locked` TINYINT(1) NOT NULL DEFAULT 0,
  `coins` INT UNSIGNED NOT NULL DEFAULT 0,
  `equipped_board_skin` VARCHAR(50) NOT NULL DEFAULT 'classic',
  `equipped_flag_skin` VARCHAR(50) NOT NULL DEFAULT 'classic',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. BẢNG password_reset_tokens: Token khôi phục mật khẩu
-- --------------------------------------------------------
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. BẢNG sessions: Quản lý phiên đăng nhập & session khách
-- --------------------------------------------------------
CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` TEXT NULL DEFAULT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. BẢNG game_modes: Danh mục 3 quy tắc dò mìn
-- --------------------------------------------------------
CREATE TABLE `game_modes` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `neighbor_offsets` JSON NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. BẢNG difficulties: Cấu hình 3 cấp độ kích thước bàn & mìn
-- --------------------------------------------------------
CREATE TABLE `difficulties` (
  `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL,
  `board_rows` TINYINT UNSIGNED NOT NULL,
  `board_cols` TINYINT UNSIGNED NOT NULL,
  `mine_count` SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `ck_difficulties_mines` CHECK (`mine_count` >= 1 AND `mine_count` < `board_rows` * `board_cols`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. BẢNG games: Lịch sử ván đấu & token xác thực mili-giây
-- --------------------------------------------------------
CREATE TABLE `games` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `token` CHAR(36) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `mode_id` TINYINT UNSIGNED NOT NULL,
  `difficulty_id` TINYINT UNSIGNED NOT NULL,
  `status` ENUM('playing', 'won', 'lost', 'rejected') NOT NULL DEFAULT 'playing',
  `started_at` DATETIME(3) NOT NULL,
  `finished_at` DATETIME(3) NULL DEFAULT NULL,
  `time_ms` INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `games_user_id_started_at_index` (`user_id`, `started_at`),
  KEY `games_mode_id_difficulty_id_index` (`mode_id`, `difficulty_id`),
  CONSTRAINT `fk_games_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_games_mode` FOREIGN KEY (`mode_id`) REFERENCES `game_modes` (`id`),
  CONSTRAINT `fk_games_difficulty` FOREIGN KEY (`difficulty_id`) REFERENCES `difficulties` (`id`),
  CONSTRAINT `ck_games_won_has_time` CHECK (`status` <> 'won' OR `time_ms` IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. BẢNG records: Bảng xếp hạng kỷ lục cá nhân tốt nhất
-- --------------------------------------------------------
CREATE TABLE `records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `mode_id` TINYINT UNSIGNED NOT NULL,
  `difficulty_id` TINYINT UNSIGNED NOT NULL,
  `game_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `best_time_ms` INT UNSIGNED NOT NULL,
  `achieved_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `records_user_mode_diff_unique` (`user_id`, `mode_id`, `difficulty_id`),
  KEY `records_leaderboard_idx` (`mode_id`, `difficulty_id`, `best_time_ms`, `achieved_at`),
  CONSTRAINT `fk_records_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_records_mode` FOREIGN KEY (`mode_id`) REFERENCES `game_modes` (`id`),
  CONSTRAINT `fk_records_difficulty` FOREIGN KEY (`difficulty_id`) REFERENCES `difficulties` (`id`),
  CONSTRAINT `fk_records_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. BẢNG user_skins: Quyền sở hữu trang phục skin bàn/cờ
-- --------------------------------------------------------
CREATE TABLE `user_skins` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `skin_id` VARCHAR(50) NOT NULL,
  `skin_type` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_skins_user_skin_unique` (`user_id`, `skin_id`),
  KEY `user_skins_user_type_index` (`user_id`, `skin_type`),
  CONSTRAINT `fk_user_skins_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. DỮ LIỆU KHỞI TẠO (SEED DATA)
-- --------------------------------------------------------
INSERT INTO `game_modes` (`id`, `code`, `name`, `description`, `neighbor_offsets`) VALUES
(1, 'classic', 'Cổ điển', 'Tất cả 8 ô xung quanh', '[[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]'),
(2, 'plus', 'Dấu cộng', '4 ô kề cạnh (ngang & dọc)', '[[-1, 0], [0, -1], [0, 1], [1, 0]]'),
(3, 'corner', 'Góc chéo', '4 ô góc chéo', '[[-1, -1], [-1, 1], [1, -1], [1, 1]]');

INSERT INTO `difficulties` (`id`, `code`, `name`, `board_rows`, `board_cols`, `mine_count`) VALUES
(1, 'easy', 'Dễ', 9, 9, 10),
(2, 'medium', 'Trung bình', 12, 12, 22),
(3, 'hard', 'Khó', 16, 16, 40);

-- Tài khoản Quản trị viên mặc định: Admin / MatKhauBaoMatCuaBan123!
INSERT INTO `users` (`id`, `username`, `display_name`, `password`, `role`, `is_locked`, `coins`, `equipped_board_skin`, `equipped_flag_skin`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Quản trị viên', '$2y$12$e6mO3g184Wd.3kZ8fV.l5.122X8tD3nCgU7nCjJmO1B9rS0Wv7mKy', 'admin', 0, 999999, 'classic', 'classic', NOW(), NOW());
