# Project introduction
The "FoodBank" platform is a comprehensive web application designed to enhance engagement and management within volunteer organizations. This platform will enable users to seamlessly sign up, log in, and interact with their respective volunteer organizations through a variety of intuitive features. Leveraging technologies such as NodeJS, Express, Vue.JS, and AJAX, alongside a MySQL database, our application aims to provide a robust and accessible environment for both volunteers and organization managers.

# Environmental dependence
 Windows 10 or later, macOS Catalina or later, or any of the current major Linux distributions are recommended.

# Directory structure


# Instructions for use
 1. Start the Docker environment
 2. Starting the mysql Service:`service mysql start`
 3. Migrate the database according to FoodBank.sql
 4. Start the project on port 3018:`node app.js`


# Please check Milestone 1 related description file: '/FoodBank_Project_Description.pdf'

# Version updates
##### v0.0.1-k: Static File Implementation: index.html,about.html,location.html,login.html,register.html.
##### v0.0.2-k: Create the Branches table and implement location.html to dynamically update the name and location of the organization's branches by querying the Branches table.
##### v0.0.3-w: Preliminarily created a database relationship diagram, and based on the relationship diagram, initially created user, administrator, activity, and other connection tables.
##### v0.0.3-w: The user profile interface is initially completed; after the initial registration information, the user still needs to add more information to complete the registration interface, and the personal profile interface can only be entered after the registration is completely completed.
##### v0.0.4-k: Separate the database connection file db.js, delete unnecessary files, complete the back-end logon logic, and jump to user.html after success.
##### v0.0.4-k: Create manager registration and login page, implement back-end logon and registration logic; Create an administrator login page to implement the back-end login logic.
##### v0.0.5-j: Implemented the member data management of the branch administrator, allowing administrators to add, edit, and delete member data.
##### v0.0.6-j: The file structure has been modified to ensure consistency with the main branch, using a new database structure.
##### v0.0.7-j: Use cookie and JWT to verify manager's identity. Manager will not be able to login or fetch the member data if not verified.
##### v0.0.8-z: Finish features of administrator, including editing, adding and deleting users, managers and branches, sign up other administrators.
##### v0.0.8-j: Merged the branch of manager and administrator, applied JWT verification to both manager and administrator login strategy.
##### v0.0.9-w: Improved the personal profile interface, including the ability to change avatars and edit personal profile information. Users can now change their passwords with added requirements for password security levels and restrictions to ensure passwords are not the same as before.
##### v0.0.9-w: Implemented partial refresh and modal box functionality for user interface elements. Enhanced the display of user information on active pages, providing a more dynamic and seamless user experience.
##### v0.0.10-z: In administrator manage website: Successfully connected the application to a MySQL database, and ensured seamless synchronization between the user interface and the database for all create, read, update, delete operations.
##### v0.0.11-z: In adding users, organization, branch or administrator: setting to pop up a table to let popole operate.
##### v0.0.12-j: Completed the update post functionality for the branch manager section and improved the corresponding database logic. Now, the manager can choose to publish notifications as public, inside branch, or private categories.
##### v0.0.13-j: Improved and integrated the UI design for the manager section, ensuring consistency between the manager and administrator UI. Updated the CSS for the footer section.
##### v0.0.14-j: The authentication part of the entire management system has been completed using cookie-parser. Upon successful login, the system places the token in a cookie and sends it to the client.
##### v0.0.15-k: Use regular expressions to verify email format and password length when users and managers register, and make correct prompts.