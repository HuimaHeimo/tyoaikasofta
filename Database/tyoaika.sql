--
-- Tarkastetaan, onko kanta jo olemassa.
--
DROP DATABASE IF EXISTS tyoaika;

--
-- Luodaan kanta, jos sitä ei ole.
--
CREATE DATABASE IF NOT EXISTS tyoaika;

--
-- Otetaan kanta käyttöön, että tulevat toimenpiteet onnistuvat.
-- 
USE tyoaika;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+02:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tyoaika`
--


--
-- Luodaan tyontekijat-taulu
--
DROP TABLE IF EXISTS `tyontekijat`;

CREATE TABLE `tyontekijat` (
  `tyontekijaID` INT(11) NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(50) NOT NULL,
   PRIMARY KEY (`tyontekijaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Luodaan projektit-taulu
--
DROP TABLE IF EXISTS `projektit`;

CREATE TABLE `projektit` (
  `projektiID` INT(11) NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`projektiID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Luodaan tyoajat-taulu.
--
DROP TABLE IF EXISTS `tyoajat`;

CREATE TABLE `tyoajat` (
  `tyoaikaID` INT(11) NOT NULL AUTO_INCREMENT,
  `tyoteID` INT(11) NOT NULL,
  `proID` INT(11) NOT NULL,
  `aloitus` DATETIME NOT NULL,
  `lopetus` DATETIME NOT NULL,
   PRIMARY KEY (`tyoaikaID`, `tyoteID`, `proid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Luodaan relaatiot taulujen välille.
--
ALTER TABLE `tyoajat`
  ADD CONSTRAINT `tyontekijat_tyoajat` FOREIGN KEY (`tyoteID`) REFERENCES `tyontekijat` (`tyontekijaID`),
  ADD CONSTRAINT `projektit_tyoajat` FOREIGN KEY (`proID`) REFERENCES `projektit` (`projektiID`);
  
  


 --
-- Lisätään tyontekijat-tauluun dataa.
--
 INSERT INTO `tyontekijat` (`tyontekijaID`, `nimi`) VALUES
 (1, 'Matti Mikkonen'),
 (2, 'Pete Hassinen'),
 (3, 'Pete Kauppinen'),
 (4, 'Jiri Liimanäppi'),
 (5, 'Miihkali Suurmankeli'),
 (6, 'Kumi Rääkkynen'),
 (7, 'Takuma Sato');

--
-- Lisätään projektit-tauluun dataa.
--
 INSERT INTO `projektit` (`projektiID`, `nimi`) VALUES
 (1, 'Ydinlaskeuman siivous'),
 (2, 'Papattikaupan kehitys'),
 (3, 'Operation X'),
 (4, 'Operation Ripper'),
 (5, 'Pappatunturin korjaus'),
 (6, 'The Great Theft'),
 (7, 'Kuulento');
 
 --
-- Lisätään tyoajat-tauluun dataa.
--
 INSERT INTO `tyoajat` (`tyoaikaID`, `tyoteID`, `proID`, `aloitus`, `lopetus`) VALUES
 (1, 2, 4, '2019-12-14 12-00-00', '2019-12-14 16-00-00'),
 (2, 1, 5, '2019-10-01 08-00-00', '2019-10-01 16-00-00'),
 (3, 3, 3, '2019-12-14 10-00-00', '2019-12-14 16-00-00'),
 (4, 6, 7, '2019-12-14 07-00-00', '2019-12-14 12-00-00'),
 (5, 4, 2, '2019-12-14 14-00-00', '2019-12-14 20-00-00'),
 (6, 5, 1, '2019-12-14 12-00-00', '2019-12-14 18-00-00'),
 (7, 7, 6, '2019-12-14 10-00-00', '2019-12-14 14-00-00');

 




COMMIT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
