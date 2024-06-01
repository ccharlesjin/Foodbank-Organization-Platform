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
('JohnDoe', 'johndoe@example.com', '341ef5f7f28eb2a19ce02b725152c94e9a88715ad0a021cf66b6ceefdc2083cb921716bbd3ed56d18ae3b10a7fcf808831d3eabfbbd754a1418e699a65879a8c', '1234567890', 'John Doe', 1),
('JaneDoe', 'janedoe@example.com', 'cbab9bfe6be68a7b0cfe6cc9c079d357393f2b8702fa31cd25cdeff4e49930c079108604cf07b10e42123af11676bc694883bc2da08d5cfb6e357b72aba5018e', '0987654321', 'Jane Doe', 2),
('AliceJohnson', 'alicej@example.com', 'b96cbe385f672920879141dc229f34d9bd1d3af43faef97272a4dae3cd7bacaadcd208082093e9fe84a8009fceabaf22a151ccc26209fc6ca2ccf8f459367cbc', '1122334455', 'Alice Johnson', 3),
('BobSmith', 'bobsmith@example.com', '28ecbb800bfa08ea186db7b03ca37b978d7fed225c0518e9e8cfb63c4ede242cb40292073dd3850dfec5b83121bd80dcd63fcc3dec76e480a702bfc33c345d02', '5566778899', 'Bob Smith', 4);

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
('JohnDoe', 'johndoe@example.com', 'ec529a18f23133d970f4de2e103f56af6a816112d9664ec469be9a22c23aa526dc1e65a26d5fe35846e3377fa46108f3359d783db9018cc879c9e2e8408ed81b', '1234567890', 'John Doe', 1),
('JaneDoe', 'janedoe@example.com', '7a1394fc877cb99f505662f64c94a034b8415d2f2c8c34c3b4d12142bc1501757f36e5327358ec92d59ef56bcf482354c67d750fe15168d8ab3b410c3d04c4b0', '0987654321', 'Jane Doe', 2),
('AliceJohnson', 'alicej@example.com', '2e4aa4faba5185a82717ef2160e78f920b5267f889e0048a8105c40c919a9470cc4ff668e3484156e1fef7ee5bd06ff9b63a93879e2b3b6e29a4a8c397db8744', '1122334455', 'Alice Johnson', 3),
('BobSmith', 'bobsmith@example.com', '09fffa6ad7631243c6dd05c71147998a825d91c431ea363f4534ebb5a877eff210cedccb61efb210fc173b8f3784ea1a699c9f23fec8645d35ef692cb94c9749', '5566778899', 'Bob Smith', 4);
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

INSERT INTO Administrator (User_Name, Email, Password) VALUES ('JohnDoe', 'johndoe@example.com', 'ec529a18f23133d970f4de2e103f56af6a816112d9664ec469be9a22c23aa526dc1e65a26d5fe35846e3377fa46108f3359d783db9018cc879c9e2e8408ed81b');

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