-- 创建数据库和选择数据库
CREATE DATABASE IF NOT EXISTS FoodBank;
USE FoodBank;

-- 创建 Branches 表
CREATE TABLE IF NOT EXISTS Branches (
    branch_id INT PRIMARY KEY,
    branch_name VARCHAR(255),
    description VARCHAR(255),
    image_url VARCHAR(255)
);

-- 插入 Branches 数据
INSERT INTO Branches (branch_id, branch_name, description, image_url) VALUES
(0, 'Sydney', '330A/330B George St, Sydney NSW 2000', 'pictures/sydney.png'),
(1, 'Melbourne', 'Corner of, 14 Acland Street, St Leonards Ave, St Kilda VIC 3182', 'pictures/melbourne.png'),
(2, 'Brisbane', '322 Wecker Rd, Carindale QLD 4152', 'pictures/brisbane.png'),
(3, 'Adelaide', '89/93 Henley Beach Rd, Mile End SA 5031', 'pictures/adelaide.png'),
(4, 'Perth', '38 Kings Park Rd, West Perth WA 6005', 'pictures/perth.png');

-- 创建 User 表
CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(255),
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
);

-- 插入 User 数据
INSERT INTO User (user_name, email, password, phone_number, full_name, branch_id) VALUES
('JohnDoe', 'johndoe@example.com', 'hfeuiah32323', '1234567890', 'John Doe', 1),
('JaneDoe', 'janedoe@example.com', 'fjoaije2143', '0987654321', 'Jane Doe', 2),
('AliceJohnson', 'alicej@example.com', 'dfpkrpokgopr7868', '1122334455', 'Alice Johnson', 3),
('BobSmith', 'bobsmith@example.com', 'fejoaifjei7658', '5566778899', 'Bob Smith', 4);

-- 创建 Manager 表
CREATE TABLE IF NOT EXISTS Manager (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(255),
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
);

-- 插入 Manager 数据
INSERT INTO Manager (user_name, email, password, phone_number, full_name, branch_id) VALUES
('JohnDoe', 'johndoe@example.com', 'fihuewhiu49874', '1234567890', 'John Doe', 1),
('JaneDoe', 'janedoe@example.com', 'fjdoiajfio3490', '0987654321', 'Jane Doe', 2),
('AliceJohnson', 'alicej@example.com', 'froihri4ueh39289', '1122334455', 'Alice Johnson', 3),
('BobSmith', 'bobsmith@example.com', 'fnirhoiorjeio4839', '5566778899', 'Bob Smith', 4);

-- 创建 Activity 表
CREATE TABLE IF NOT EXISTS Activity (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    activity_name VARCHAR(255),
    activity_date DATE,
    activity_number_of_people INT,
    activity_information VARCHAR(255),
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)
);

-- 插入 Activity 数据
INSERT INTO Activity (activity_name, activity_date, activity_number_of_people, activity_information, branch_id) VALUES
('aaaaaa', '2024-01-01', 1000, 'aaaaaaaaaaaaaaaa', 1),
('bbbbbb', '2024-01-02', 2000, 'bbbbbbbbbbbbbbbb', 2),
('cccccc', '2024-01-03', 3000, 'cccccccccccccccc', 3),
('dddddd', '2024-01-04', 4000, 'dddddddddddddddd', 4);

-- 创建 User_in_activities 表

CREATE TABLE IF NOT EXISTS User_in_activities (
    user_id INT,
    activity_id INT,
    manager_id INT,
    PRIMARY KEY (user_id, activity_id),
    FOREIGN KEY (activity_id) REFERENCES Activity(activity_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (manager_id) REFERENCES Manager(user_id)
);

-- 插入 User_in_activities 数据
INSERT INTO User_in_activities (user_id, activity_id, manager_id) VALUES (1, 2,1);
INSERT INTO User_in_activities (user_id, activity_id, manager_id) VALUES (1, 1,2);


-- 创建 Administrator 表
CREATE TABLE IF NOT EXISTS Administrator (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);

INSERT INTO Administrator (User_Name, Email, Password) VALUES ('JohnDoe', 'johndoe@example.com', 'fihuewhiu49874');