# TimeTide
[Link to Postman Backend Documentation](https://documenter.getpostman.com/view/28802704/2sA35BbPtc)</br>
[Link to all diagrams](https://documenter.getpostman.com/view/28802704/2sA35BbPtc)

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
4. Set up environment variables in a `.env` file(Required)
5. Start the server using `npm run dev`(Path:backend).

## Setting enviroment variables

- `PORT`: (Specify the port number your server will run on)
- `MONGOSTRING`: "mongodb+srv:// "
- `JWT_SECRET`: (Specify your JWT secret key)
- `ADMIN_USERNAME`: (Specify admin username)(only for First time use)
	- Refer `POST : /v1/auth/register` in Documentation
	- remove this enviroment varaible after use
	- you can have many admins but specify them like this first to add another admin
- `ADMIN_PASSWORD`: (Specify admin password)(onlyfor First time use)

## Usage

After installation, you can use the following endpoints:

POSTMAN BACKEND DOCUMENTATION : [Link to Postman Backend Documentation]([>>](https://documenter.getpostman.com/view/28802704/2sA35BbPtc)) 

- `/v1/api`: Endpoints for CRUD operations on timetables and related resources.
- `/v1/auth`: Endpoints for user authentication operations.
- `/v1/generate`: Endpoints for generating services related to timetables.
- `/v1/notifications`: Endpoints for handling notifications.

Ensure you have proper authentication tokens to access protected endpoints.

## Problems

Problems that have been addressed:

1. MongoDB schema designing: circular reference between tables
		FIX: Mongodb Schema is loosely coupled
2. MongoDB schema designing: circular reference between tables
		FIX: Mongodb Schema is loosely coupled

## Contributing

Contributions to TimeTide are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Test your changes thoroughly.
5. Submit a pull request.

## License

TimeTide is licensed under the ISC License. See [LICENSE](LICENSE) for more information.

## Contact

For any inquiries or assistance, feel free to contact the project maintainer:

- Name: Lakshan S N
- Email: [inbox.nadun@gmail.com](mailto:inbox.nadun@gmail.com)
- GitHub: [github.com/nxdun](https://github.com/nxdun)


## Requirements

```json
{
  "name": "timetide",
  "version": "1.0.0",
  "description": "backend API for seamlessly managing university timetables",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "author": "lakshan s n",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.4.5",
    "express": "^4.18.3",
    "express-jwt": "^8.4.1",
    "express-rate-limit": "^7.2.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.5.0",
    "mongoose": "^8.2.2",
    "pino-multi-stream": "^6.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "pino": "^8.19.0",
    "pino-pretty": "^10.3.1"
  }
}
```