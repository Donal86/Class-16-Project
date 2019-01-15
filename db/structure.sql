DROP TABLE IF EXISTS `property`;
CREATE TABLE `property` (
  `id` INT AUTO_INCREMENT,
  `link` varchar(255) NOT NULL UNIQUE,
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
  `sold` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `city_status`;
CREATE TABLE `city_status` (
  `id` INT AUTO_INCREMENT,
  `city` varchar(100) NOT NULL,
  `market_date` date NOT NULL,
  `total_price` float NOT NULL,
  `total_count` float NOT NULL,
  `total_m2` float NOT NULL,
  PRIMARY KEY (`city`, `market_date`),
  UNIQUE (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
