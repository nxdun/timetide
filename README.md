
#  🧭TimeTide 


⭐ [Link to API Documentation](https://documenter.getpostman.com/view/28802704/2sA35BbPtc)</br>
⭐ [Link to all diagrams](https://rentry.co/diagramsforaf)</br>
⭐ [security test results](https://rentry.co/burptestresults)

## Table of Contents

- [🧭TimeTide](#timetide)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Installation](#installation)
  - [How-to-Run-Tests](#how-to-run-tests)
  - [Setting-enviroment-variables](#setting-enviroment-variables)
  - [Usage](#usage)
  - [Problems-Faced](#problems-faced)
  - [Security-Test](#security-test)
  - [License](#license)
  - [Contact](#contact)
## Description

TimeTide is a backend API designed for seamlessly managing university timetables. It provides
- Endpoints for CRUD operations on various resources related to timetables
- Endpoints for user authentication operations
- Endpoints for generating services related to timetables
- Endpoint for Notification handler
...

## Installation

To install TimeTide, follow these steps:

1. Clone the repository from GitHub.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Set up environment variables in a `.env` file (Place .env File On Backend Folder)
5. Start the server using `npm run dev`(Path:backend).

## How-to-Run-Tests
- Clone the repository from GitHub
- `cd backend`:go to Backend folder
- Create `.env` File in there  and set all enviroment variables
- `npm install `:install all packages (Testing libraries are on Developement dependacies)
-  `npm run test1 `:Runs all Unit Tests
-  `npm run test2 `:Runs all Unit + Intergration Tests

## Setting-enviroment-variables

- `PORT`: (Specify the port number your server will run on)
- `MONGOSTRING`: "mongodb+srv:// "
- `JWT_SECRET`: (Specify your JWT secret key)
- `ADMIN_USERNAME`: (Specify admin username)(only for First time use)
	-  Refer `POST : /v1/auth/register` in [📖 Documentation ](https://documenter.getpostman.com/view/28802704/2sA35BbPtc)
	- remove this enviroment varaible after use
	- you can have many admins but specify them like this first to add another admin
- `ADMIN_PASSWORD`: (Specify admin password)(onlyfor First time use)


## Usage

After installation, you can use the following endpoints:

POSTMAN BACKEND DOCUMENTATION : [Link to Postman Backend Documentation]([>>](https://documenter.getpostman.com/view/28802704/2sA35BbPtc)) 

- 🔒`/v1/api`: Endpoints for CRUD operations on timetables and related resources.
- 🔓`/v1/auth`: Endpoints for user authentication operations.
- 🔒`/v1/generate`: Endpoints for generating services related to timetables.
- 🔒`/v1/notifications`: Endpoints for handling notifications.

Ensure you have proper authentication tokens to access protected endpoints.


## Problems-Faced

Problems that have been addressed:

1. MongoDB schema designing: circular reference between tables(Booking and Courses)</br>
		FIX: Removed Object Refereence From Courses (Not Required, Easily recreated Project Thanks to loosely Coupled design)
2. Chai-http wont Run on Common js module</br>
		FIX: Used supertest For Intergration Testing


## Security-Test

Used Burp Suite to Check Security vulnerability
- Found out TimeTide is vulnerable for XSS attacks</br>
FIX:
	- `npm install helmet` : installed helmet npm package and set important security headers "`X-XSS-Protection: 1; mode=block`,`X-Content-Type-Options: nosniff`, `Strict-Transport-Security: max-age=63072000; includeSubDomain`...)
- Found out TimeTide is vulnerable for DOS attacks</br>
FIX:
	- `npm install express-rate-limit` : installed express rate limiter package and limited , this rate limiter configuration allows up to `100` requests per IP address every `15` minutes. If a client exceeds this limit, they will receive a "Service Unavailable" response


## License

TimeTide is licensed under the ISC License. See [LICENSE](LICENSE) for more information.

## Contact

For any inquiries or assistance, feel free to contact the project maintainer:

- Name: Lakshan S N
- Email: [inbox.nadun@gmail.com](mailto:inbox.nadun@gmail.com)
- GitHub: [github.com/nxdun](https://github.com/nxdun)

