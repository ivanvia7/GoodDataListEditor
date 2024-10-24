Automation Tool for Adding Contacts
Overview
This automation tool leverages Playwright to automate the process of logging into a web application and adding contacts based on a list of user IDs. The tool is designed to streamline the task of managing contacts efficiently and accurately.

Features
Automated Login: Logs into the web application using provided Google credentials.
Dynamic User ID Handling: Accepts a list of user IDs to be added, ensuring that no duplicates exist within the input list.
Error Handling: Provides logging for any issues encountered during the process.
Requirements
Node.js (version X.X.X or later)
Playwright
Apify SDK
Access to the web application with valid Google credentials
Installation
Clone this repository to your local machine:

bash
Copy code
git clone https://github.com/yourusername/repository-name.git
cd repository-name
Install the required dependencies:

bash
Copy code
npm install
Configuration
Before running the tool, make sure to configure the input parameters in the INPUT.json file. The following parameters are required:

startUrl: The URL to start the automation process.
userIDs: An array of user IDs that you want to add as contacts.
Important: One of the IDs included in this list must not duplicate any other ID already in your list. Ensure that each ID is unique to avoid conflicts during the addition of contacts.
GD_USER: Your Google account username for login.
GD_PWD: Your Google account password for login.
Example INPUT.json
json
Copy code
{
    "startUrl": "https://bizztreat.na.gooddata.com/analyze/#/b8wz5c18b3h74263vlo0aw1h5rlasox1/105661/edit",
    "userIDs": [
        { "id": "L3SQCzrXXymiRdD83" },
        { "id": "JR8MXya2qZx93sSaS" },
        { "id": "tbdN5nxesP9DpGF7d" }
    ],
    "GD_USER": "your.email@gmail.com",
    "GD_PWD": "yourpassword"
}
Usage
To run the automation tool, execute the following command in your terminal:

bash
Copy code
node src/main.js
Important Notes
Make sure that the user ID you are adding does not already exist in the system. The tool is designed to handle unique user IDs to prevent duplication.
If a user ID already exists in your list, the tool may log an error but will continue processing the remaining user IDs.
Logging
The tool provides detailed logs of the actions performed and any errors encountered. Check the console output for information on the success or failure of each operation.

Contributing
Feel free to submit issues or requests for enhancements. Contributions are welcome!

License
This project is licensed under the MIT License.
