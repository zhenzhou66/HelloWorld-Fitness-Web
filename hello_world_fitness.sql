-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 06, 2025 at 02:39 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hello_world_fitness`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance_classes`
--

CREATE TABLE `attendance_classes` (
  `class_attendance_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `attendance_time` datetime NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance_classes`
--

INSERT INTO `attendance_classes` (`class_attendance_id`, `user_id`, `class_id`, `attendance_time`, `status`) VALUES
(1, 2, 1, '2025-01-10 08:15:00', 'Present'),
(2, 4, 2, '2025-01-11 09:30:00', 'Present'),
(3, 9, 3, '2025-01-12 10:45:00', 'Absent'),
(4, 7, 4, '2025-01-13 08:00:00', 'Present');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_code`
--

CREATE TABLE `attendance_code` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `available_from` datetime DEFAULT NULL,
  `available_until` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_gym`
--

CREATE TABLE `attendance_gym` (
  `gym_attendance_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `check_in_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendance_gym`
--

INSERT INTO `attendance_gym` (`gym_attendance_id`, `user_id`, `check_in_time`) VALUES
(1, 2, '2025-01-10 08:00:00'),
(2, 4, '2025-01-11 09:15:00'),
(3, 7, '2025-01-12 10:30:00'),
(4, 7, '2025-01-13 07:45:00'),
(5, 9, '2025-01-14 06:30:00'),
(6, 10, '2025-01-15 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `badge`
--

CREATE TABLE `badge` (
  `badge_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `max_participants` int(11) NOT NULL,
  `schedule_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `trainer_id` int(11) NOT NULL,
  `class_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`class_id`, `class_name`, `description`, `max_participants`, `schedule_date`, `start_time`, `end_time`, `trainer_id`, `class_image`) VALUES
(1, 'Yoga Flow', 'A relaxing yoga session focused on flexibility and mindfulness.', 20, '2025-01-20', '08:00:00', '09:00:00', 1, 'class_image/1.jpg'),
(2, 'Zumba Dance', 'High-energy dance workout to improve cardiovascular fitness.', 25, '2025-01-20', '10:00:00', '11:00:00', 5, 'class_image/2.jpeg'),
(3, 'Strength Training', 'Build muscle strength through resistance training and weightlifting.', 15, '2025-01-21', '15:00:00', '16:30:00', 8, 'class_image/3.webp'),
(4, 'Cardio Blast', 'A dynamic cardio session to burn calories and boost endurance.', 20, '2025-01-21', '18:00:00', '19:00:00', 5, 'class_image/4.jpg'),
(5, 'Pilates Core', 'Focused on improving core strength, posture, and flexibility using Pilates.', 18, '2025-01-22', '07:30:00', '08:30:00', 8, 'class_image/5.jpg'),
(6, 'Functional Fitness', 'Improve everyday movements through functional strength and agility exercises.', 15, '2025-01-22', '17:00:00', '18:30:00', 1, 'class_image/6.jpg'),
(7, 'HIIT', 'High-Intensity Interval Training session for maximum calorie burn in less time.', 20, '2025-01-23', '06:00:00', '06:45:00', 1, 'class_image/7.jpg'),
(8, 'Boxing Basics', 'A beginner-friendly boxing class focusing on technique and fitness.', 12, '2025-01-23', '19:00:00', '20:00:00', 1, 'class_image/8.webp');

-- --------------------------------------------------------

--
-- Table structure for table `class_participants`
--

CREATE TABLE `class_participants` (
  `participant_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class_participants`
--

INSERT INTO `class_participants` (`participant_id`, `class_id`, `user_id`) VALUES
(1, 8, 2),
(2, 8, 9),
(3, 4, 4),
(4, 6, 9),
(5, 7, 4);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `trainer_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `feedback_date` date NOT NULL,
  `trainer_rating` int(11) DEFAULT NULL,
  `class_rating` int(11) DEFAULT NULL,
  `comments` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `member_id`, `trainer_id`, `class_id`, `feedback_date`, `trainer_rating`, `class_rating`, `comments`) VALUES
(1, 2, 1, 1, '2025-03-10', 5, 4, 'The trainer was very motivating and gave clear instructions. The class was a bit crowded, though.'),
(2, 4, 5, 2, '2025-03-11', 4, 5, 'Excellent class and trainer. The zumba session was well-paced and exciting.'),
(3, 10, 1, 3, '2025-03-12', 3, 4, 'Trainer was helpful, but the class started late.');

-- --------------------------------------------------------

--
-- Table structure for table `meal`
--

CREATE TABLE `meal` (
  `meal_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `calories` int(11) NOT NULL,
  `carbs` decimal(5,2) NOT NULL,
  `protein` decimal(5,2) NOT NULL,
  `fat` decimal(5,2) NOT NULL,
  `serving_size` varchar(255) NOT NULL,
  `meal_pictures` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `meal`
--

INSERT INTO `meal` (`meal_id`, `name`, `calories`, `carbs`, `protein`, `fat`, `serving_size`, `meal_pictures`) VALUES
(1, 'Grilled Chicken Salad', 350, '10.00', '30.00', '20.00', '1 bowl', 'meal_pictures/1.jpg'),
(2, 'Spaghetti Bolognese', 600, '75.00', '20.00', '25.00', '1 plate', 'meal_pictures/2.jpg'),
(3, 'Vegetable Stir-Fry', 200, '35.00', '5.00', '5.00', '1 cup', 'meal_pictures/3.jpg'),
(4, 'Beef Steak', 679, '0.00', '62.00', '48.00', '1 steak (291g)', 'meal_pictures/4.webp'),
(5, 'Quinoa Salad', 222, '34.00', '8.00', '7.00', '1 cup', 'meal_pictures/5.jpg'),
(6, 'Grilled Salmon', 367, '0.00', '34.00', '23.00', '1 fillet (198g)', 'meal_pictures/6.jpg'),
(7, 'Oatmeal with Fruits', 290, '55.00', '6.00', '4.00', '1 cup', 'meal_pictures/7.jpg'),
(8, 'Chicken Wrap', 430, '45.00', '30.00', '15.00', '1 wrap', 'meal_pictures/8.jpg'),
(9, 'Tofu Stir-Fry', 190, '14.00', '12.00', '11.00', '1 cup', 'meal_pictures/9.jpeg'),
(10, 'Turkey Sandwich', 360, '30.00', '25.00', '18.00', '1 sandwich', 'meal_pictures/10.jpg'),
(11, 'Egg Salad', 220, '2.00', '10.00', '20.00', '1/2 cup', 'meal_pictures/11.webp'),
(12, 'Grilled Vegetables', 100, '20.00', '3.00', '1.00', '1 cup', 'meal_pictures/12.jpg'),
(13, 'Beef Tacos', 500, '50.00', '25.00', '25.00', '2 tacos', 'meal_pictures/13.jpg'),
(14, 'Fruit Smoothie', 250, '60.00', '2.00', '1.00', '1 glass', 'meal_pictures/14.jpg'),
(15, 'Shrimp Pasta', 450, '60.00', '30.00', '10.00', '1 plate', 'meal_pictures/15.jpg'),
(16, 'Vegetable Soup', 150, '20.00', '5.00', '5.00', '1 bowl', 'meal_pictures/16.jpg'),
(17, 'Baked Chicken Breast', 220, '0.00', '43.00', '5.00', '1 breast (174g)', 'meal_pictures/17.jpg'),
(18, 'Avocado Toast', 240, '28.00', '6.00', '12.00', '1 slice', 'meal_pictures/18.jpg'),
(19, 'Fish Curry with Rice', 500, '60.00', '30.00', '15.00', '1 plate', 'meal_pictures/19.jpg'),
(20, 'Grilled Pork Chops', 290, '0.00', '30.00', '19.00', '1 chop (145g)', 'meal_pictures/20.jpg'),
(21, 'Veggie Burger', 365, '40.00', '21.00', '15.00', '1 burger', 'meal_pictures/21.jpg'),
(22, 'Caesar Salad', 330, '10.00', '7.00', '28.00', '1 bowl', 'meal_pictures/22.jpg'),
(23, 'Chicken Curry', 300, '10.00', '25.00', '20.00', '1 cup', 'meal_pictures/23.jpg'),
(24, 'Steamed Broccoli', 55, '11.00', '4.00', '0.50', '1 cup', 'meal_pictures/24.webp'),
(25, 'Brown Rice Bowl', 215, '45.00', '5.00', '1.50', '1 cup', 'meal_pictures/25.jpg'),
(26, 'Greek Yogurt with Honey', 180, '22.00', '10.00', '5.00', '1 cup', 'meal_pictures/26.jpg'),
(27, 'Grilled Shrimp Skewers', 150, '0.00', '28.00', '3.00', '3 oz', 'meal_pictures/27.jpg'),
(28, 'Vegetable Curry', 200, '20.00', '5.00', '10.00', '1 cup', 'meal_pictures/28.jpg'),
(29, 'BBQ Chicken Pizza', 300, '34.00', '15.00', '12.00', '1 slice', 'meal_pictures/29.jpg'),
(30, 'Lentil Soup', 180, '30.00', '12.00', '3.00', '1 cup', 'meal_pictures/30.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `membership_id` int(11) NOT NULL,
  `plan_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`membership_id`, `plan_name`, `description`, `price`, `duration`) VALUES
(1, 'Standard Monthly', 'Basic access to gym facilities, group classes, and locker rooms for one month.', '30.00', 1),
(2, 'Premium Monthly', 'Includes all Standard features, plus a dedicated personal trainer for personalized guidance.', '50.00', 1),
(3, 'Standard Yearly', 'Discounted annual plan with basic access to gym facilities, group classes, and locker rooms.', '300.00', 12),
(4, 'Premium Yearly', 'Includes all Standard Yearly features, plus a dedicated personal trainer for the entire year.', '500.00', 12);

-- --------------------------------------------------------

--
-- Table structure for table `member_performance_feedback`
--

CREATE TABLE `member_performance_feedback` (
  `progress_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `trainer_id` int(11) NOT NULL,
  `progress_date` date NOT NULL,
  `fitness_performance` text NOT NULL,
  `weak_areas` text NOT NULL,
  `trainer_feedback` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `member_performance_feedback`
--

INSERT INTO `member_performance_feedback` (`progress_id`, `member_id`, `trainer_id`, `progress_date`, `fitness_performance`, `weak_areas`, `trainer_feedback`) VALUES
(1, 2, 1, '2025-01-18', 'Increased bench press weight from 50kg to 60kg. Improved endurance during cardio sessions, maintaining heart rate in the optimal zone for 25 minutes.', 'Shoulder stabilization during overhead exercises and lower back flexibility need improvement.', 'Great progress! Focus on posture during lifts and add more stretching exercises for lower back flexibility.'),
(2, 4, 5, '2025-01-19', 'Improved running time on the treadmill, completing 5km in 28 minutes. Squat depth and form have improved with the current 70kg load.', 'Hamstring flexibility and balance on single-leg exercises require attention.', 'Keep up the effort! Incorporate more dynamic stretches before workouts and balance exercises to improve single-leg stability.');

-- --------------------------------------------------------

--
-- Table structure for table `member_trainer`
--

CREATE TABLE `member_trainer` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `trainer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `member_trainer`
--

INSERT INTO `member_trainer` (`id`, `member_id`, `trainer_id`) VALUES
(1, 2, 1),
(2, 4, 5),
(3, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `send_date` datetime NOT NULL,
  `target` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `title`, `message`, `type`, `send_date`, `target`, `user_id`, `class_id`, `end_date`) VALUES
(1, 'Class Schedule Update', 'The Zumba class on Friday has been rescheduled to 5:00 PM.', 'Announcement', '2025-01-14 10:00:00', 'General', NULL, 8, '2025-03-12'),
(2, 'Membership Renewal Reminder', 'Your membership is set to expire soon. Renew now to avoid interruptions.', 'Reminder', '2025-01-10 08:00:00', 'Member', NULL, NULL, NULL),
(3, 'Class Reminder', 'Don’t forget your Yoga class tomorrow at 8:00 AM.', 'Reminder', '2025-01-12 18:00:00', 'General', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `points`
--

CREATE TABLE `points` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `date_received` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(10) NOT NULL,
  `payment_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `description`, `amount`, `payment_status`, `payment_date`) VALUES
(1, 7, 'Standard Monthly - January 2025', '30.00', 'Paid', '2025-01-05'),
(2, 2, 'Premium Monthly - January 2025', '50.00', 'Paid', '2025-01-06'),
(3, 9, 'Standard Yearly - 2025', '300.00', 'Paid', '2025-01-07'),
(4, 4, 'Premium Yearly - 2025', '500.00', 'Paid', '2025-01-08');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `role` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `date_of_birth` date NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `height` decimal(5,1) NOT NULL,
  `weight` decimal(5,1) NOT NULL,
  `fitness_goals` text NOT NULL,
  `date_joined` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `role`, `name`, `gender`, `email`, `password`, `contact_number`, `date_of_birth`, `profile_picture`, `height`, `weight`, `fitness_goals`, `date_joined`) VALUES
(1, 'ali123', 'trainer', 'Ali', 'Male', 'ali@gmail.com', 'qwe', '012-3456999', '2005-02-12', 'profile_pictures/1.webp', '180.0', '70.0', 'Muscle Mass Gain', '2025-02-10'),
(2, 'sarahh', 'member', 'Sarah Jones', 'Female', 'sarah@hotmail.com', 'sa', '014-2312312', '2003-08-21', 'profile_pictures/2.jpg', '155.0', '50.0', 'Gain Weight', '2025-01-10'),
(3, 'admingod', 'admin', 'Guillaume Charnock', 'Male', 'gcharnock2@freewebs.com', '123', '+86 720 480 6295', '2024-02-09', 'profile_pictures/3.jpg', '102.4', '144.2', 'Lose Weight', '2025-01-10'),
(4, 'tgurry3', 'member', 'Tobias Gurry', 'Male', 'tgurry3@furl.net', 's1$fQg', '+62 531 921 9774', '2024-03-08', 'profile_pictures/4.webp', '116.8', '148.9', 'Shape Body', '2025-01-13'),
(5, 'jclick', 'trainer', 'Jena Click', 'Female', 'jclick4@addthis.com', '1823husad', '+62 274 401 4663', '2024-03-27', 'profile_pictures/5.jpg', '182.4', '92.9', 'Muscle Mass Gain', '2025-02-10'),
(6, 'msterman5', 'admin', 'Moises Sterman', 'Male', 'msterman5@wisc.edu', 'o2LMakpo', '+81 460 392 6175', '2024-08-11', 'profile_pictures/6.png', '151.5', '165.7', 'Loss Weight', '2025-01-11'),
(7, 'emalins6', 'member', 'Emmaline Malins', 'Female', 'emalins6@cbsnews.com', 'm3os8iN?}', '+52 497 559 5494', '2024-09-30', 'profile_pictures/7.jpg', '162.6', '143.9', 'Lose Weight', '2025-02-10'),
(8, 'skristoffersen7', 'trainer', 'Saundra Kristoffersen', 'Male', 'skristoffersen7@skyrock.com', 'g9Bvchb9', '+86 334 481 4896', '2024-09-07', 'profile_pictures/8.jpg', '129.3', '173.3', 'Lose Weight', '2025-02-10'),
(9, 'hlaba8', 'member', 'Harmonia Laba', 'Female', 'hlaba8@jiathis.com', 'u9HTJ', '+86 552 884 9707', '2024-08-10', 'profile_pictures/9.jpg', '158.5', '135.6', 'Shape Body', '2025-02-10'),
(10, 'hmackrell9', 'member', 'Hildegarde Mackrell', 'Female', 'hmackrell9@dailymail.co.uk', 'k6}b%C0UpE', '+1 141 678 0030', '2024-12-26', 'profile_pictures/10.jpg', '194.4', '123.1', 'Muscle Mass Gain', '2025-02-10');

-- --------------------------------------------------------

--
-- Table structure for table `user_badge`
--

CREATE TABLE `user_badge` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL,
  `earned_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_meal`
--

CREATE TABLE `user_meal` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL,
  `serving_count` decimal(5,2) NOT NULL,
  `meal_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_meal`
--

INSERT INTO `user_meal` (`id`, `user_id`, `meal_id`, `serving_count`, `meal_date`) VALUES
(1, 2, 1, '1.00', '2025-01-15'),
(2, 2, 5, '1.50', '2025-01-16'),
(3, 2, 8, '2.00', '2025-01-17'),
(4, 2, 14, '1.00', '2025-01-18'),
(5, 2, 20, '0.75', '2025-01-19');

-- --------------------------------------------------------

--
-- Table structure for table `user_membership`
--

CREATE TABLE `user_membership` (
  `user_membership_id` int(11) NOT NULL,
  `membership_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_membership`
--

INSERT INTO `user_membership` (`user_membership_id`, `membership_id`, `user_id`, `start_date`, `end_date`, `status`) VALUES
(1, 2, 2, '2025-01-18', '2025-02-19', 'Active'),
(2, 4, 4, '2025-01-18', '2026-01-18', 'Active'),
(3, 1, 7, '2025-01-21', '2025-02-22', 'Active'),
(4, 3, 9, '2024-12-01', '2025-12-01', 'Active'),
(5, 2, 10, '2025-01-02', '2025-02-03', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `user_workout_plans`
--

CREATE TABLE `user_workout_plans` (
  `user_workout_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `workout_plan_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `trainer_id` int(11) DEFAULT NULL,
  `day_of_week` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_workout_plans`
--

INSERT INTO `user_workout_plans` (`user_workout_id`, `user_id`, `workout_plan_id`, `is_active`, `trainer_id`, `day_of_week`) VALUES
(1, 2, 1, 1, 1, 'Monday'),
(2, 4, 2, 1, 5, 'Wednesday'),
(3, 7, 3, 1, NULL, 'Friday'),
(4, 9, 4, 0, NULL, 'Monday'),
(5, 10, 5, 1, 1, 'Tuesday'),
(6, 4, 6, 1, NULL, 'Thursday');

-- --------------------------------------------------------

--
-- Table structure for table `user_workout_progress`
--

CREATE TABLE `user_workout_progress` (
  `progress_id` int(11) NOT NULL,
  `user_workout_id` int(11) NOT NULL,
  `workout_detail_id` int(11) NOT NULL,
  `duration_minutes` decimal(5,2) DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_workout_progress`
--

INSERT INTO `user_workout_progress` (`progress_id`, `user_workout_id`, `workout_detail_id`, `duration_minutes`, `is_completed`) VALUES
(1, 1, 1, NULL, 1),
(2, 1, 5, '15.00', 1),
(3, 1, 8, '12.00', 0),
(4, 2, 4, '10.00', 1),
(5, 2, 6, '8.00', 1),
(6, 2, 10, NULL, 0),
(7, 3, 2, '25.00', 1),
(8, 3, 3, '30.00', 1),
(9, 3, 13, NULL, 0),
(10, 5, 4, NULL, 1),
(11, 5, 6, '10.00', 1),
(12, 5, 17, '25.00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `workout_details`
--

CREATE TABLE `workout_details` (
  `workout_detail_id` int(11) NOT NULL,
  `exercise_name` varchar(255) NOT NULL,
  `exercise_type` varchar(50) NOT NULL,
  `sets` int(11) NOT NULL,
  `reps` int(11) DEFAULT NULL,
  `rest_time_seconds` int(11) NOT NULL,
  `duration_minutes` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workout_details`
--

INSERT INTO `workout_details` (`workout_detail_id`, `exercise_name`, `exercise_type`, `sets`, `reps`, `rest_time_seconds`, `duration_minutes`) VALUES
(1, 'Squats', 'Strength', 4, 10, 90, NULL),
(2, 'Bench Press', 'Strength', 4, 8, 120, NULL),
(3, 'Deadlifts', 'Strength', 4, 6, 150, NULL),
(4, 'Jump Rope', 'Cardio', 2, NULL, 30, '10.00'),
(5, 'Push-Ups', 'Bodyweight', 3, 15, 60, NULL),
(6, 'Burpees', 'Cardio', 3, 12, 30, NULL),
(7, 'Pull-Ups', 'Bodyweight', 3, 8, 90, NULL),
(8, 'Lunges', 'Strength', 3, 12, 60, NULL),
(9, 'Plank', 'Core', 2, NULL, 30, '2.00'),
(10, 'Cycling', 'Cardio', 1, NULL, 30, '20.00'),
(11, 'Mountain Climbers', 'Cardio', 3, 20, 30, NULL),
(12, 'Russian Twists', 'Core', 3, 15, 45, NULL),
(13, 'Overhead Press', 'Strength', 3, 10, 90, NULL),
(14, 'Dumbbell Rows', 'Strength', 3, 12, 60, NULL),
(15, 'Box Jumps', 'Plyometric', 3, 15, 45, NULL),
(16, 'Side Plank', 'Core', 2, NULL, 30, '1.50'),
(17, 'Running', 'Cardio', 1, NULL, 30, '25.00'),
(18, 'Kettlebell Swings', 'Strength', 4, 15, 60, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workout_plans`
--

CREATE TABLE `workout_plans` (
  `workout_plan_id` int(11) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `difficulty` varchar(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `workout_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workout_plans`
--

INSERT INTO `workout_plans` (`workout_plan_id`, `plan_name`, `description`, `difficulty`, `type`, `workout_image`) VALUES
(1, 'Beginner Strength Training', 'A basic strength training program for beginners.', 'Beginner', 'General', 'workout_image/1.webp'),
(2, 'Intermediate Fat Burn', 'A cardio and strength mix for fat loss.', 'Intermediate', 'General', 'workout_image/2.jpg'),
(3, 'Advanced Muscle Building', 'An advanced plan focused on muscle hypertrophy.', 'Advanced', 'General', 'workout_image/3.webp'),
(4, 'Full-Body Fitness', 'A full-body workout program to improve overall fitness.', 'Beginner', 'General', 'workout_image/4.jpg'),
(5, 'Endurance Booster', 'Cardio-focused workouts for improving endurance.', 'Intermediate', 'General', 'workout_image/5.jpg'),
(6, 'Core and Stability Training', 'Focused on core strength and stability exercises.', 'Advanced', 'General', 'workout_image/6.webp');

-- --------------------------------------------------------

--
-- Table structure for table `workout_plan_details`
--

CREATE TABLE `workout_plan_details` (
  `id` int(11) NOT NULL,
  `workout_detail_id` int(11) NOT NULL,
  `workout_plan_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workout_plan_details`
--

INSERT INTO `workout_plan_details` (`id`, `workout_detail_id`, `workout_plan_id`) VALUES
(1, 1, 1),
(2, 5, 1),
(3, 8, 1),
(4, 4, 2),
(5, 6, 2),
(6, 10, 2),
(7, 2, 3),
(8, 3, 3),
(9, 13, 3),
(10, 14, 3),
(11, 1, 4),
(12, 5, 4),
(13, 7, 4),
(14, 15, 4),
(15, 4, 5),
(16, 17, 5),
(17, 6, 5),
(18, 11, 5),
(19, 9, 6),
(20, 12, 6),
(21, 16, 6),
(22, 18, 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance_classes`
--
ALTER TABLE `attendance_classes`
  ADD PRIMARY KEY (`class_attendance_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `attendance_code`
--
ALTER TABLE `attendance_code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_gym`
--
ALTER TABLE `attendance_gym`
  ADD PRIMARY KEY (`gym_attendance_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `badge`
--
ALTER TABLE `badge`
  ADD PRIMARY KEY (`badge_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `trainer_id` (`trainer_id`);

--
-- Indexes for table `class_participants`
--
ALTER TABLE `class_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `trainer_id` (`trainer_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `meal`
--
ALTER TABLE `meal`
  ADD PRIMARY KEY (`meal_id`);

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`membership_id`);

--
-- Indexes for table `member_performance_feedback`
--
ALTER TABLE `member_performance_feedback`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `trainer_id` (`trainer_id`);

--
-- Indexes for table `member_trainer`
--
ALTER TABLE `member_trainer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_trainer_ibfk_1` (`member_id`),
  ADD KEY `member_trainer_ibfk_2` (`trainer_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `points`
--
ALTER TABLE `points`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_badge`
--
ALTER TABLE `user_badge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `badge_id` (`badge_id`);

--
-- Indexes for table `user_meal`
--
ALTER TABLE `user_meal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indexes for table `user_membership`
--
ALTER TABLE `user_membership`
  ADD PRIMARY KEY (`user_membership_id`),
  ADD KEY `user_membership_ibfk_1` (`membership_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_workout_plans`
--
ALTER TABLE `user_workout_plans`
  ADD PRIMARY KEY (`user_workout_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `workout_plan_id` (`workout_plan_id`),
  ADD KEY `trainer_id` (`trainer_id`);

--
-- Indexes for table `user_workout_progress`
--
ALTER TABLE `user_workout_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `user_workout_id` (`user_workout_id`),
  ADD KEY `workout_detail_id` (`workout_detail_id`);

--
-- Indexes for table `workout_details`
--
ALTER TABLE `workout_details`
  ADD PRIMARY KEY (`workout_detail_id`);

--
-- Indexes for table `workout_plans`
--
ALTER TABLE `workout_plans`
  ADD PRIMARY KEY (`workout_plan_id`);

--
-- Indexes for table `workout_plan_details`
--
ALTER TABLE `workout_plan_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workout_detail_id` (`workout_detail_id`),
  ADD KEY `workout_plan_id` (`workout_plan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance_classes`
--
ALTER TABLE `attendance_classes`
  MODIFY `class_attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `attendance_code`
--
ALTER TABLE `attendance_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `attendance_gym`
--
ALTER TABLE `attendance_gym`
  MODIFY `gym_attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `badge`
--
ALTER TABLE `badge`
  MODIFY `badge_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `class_participants`
--
ALTER TABLE `class_participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `meal`
--
ALTER TABLE `meal`
  MODIFY `meal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `membership`
--
ALTER TABLE `membership`
  MODIFY `membership_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `member_performance_feedback`
--
ALTER TABLE `member_performance_feedback`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `member_trainer`
--
ALTER TABLE `member_trainer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `points`
--
ALTER TABLE `points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `user_badge`
--
ALTER TABLE `user_badge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user_meal`
--
ALTER TABLE `user_meal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `user_membership`
--
ALTER TABLE `user_membership`
  MODIFY `user_membership_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `user_workout_plans`
--
ALTER TABLE `user_workout_plans`
  MODIFY `user_workout_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `user_workout_progress`
--
ALTER TABLE `user_workout_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `workout_details`
--
ALTER TABLE `workout_details`
  MODIFY `workout_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `workout_plans`
--
ALTER TABLE `workout_plans`
  MODIFY `workout_plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `workout_plan_details`
--
ALTER TABLE `workout_plan_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_classes`
--
ALTER TABLE `attendance_classes`
  ADD CONSTRAINT `attendance_classes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_classes_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendance_gym`
--
ALTER TABLE `attendance_gym`
  ADD CONSTRAINT `attendance_gym_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_participants`
--
ALTER TABLE `class_participants`
  ADD CONSTRAINT `class_participants_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `member_performance_feedback`
--
ALTER TABLE `member_performance_feedback`
  ADD CONSTRAINT `member_performance_feedback_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `member_performance_feedback_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `member_trainer`
--
ALTER TABLE `member_trainer`
  ADD CONSTRAINT `member_trainer_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `member_trainer_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `points`
--
ALTER TABLE `points`
  ADD CONSTRAINT `points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_badge`
--
ALTER TABLE `user_badge`
  ADD CONSTRAINT `user_badge_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_badge_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badge` (`badge_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_meal`
--
ALTER TABLE `user_meal`
  ADD CONSTRAINT `user_meal_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_meal_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meal` (`meal_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_membership`
--
ALTER TABLE `user_membership`
  ADD CONSTRAINT `user_membership_ibfk_1` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`membership_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_membership_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_workout_plans`
--
ALTER TABLE `user_workout_plans`
  ADD CONSTRAINT `user_workout_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_workout_plans_ibfk_2` FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans` (`workout_plan_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_workout_plans_ibfk_3` FOREIGN KEY (`trainer_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_workout_progress`
--
ALTER TABLE `user_workout_progress`
  ADD CONSTRAINT `user_workout_progress_ibfk_1` FOREIGN KEY (`user_workout_id`) REFERENCES `user_workout_plans` (`user_workout_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_workout_progress_ibfk_2` FOREIGN KEY (`workout_detail_id`) REFERENCES `workout_details` (`workout_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `workout_plan_details`
--
ALTER TABLE `workout_plan_details`
  ADD CONSTRAINT `workout_plan_details_ibfk_1` FOREIGN KEY (`workout_detail_id`) REFERENCES `workout_details` (`workout_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `workout_plan_details_ibfk_2` FOREIGN KEY (`workout_plan_id`) REFERENCES `workout_plans` (`workout_plan_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
