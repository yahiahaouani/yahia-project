-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 05 août 2025 à 23:30
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `vente`
--

-- --------------------------------------------------------

--
-- Structure de la table `annonces`
--

CREATE TABLE `annonces` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `region` varchar(100) NOT NULL,
  `categorie` varchar(50) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annonces`
--

INSERT INTO `annonces` (`id`, `user_id`, `titre`, `description`, `prix`, `region`, `categorie`, `telephone`, `date_creation`) VALUES
(3, 2, 'un iphone 16 pro', 'csqvsdqvfq', 3900.00, 'tunis', 'Magasin', '+216 28456789', '2025-07-12 22:14:08'),
(4, 2, 'maison avec jardin', 'frtbgtb', 132000.00, 'sfax', 'Meuble', '+216 28456789', '2025-07-12 22:15:04'),
(5, 2, 'pc hp victus 16', 'dsqfsdqgsdqg', 39000.00, 'sfax', 'Magasin', '+216 28456789', '2025-07-12 22:15:56'),
(6, 2, 's22 ultra comme neuf', 'rgtgtbt', 39000.00, 'kairouan', 'Magasin', '+216 28456789', '2025-07-12 22:17:13'),
(8, 2, 'maison a vendre en kairouan ', 'qdsfregh(ybgbki,rbrt;lbbrobtbrb)(-(-lfevvkl))', 99999999.99, 'kairouan', 'Maison', '98487809', '2025-07-13 21:16:45'),
(10, 2, 'maison a vendre en sfax ', 'dcfqdbfjqdbnfs\r\nqfqskfnkq\r\nqsfqsfqs', 122201.00, 'kairouan', 'Meuble', '98487809', '2025-07-14 22:37:11'),
(11, 3, 'maison a vendre en sousse ', 'dzdede\r\nefef\'fzef', 122201.00, 'kairouan', 'Maison', '98487809', '2025-07-15 07:50:24'),
(14, 2, 'maison avec pescine', 'vcvcvcv', 122201.00, 'kairouan', 'Maison', '98487809', '2025-07-31 19:18:18'),
(15, 2, 'un ordinateur de bureau', 'Ecran 20\" LCD - Processeur Intel Core i3-2120 , 2.6 GHz , 3 Mo de mémoire cache - Mémoire 4 Go - Disque 500 Go - Carte graphique Intel HD Graphics - Graveur DVD - Lecteur de cartes - 6xUSB 2.0 - DVI - Garantie 1 an .', 1130.00, 'sfax', 'Décoration', '29483591', '2025-08-05 13:29:12');

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `annonce_id` int(11) NOT NULL,
  `date_ajout` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `annonce_id`, `date_ajout`) VALUES
(13, 2, 4, '2025-07-13 22:38:17'),
(16, 2, 3, '2025-07-14 22:36:26');

-- --------------------------------------------------------

--
-- Structure de la table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `annonce_id` int(11) NOT NULL,
  `chemin` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `photos`
--

INSERT INTO `photos` (`id`, `annonce_id`, `chemin`) VALUES
(5, 3, 'uploads\\telecharger.jpg'),
(6, 4, 'uploads\\20210202-articles-blog-maisons-france-confort5.jpg'),
(7, 5, 'uploads\\shotbyjr.jpg'),
(8, 6, 'uploads\\telecharger_1.jpg'),
(9, 8, 'uploads\\20210202-articles-blog-maisons-france-confort5.jpg'),
(10, 8, 'uploads\\images.jpg'),
(11, 10, 'uploads\\telecharger.jpg'),
(12, 11, 'uploads\\20210202-articles-blog-maisons-france-confort5.jpg'),
(13, 11, 'uploads\\images.jpg'),
(14, 14, 'uploads\\20210202-articles-blog-maisons-france-confort5.jpg'),
(15, 15, 'uploads\\hp-compaq-cq2702sk.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `username`, `password`) VALUES
(1, 'Yahia Haouani', 'yahia@example.com', '123456'),
(2, 'yossri trabelsi', 'yossri.hn18', 'scrypt:32768:8:1$1ynyHGW5OWzti7Uv$3df64d95872992a3958c6c44ebd1b2b9e861c2eac361046c90a572bf502d683cd9d3a13fbfc2590b8ca9a8ac1b1274116c859cb63ca46c5909b78159da5eed8c'),
(3, 'yahia hc', 'yahia.hn20', 'scrypt:32768:8:1$seGUSY3WHiht89TZ$30c3ca7f8a4eef01483f810f16b8210306011723dd4c392c9dcf26225665c36dbd4d06ea8fec1e96bd6c3a1ec5eadb7f2a51d34786474c5aa12852b32099b330'),
(4, 'sofiane jbili', 'sofiane.jbili18', 'scrypt:32768:8:1$px9k9YuAFm0EJaqT$6e2d5edeb2fb461403035bf3698992c647b673ca4a00f798be7ab8fa901f1619bfd4939ae4d43a3d4d0f7e1e9a2913a53e0650427764878b182480a71b583eda'),
(5, 'med amin', 'med.amin18', 'scrypt:32768:8:1$Z2PhDlWlexfyIjMp$65ff3e1cae37825e85946afe7d2cf97b3632cc8acf66411ef181f88124ee73d55212ea9ba575da97c497a27bbeef3ba12348187588792da762c0a3c83bffed86');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annonces`
--
ALTER TABLE `annonces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fav` (`user_id`,`annonce_id`),
  ADD KEY `fk_favorites_annonce` (`annonce_id`);

--
-- Index pour la table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `annonce_id` (`annonce_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`username`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annonces`
--
ALTER TABLE `annonces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `annonces`
--
ALTER TABLE `annonces`
  ADD CONSTRAINT `annonces_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_annonce` FOREIGN KEY (`annonce_id`) REFERENCES `annonces` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`annonce_id`) REFERENCES `annonces` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
