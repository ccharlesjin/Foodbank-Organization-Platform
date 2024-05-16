-- 创建数据库和选择数据库
CREATE DATABASE IF NOT EXISTS FoodBank;
USE FoodBank;

-- 创建 Branches 表
CREATE TABLE IF NOT EXISTS Branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255),
    description VARCHAR(255),
    image_url VARCHAR(255)
);

-- 插入 Branches 数据
INSERT INTO Branches (branch_name, description, image_url) VALUES
('Sydney', '330A/330B George St, Sydney NSW 2000', 'pictures/sydney.png'),
('Melbourne', 'Corner of, 14 Acland Street, St Leonards Ave, St Kilda VIC 3182', 'pictures/melbourne.png'),
('Brisbane', '322 Wecker Rd, Carindale QLD 4152', 'pictures/brisbane.png'),
('Adelaide', '89/93 Henley Beach Rd, Mile End SA 5031', 'pictures/adelaide.png'),
('Perth', '38 Kings Park Rd, West Perth WA 6005', 'pictures/perth.png');

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
    manager_id INT,
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id),
    FOREIGN KEY (manager_id) REFERENCES Manager(user_id)
);

-- 插入 Activity 数据
INSERT INTO Activity (activity_name, activity_date, activity_number_of_people, activity_information, branch_id, manager_id) VALUES
('aaaaaa', '2024-01-01', 1000, 'aaaaaaaaaaaaaaaa', 1, 1),
('bbbbbb', '2024-01-02', 2000, 'bbbbbbbbbbbbbbbb', 2, 2),
('cccccc', '2024-01-03', 3000, 'cccccccccccccccc', 3, 3),
('dddddd', '2024-01-04', 4000, 'dddddddddddddddd', 4, 4);

-- 创建 User_in_activities 表

CREATE TABLE IF NOT EXISTS User_in_activities (
    user_id INT,
    activity_id INT,
    status ENUM('Yes', 'No', 'Maybe') NOT NULL,
    remarks VARCHAR(255),
    reply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, activity_id),
    FOREIGN KEY (activity_id) REFERENCES Activity(activity_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 插入 User_in_activities 数据
-- 插入 User_in_activities 数据
INSERT INTO User_in_activities (user_id, activity_id, status, remarks) VALUES
(1, 2, 'Yes', 'Looking forward to it'),
(1, 1, 'No', 'Not available on that date');



-- 创建 Administrator 表
CREATE TABLE IF NOT EXISTS Administrator (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);

INSERT INTO Administrator (User_Name, Email, Password) VALUES ('JohnDoe', 'johndoe@example.com', 'fihuewhiu49874');

-- 创建 Updates 表
CREATE TABLE IF NOT EXISTS Updates (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT,
    manager_id INT,
    title TEXT,
    content TEXT,
    visibility ENUM('public', 'inside branch', 'private'),
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES Branches(branch_id),
    FOREIGN KEY (manager_id) REFERENCES Manager(user_id)
);

-- 创建 Updates_Users 表
CREATE TABLE IF NOT EXISTS Updates_Users (
    update_id INT,
    user_id INT,
    PRIMARY KEY (update_id, user_id),
    FOREIGN KEY (update_id) REFERENCES Updates(update_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

INSERT INTO Updates (branch_id, manager_id, title, content, visibility)
VALUES
(1, 1, 'New Policy Update', 'We have updated our company policy regarding remote work.', 'public'),
(1, 1, 'Branch Meeting', 'There will be a branch meeting next Monday at 10 AM.', 'inside branch'),
(2, 2, 'Private Note', 'This is a confidential update for the management team.', 'private'),
(2, 2, 'Holiday Schedule', 'Please be informed about the upcoming holiday schedule.', 'public'),
(1, 1, 'System Maintenance', 'System maintenance will occur this weekend.', 'inside branch');

-- 查看所有公共帖子，包括访客
CREATE OR REPLACE VIEW PublicUpdates AS
SELECT * FROM Updates WHERE visibility = 'public';

-- 查看分支内部帖子，需验证用户登录和分支权限
CREATE OR REPLACE VIEW InsideBranchUpdates AS
SELECT * FROM Updates WHERE visibility = 'inside branch';

-- 查看私人帖子，仅限特定用户
CREATE OR REPLACE VIEW PrivateUpdates AS
SELECT Updates.* FROM Updates
JOIN Updates_Users ON Updates.update_id = Updates_Users.update_id
WHERE visibility = 'private';