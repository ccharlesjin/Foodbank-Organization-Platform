# 项目介绍
The "FoodBank" platform is a comprehensive web application designed to enhance engagement and management within volunteer organizations. This platform will enable users to seamlessly sign up, log in, and interact with their respective volunteer organizations through a variety of intuitive features. Leveraging technologies such as NodeJS, Express, Vue.JS, and AJAX, alongside a MySQL database, our application aims to provide a robust and accessible environment for both volunteers and organization managers.

# 环境依赖
 Windows 10 or later, macOS Catalina or later, or any of the current major Linux distributions are recommended.

# 目录结构描述


# 使用说明
 1. Start the Docker environment
 2. Starting the mysql Service:`service mysql start`
 3. Migrate the database according to FoodBank.sql
 4. Start the project on port 3018:`node app.js`


# 版本内容更新
##### v0.0.1-k: Static File Implementation: index.html,about.html,location.html,login.html,register.html.
##### v0.0.2-k: Create the Branches table and implement location.html to dynamically update the name and location of the organization's branches by querying the Branches table.
##### v0.0.3-w:
##### v0.0.4-k: Separate the database connection file db.js, delete unnecessary files, complete the back-end logon logic, and jump to user.html after success.
##### v0.0.4-k: Create manager registration and login page, implement back-end logon and registration logic; Create an administrator login page to implement the back-end login logic.
##### v0.0.5-j: Implemented the member data management of the branch administrator, allowing administrators to add, edit, and delete member data.