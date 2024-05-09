
CREATE DATABASE FoodBank;
USE FoodBank;
CREATE TABLE Branches (
    branch_id INT PRIMARY KEY,
    branch_name VARCHAR(255),
    description VARCHAR(255),
    image_url VARCHAR(255)
);
INSERT INTO Branches (branch_id, branch_name, description, image_url) VALUES
(0, 'Sydney', '330A/330B George St, Sydney NSW 2000', 'pictures/sydney.png'),
(1, 'Melbourne', 'Corner of, 14 Acland Street, St Leonards Ave, St Kilda VIC 3182', 'pictures/melbourne.png'),
(2,'Brisbane','322 Wecker Rd, Carindale QLD 4152','pictures/brisbane.png'),
(3,'Adelaide','89/93 Henley Beach Rd, Mile End SA 5031','pictures/adelaide.png');
#更新Branches
INSERT INTO Branches (branch_id, branch_name, description, image_url) VALUES(4,'Perth','38 Kings Park Rd, West Perth WA 6005','pictures/perth.png');
