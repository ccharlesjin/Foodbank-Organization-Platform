-- 插入 User 数据
INSERT INTO User (user_name, email, password, phone_number, full_name, branch_id) VALUES
('JohnDoe', 'johndoe@example.com', '341ef5f7f28eb2a19ce02b725152c94e9a88715ad0a021cf66b6ceefdc2083cb921716bbd3ed56d18ae3b10a7fcf808831d3eabfbbd754a1418e699a65879a8c', '1234567890', 'John Doe', 1),
('JaneDoe', 'janedoe@example.com', 'cbab9bfe6be68a7b0cfe6cc9c079d357393f2b8702fa31cd25cdeff4e49930c079108604cf07b10e42123af11676bc694883bc2da08d5cfb6e357b72aba5018e', '0987654321', 'Jane Doe', 2),
('AliceJohnson', 'alicej@example.com', 'b96cbe385f672920879141dc229f34d9bd1d3af43faef97272a4dae3cd7bacaadcd208082093e9fe84a8009fceabaf22a151ccc26209fc6ca2ccf8f459367cbc', '1122334455', 'Alice Johnson', 3),
('BobSmith', 'bobsmith@example.com', '28ecbb800bfa08ea186db7b03ca37b978d7fed225c0518e9e8cfb63c4ede242cb40292073dd3850dfec5b83121bd80dcd63fcc3dec76e480a702bfc33c345d02', '5566778899', 'Bob Smith', 4);


-- 插入 Manager 数据
INSERT INTO Manager (user_name, email, password, phone_number, full_name, branch_id) VALUES
('JohnDoe', 'johndoe@example.com', 'ec529a18f23133d970f4de2e103f56af6a816112d9664ec469be9a22c23aa526dc1e65a26d5fe35846e3377fa46108f3359d783db9018cc879c9e2e8408ed81b', '1234567890', 'John Doe', 1),
('JaneDoe', 'janedoe@example.com', '7a1394fc877cb99f505662f64c94a034b8415d2f2c8c34c3b4d12142bc1501757f36e5327358ec92d59ef56bcf482354c67d750fe15168d8ab3b410c3d04c4b0', '0987654321', 'Jane Doe', 2),
('AliceJohnson', 'alicej@example.com', '2e4aa4faba5185a82717ef2160e78f920b5267f889e0048a8105c40c919a9470cc4ff668e3484156e1fef7ee5bd06ff9b63a93879e2b3b6e29a4a8c397db8744', '1122334455', 'Alice Johnson', 3),
('BobSmith', 'bobsmith@example.com', '09fffa6ad7631243c6dd05c71147998a825d91c431ea363f4534ebb5a877eff210cedccb61efb210fc173b8f3784ea1a699c9f23fec8645d35ef692cb94c9749', '5566778899', 'Bob Smith', 4);


INSERT INTO Administrator (User_Name, Email, Password) VALUES ('JohnDoe', 'johndoe@example.com', 'ec529a18f23133d970f4de2e103f56af6a816112d9664ec469be9a22c23aa526dc1e65a26d5fe35846e3377fa46108f3359d783db9018cc879c9e2e8408ed81b');
