-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 11-12-2021 a las 17:55:53
-- Versión del servidor: 5.7.16
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cochi_peek`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `conekta_customer_id` int(11) NOT NULL,
  `src_id` text NOT NULL,
  `name_of_owner` varchar(255) NOT NULL,
  `last4` varchar(4) NOT NULL,
  `exp_month` varchar(2) NOT NULL,
  `exp_year` varchar(2) NOT NULL,
  `brand` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `card_payments`
--

CREATE TABLE `card_payments` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart_details`
--

CREATE TABLE `cart_details` (
  `id` int(11) NOT NULL,
  `shopping_cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `friendly_url` varchar(255) NOT NULL,
  `available` int(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `friendly_url`, `available`) VALUES
(5, 'Por Kilos', 'por-kilos', 1),
(2, 'Tortas', 'tortas', 1),
(1, 'Tacos', 'tacos', 1),
(3, 'Ordenes', 'ordenes', 1),
(6, 'Bebidas', 'bebidas', 1),
(4, 'Combos', 'combos', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codes`
--

CREATE TABLE `codes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `code` varchar(30) NOT NULL,
  `type` varchar(20) NOT NULL,
  `value` decimal(18,2) NOT NULL,
  `first_purchase` int(11) DEFAULT NULL,
  `minimun_amount` decimal(18,2) NOT NULL,
  `maximum_discount` double(18,2) NOT NULL DEFAULT '0.00',
  `reusable` int(1) NOT NULL DEFAULT '0',
  `quantity` int(5) NOT NULL DEFAULT '0',
  `start_date` int(11) DEFAULT NULL,
  `expire_at` int(11) DEFAULT NULL,
  `private` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conekta_customers`
--

CREATE TABLE `conekta_customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cus_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `conekta_customers`
--

INSERT INTO `conekta_customers` (`id`, `user_id`, `cus_id`) VALUES
(1, 1, 'cus_2pTbzQ5dUEMSdFjy4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mycodes`
--

CREATE TABLE `mycodes` (
  `id` int(11) NOT NULL,
  `code_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expire_at` int(11) NOT NULL,
  `is_used` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `public_id` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` int(4) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `created_on` int(11) NOT NULL,
  `subtotal` double(18,2) NOT NULL,
  `discount` double(18,2) NOT NULL,
  `total` double(18,2) NOT NULL,
  `order_status` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'order_pending',
  `mycode_id` int(11) DEFAULT NULL,
  `recomendation` int(1) DEFAULT NULL,
  `prepared` int(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_deliveries`
--

CREATE TABLE `order_deliveries` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `delivery_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datetime_of_delivery` int(11) NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance_value` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_value` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `send_request` int(11) DEFAULT NULL,
  `departure_time` int(11) DEFAULT NULL,
  `whatsapp_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp_is_sent` int(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` double(18,2) NOT NULL,
  `qty` int(10) NOT NULL,
  `subtotal` decimal(18,2) NOT NULL,
  `discount` decimal(18,2) NOT NULL,
  `total` decimal(18,2) NOT NULL,
  `prepared` int(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `ord_id` varchar(255) NOT NULL,
  `amount` double NOT NULL,
  `conekta_fee` double(18,2) NOT NULL,
  `store_fee` double(18,2) NOT NULL,
  `amount_to_receive` double(18,2) NOT NULL,
  `payment_status` varchar(100) NOT NULL DEFAULT 'payment_pending',
  `payment_date` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `code`) VALUES
(1, 'Super Admin', 'sudo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions_roles`
--

CREATE TABLE `permissions_roles` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `permissions_roles`
--

INSERT INTO `permissions_roles` (`id`, `role_id`, `permission_id`) VALUES
(36, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `points_of_sale`
--

CREATE TABLE `points_of_sale` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `points_of_sale`
--

INSERT INTO `points_of_sale` (`id`, `code`, `name`) VALUES
(1, 'web-store', 'Tienda online'),
(2, 'mobile-app', 'Aplicación móvil'),
(3, 'whatsapp-store', 'Tiendas whatsapp'),
(4, 'restaurant', 'Restaurante'),
(5, 'whatsapp-bot', 'Whatsapp bot');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `friendly_url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` double(18,2) NOT NULL DEFAULT '0.00',
  `position` int(10) NOT NULL DEFAULT '0',
  `available` int(1) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `category_id`, `friendly_url`, `name`, `description`, `price`, `position`, `available`) VALUES
(183, 1, 'taco-de-cochinita', 'Taco de cochinita', 'Taco de cochinita', 12.00, 9, 0),
(184, 2, 'torta-de-cochinita', 'Torta de cochinita', 'Torta de cochinita', 20.00, 8, 0),
(185, 3, '200-grs-de-cochinita-con-10-tortillas', '200 grs de cochinita con 10 tortillas', '200 grs de cochinita con 10 tortillas', 40.00, 7, 1),
(186, 4, '1-Torta-2-Tacos', '1 Torta + 2 Tacos', '1 Torta + 2 Tacos', 50.00, 6, 1),
(187, 5, '1-4-de-kg-de-cochinita', '1/4 de Kg de cochinita', '1/4 de Kg de cochinita', 65.00, 5, 1),
(188, 6, 'horchata-500-ml', 'Horchata 500 ml', 'Horchata 500 ml', 15.00, 4, 1),
(189, 5, '1-2-de-kg-de-cochinita', '1/2 de Kg de cochinita', '1/2 de Kg de cochinita', 130.00, 3, 1),
(190, 5, '3-4-de-kg-de-cochinita', '3/4 de Kg de cochinita', '3/4 de Kg de cochinita', 195.00, 2, 1),
(191, 5, '1-de-kg-de-cochinita', '1 de Kg de cochinita', '1 de Kg de cochinita', 260.00, 1, 1),
(192, NULL, 'taquiza-30-personas-cochinita', 'Taquiza 30 personas Cochinita', 'Taquiza 30 personas Cochinita', 1500.00, 0, 1),
(193, NULL, 'taquiza-50-personas-cochinita', 'Taquiza 50 personas Cochinita', 'Taquiza 50 personas Cochinita', 2000.00, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products_points_of_sale`
--

CREATE TABLE `products_points_of_sale` (
  `id` int(11) NOT NULL,
  `points_of_sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `products_points_of_sale`
--

INSERT INTO `products_points_of_sale` (`id`, `points_of_sale_id`, `product_id`) VALUES
(17, 1, 191),
(18, 1, 190),
(19, 1, 189),
(20, 1, 188),
(21, 1, 187),
(22, 1, 186),
(23, 1, 185),
(24, 1, 184),
(25, 1, 183),
(27, 2, 191),
(28, 3, 191),
(29, 4, 191),
(30, 5, 191);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `uri` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `uri`) VALUES
(78, 192, 'tres.jpg'),
(77, 191, 'dos.jpg'),
(76, 191, 'uno.jpg'),
(79, 193, 'cuatro.jpg'),
(80, 193, 'cinco.jpg'),
(81, 192, 'ocho.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profiles`
--

CREATE TABLE `profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(150) DEFAULT NULL,
  `last_name` varchar(150) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` int(1) DEFAULT NULL,
  `mobile_phone` varchar(10) NOT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `uri_picture` varchar(255) DEFAULT NULL,
  `registration_day` int(11) DEFAULT NULL,
  `sms_subscription` int(1) NOT NULL DEFAULT '1',
  `email_subscription` int(1) NOT NULL DEFAULT '1',
  `push_subscription` int(1) NOT NULL DEFAULT '1',
  `pop_subscription` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `first_name`, `last_name`, `birthday`, `gender`, `mobile_phone`, `phone`, `uri_picture`, `registration_day`, `sms_subscription`, `email_subscription`, `push_subscription`, `pop_subscription`) VALUES
(1, 1, 'Ramón Armando', 'Navarrete Dzul', '1992-08-31', 1, '9992743290', '9992532479', NULL, 1598850000, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(111) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `role`) VALUES
(1, 'super_administrator'),
(2, 'dispatcher'),
(3, 'store'),
(4, 'store_agent'),
(5, 'customer');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `shopping_carts`
--

CREATE TABLE `shopping_carts` (
  `id` int(11) NOT NULL,
  `public_id` varchar(36) NOT NULL,
  `total` double(18,2) NOT NULL,
  `expires_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `shopping_carts`
--

INSERT INTO `shopping_carts` (`id`, `public_id`, `total`, `expires_at`) VALUES
(18, 'b2cb4696-45a0-473b-8d09-4ebd6c15adbb', 0.00, 1639268425);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `shipping_service` int(1) DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `store_status` int(1) NOT NULL DEFAULT '0',
  `fee` int(11) NOT NULL DEFAULT '20',
  `lat` varchar(255) NOT NULL,
  `lng` varchar(255) NOT NULL,
  `registration_date` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `stores`
--

INSERT INTO `stores` (`id`, `owner_id`, `name`, `address`, `shipping_service`, `group_id`, `store_status`, `fee`, `lat`, `lng`, `registration_date`) VALUES
(31, NULL, 'Abarrotes el angelito', NULL, NULL, NULL, 0, 20, '20.9386225', '-89.5999083', 1633107995),
(32, NULL, 'Tendejón Natasha', NULL, NULL, NULL, 0, 20, '20.9384632', '-89.6004462', 1633108032),
(33, NULL, 'Tendejon la fortuna', NULL, NULL, NULL, 0, 20, '20.9368917', '-89.5989483', 1633123837),
(34, NULL, 'Tendejon la cuchilla', NULL, NULL, NULL, 0, 20, '20.9367967', '-89.5956134', 1633123868),
(35, NULL, 'Tendejon los naranjos', NULL, NULL, NULL, 0, 20, '20.9358562', '-89.6011164', 1633123897),
(36, NULL, 'Tienda II', NULL, NULL, NULL, 0, 20, '20.9377917', '-89.6012932', 1633123929),
(37, NULL, 'Tienda 13 de enero', NULL, NULL, NULL, 0, 20, '20.9353163', '-89.6006431', 1633123977),
(38, NULL, 'Tienda el arca de Noé', NULL, NULL, NULL, 0, 20, '20.935353', '-89.5956445', 1633124022),
(39, NULL, 'Tienda y frutería el divino niño', NULL, NULL, NULL, 0, 20, '20.9342405', '-89.596817', 1633124076),
(40, NULL, 'Tienda don pol', NULL, NULL, NULL, 0, 20, '20.9338021', '-89.5953831', 1633124120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `store_agents`
--

CREATE TABLE `store_agents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `store_id` int(11) NOT NULL,
  `chatId` varchar(100) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `action` varchar(100) NOT NULL,
  `cart_details` longtext,
  `cart_expiration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens`
--

CREATE TABLE `tokens` (
  `id` varchar(36) NOT NULL,
  `process_key` varchar(36) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `code` varchar(5) NOT NULL,
  `cell_phone_number` varchar(10) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tokens`
--

INSERT INTO `tokens` (`id`, `process_key`, `type`, `code`, `cell_phone_number`, `timestamp`) VALUES
('3929dada-c2b7-4fc5-8ca6-ed4a2852ad88', NULL, NULL, '72937', '9992743290', 1636556516),
('86313b97-4976-4fd5-b8ba-a72d2fbdcf98', 'key_f1APUY7luqBW412RrbFa', 'user_register', '15797', '9992743290', 1636557987),
('ef35a713-d425-47a1-a243-90b8198a0e06', 'key_frSZYYm7KALzH226XRwC', 'user_register', '89486', '9992743290', 1636557641);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `password` varchar(150) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  `last_password_update` int(11) NOT NULL,
  `web_push_token` text,
  `mobile_device` varchar(20) DEFAULT NULL,
  `mobile_push_token` text,
  `deny_access` int(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role_id`, `password`, `salt`, `last_password_update`, `web_push_token`, `mobile_device`, `mobile_push_token`, `deny_access`) VALUES
(1, 5, '$2b$10$xQ01nDoktl0Hgp73SOfOAeqyni394UTBCfvlbbRqGwWAEa64QKXeC', '$2b$10$xQ01nDoktl0Hgp73SOfOAe', 1621177442, NULL, NULL, NULL, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `card_payments`
--
ALTER TABLE `card_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cart_details`
--
ALTER TABLE `cart_details`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `friendly_url` (`friendly_url`),
  ADD KEY `friendly_url_2` (`friendly_url`),
  ADD KEY `friendly_url_3` (`friendly_url`),
  ADD KEY `friendly_url_4` (`friendly_url`),
  ADD KEY `friendly_url_5` (`friendly_url`);

--
-- Indices de la tabla `codes`
--
ALTER TABLE `codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `conekta_customers`
--
ALTER TABLE `conekta_customers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mycodes`
--
ALTER TABLE `mycodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `code_id` (`code_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD KEY `customer_id` (`seller_id`);

--
-- Indices de la tabla `order_deliveries`
--
ALTER TABLE `order_deliveries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `whatsApp_id` (`whatsapp_id`);

--
-- Indices de la tabla `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indices de la tabla `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ord_id` (`ord_id`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `permissions_roles`
--
ALTER TABLE `permissions_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rol_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indices de la tabla `points_of_sale`
--
ALTER TABLE `points_of_sale`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD KEY `code` (`code`),
  ADD KEY `code_2` (`code`),
  ADD KEY `code_4` (`code`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `friendly_url` (`friendly_url`),
  ADD KEY `id` (`id`),
  ADD KEY `friendly_url_2` (`friendly_url`),
  ADD KEY `friendly_url_3` (`friendly_url`);

--
-- Indices de la tabla `products_points_of_sale`
--
ALTER TABLE `products_points_of_sale`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`uri`);

--
-- Indices de la tabla `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `mobile_phone` (`mobile_phone`),
  ADD KEY `mobile_phone_2` (`mobile_phone`),
  ADD KEY `mobile_phone_3` (`mobile_phone`),
  ADD KEY `mobile_phone_4` (`mobile_phone`),
  ADD KEY `mobile_phone_5` (`mobile_phone`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `shopping_carts`
--
ALTER TABLE `shopping_carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `public_id` (`public_id`);

--
-- Indices de la tabla `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `store_agents`
--
ALTER TABLE `store_agents`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rol_id` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT de la tabla `card_payments`
--
ALTER TABLE `card_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cart_details`
--
ALTER TABLE `cart_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `codes`
--
ALTER TABLE `codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `conekta_customers`
--
ALTER TABLE `conekta_customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mycodes`
--
ALTER TABLE `mycodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3927;

--
-- AUTO_INCREMENT de la tabla `order_deliveries`
--
ALTER TABLE `order_deliveries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5260;

--
-- AUTO_INCREMENT de la tabla `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6104;

--
-- AUTO_INCREMENT de la tabla `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5165;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `permissions_roles`
--
ALTER TABLE `permissions_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `points_of_sale`
--
ALTER TABLE `points_of_sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT de la tabla `products_points_of_sale`
--
ALTER TABLE `products_points_of_sale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT de la tabla `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(111) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `shopping_carts`
--
ALTER TABLE `shopping_carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `store_agents`
--
ALTER TABLE `store_agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
