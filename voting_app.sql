-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2025 at 10:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `voting_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `nin` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `nin`, `email`, `password`, `created_at`) VALUES
(1, '123', 'admin@blockearth.cgov', '$2y$10$A3/wfa9SZoUEqrShf99C/usonNGA4DNt6ZaxyjuXLnLKJpcGjTEY2', '2025-07-07 00:53:56');

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `action_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `votes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `election_id`, `name`, `votes`, `created_at`) VALUES
(111, 1, 'Alice Johnson', 1, '2025-07-07 01:25:48'),
(112, 1, 'Bob Smith', 0, '2025-07-07 01:25:48'),
(113, 1, 'Carol Lee', 0, '2025-07-07 01:25:48'),
(114, 1, 'David Kim', 0, '2025-07-07 01:25:48'),
(115, 2, 'Ethan Brown', 1, '2025-07-07 01:25:48'),
(116, 2, 'Fiona White', 0, '2025-07-07 01:25:48'),
(117, 2, 'George Miller', 0, '2025-07-07 01:25:48'),
(118, 2, 'Hannah Davis', 0, '2025-07-07 01:25:48'),
(119, 3, 'Ian Black', 0, '2025-07-07 01:25:48'),
(120, 3, 'Jenny Wilson', 0, '2025-07-07 01:25:48'),
(121, 3, 'Kevin Green', 0, '2025-07-07 01:25:48'),
(122, 3, 'Laura Martinez', 0, '2025-07-07 01:25:48'),
(123, 4, 'Michael Stone', 0, '2025-07-10 09:00:00'),
(124, 4, 'Natalie Brooks', 0, '2025-07-10 09:00:00'),
(125, 4, 'Oliver Scott', 0, '2025-07-10 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `elections`
--

CREATE TABLE `elections` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `elections`
--

INSERT INTO `elections` (`id`, `title`, `description`, `start_date`, `end_date`, `created_at`) VALUES
(1, 'Governor Election', 'Choose your state governor.', '2025-07-07 00:00:00', '2025-12-07 23:59:59', '2025-07-07 01:12:56'),
(2, 'Parliamentary Election', 'Elect members of parliament.', '2025-07-07 00:00:00', '2025-12-07 23:59:59', '2025-07-07 01:12:56'),
(3, 'Mayor Election', 'Elect your city mayor.', '2025-07-07 00:00:00', '2025-12-07 23:59:59', '2025-07-07 01:12:56'),
(4, 'Student Union Election', 'Vote for your Jury.', '2025-07-15 00:00:00', '2025-07-16 23:59:59', '2025-07-10 09:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `nins`
--

CREATE TABLE `nins` (
  `id` int(11) NOT NULL,
  `nin` varchar(10) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0
) ;

--
-- Dumping data for table `nins`
--

INSERT INTO `nins` (`id`, `nin`, `email`, `used`) VALUES
(2, '456', 'user2@domain.cgov', 1),
(3, '789', 'user3@domain.cgov', 1),
(4, '999', 'admin@domain.cgov', 0),
(5, '123', 'admin@blockearth.cgov', 1),
(6, '111', 'user4@domain.cgov', 1),
(7, '222', 'user5@domain.cgov', 1),
(8, '333', 'user6@domain.cgov', 0),
(9, '444', 'user7@domain.cgov', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('voter','admin') NOT NULL DEFAULT 'voter',
  `has_voted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `has_voted`, `created_at`) VALUES
(2, 'user1@domain.cgov', '$2y$10$how5px92fcgYjCQUHEdXmue9kS0wW.8Un85fBHgF1CrE.qouOQrPm', 'voter', 0, '2025-07-05 13:13:31'),
(3, 'user2@domain.cgov', '$2y$10$mDMI6JuxodS79cwMxerwtuAYHSjc0GWy9Jg66QWG.eNJ24wvqP9ji', 'voter', 0, '2025-07-05 13:42:29'),
(4, 'user3@domain.cgov', '$2y$10$lh90uvqUlazkej6S/NaXAO5aJinWz45WfAE30Ut5eSKrVWETMDlXi', 'voter', 1, '2025-07-05 15:32:29'),
(5, 'admin@domain.cgov', '$2y$10$5WY69aX6/oarrxSeJoAEnuuVBV12lTYdGayZt1c6LPypq.ems4SPC', 'admin', 0, '2025-07-05 21:16:15'),
(6, 'admin@blockearth.cgov', '$2y$10$39aXtq1Qjk8rz1I.trcldu4XweHysFq875G6YiusR2TM3MgD9i/sC', 'voter', 0, '2025-07-06 09:29:55'),
(7, 'user4@domain.cgov', '$2y$10$Tqu6gjV9Y3I6u9Ens8JBReAtMDRrjLEN2wj5ccCPPVGd7KbMFGT.G', 'voter', 0, '2025-07-07 00:42:24'),
(8, 'user7@domain.cgov', '$2y$10$ejRKypqPPWlldmCe3Opvsu8YCGHEV7UeTywWEM/FkfCLpe9nz.3X.', 'voter', 0, '2025-07-11 21:08:49'),
(9, 'user5@domain.cgov', '$2y$10$qEtgu/CNxQ7NyFBEpNn3Ruuf.HvSuacdtyyp1nmktzp0hSO4rZPXG', 'voter', 0, '2025-07-12 08:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `user_id`, `election_id`, `candidate_id`, `created_at`) VALUES
(2, 7, 1, 111, '2025-07-07 01:26:02'),
(3, 8, 2, 115, '2025-07-12 08:47:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `election_id` (`election_id`);

--
-- Indexes for table `elections`
--
ALTER TABLE `elections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nins`
--
ALTER TABLE `nins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nin` (`nin`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `elections`
--
ALTER TABLE `elections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `nins`
--
ALTER TABLE `nins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`election_id`) REFERENCES `elections` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
