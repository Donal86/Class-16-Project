SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `properties`
--

-- --------------------------------------------------------

--
-- Table structure for table `city_status`
--

CREATE TABLE `city_status` (
  `id` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `market_date` date NOT NULL,
  `total_price` float NOT NULL,
  `total_count` float NOT NULL,
  `total_m2` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `id` int(11) NOT NULL,
  `link` varchar(255) NOT NULL,
  `market_date` date NOT NULL,
  `location_country` varchar(50) NOT NULL,
  `location_city` varchar(50) NOT NULL,
  `location_address` varchar(255) DEFAULT NULL,
  `location_coordinates_lat` float DEFAULT NULL,
  `location_coordinates_lng` float DEFAULT NULL,
  `size_parcelm2` float DEFAULT NULL,
  `size_grossm2` float DEFAULT NULL,
  `size_netm2` float DEFAULT NULL,
  `size_rooms` float NOT NULL,
  `price_value` float NOT NULL,
  `price_currency` varchar(3) NOT NULL,
  `description` text,
  `title` varchar(255) DEFAULT NULL,
  `images` text,
  `sold` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city_status`
--
ALTER TABLE `city_status`
  ADD PRIMARY KEY (`city`,`market_date`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `link` (`link`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
