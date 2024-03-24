/*
*   @desc: middleware to get user role from the database
*   @param: request, response, next
*   @return: JSON object
*/


const UserRoles = require('../models/userRolesSchema');
const logger = require('../config/logger.js');

async function getUserRole(req, res, next) {
    let userRole;
    try {
        userRole = await UserRoles.findOne({ username: req.body.username });

        if (!userRole) {
            //log params
            logger.error(`[getUserRole] User ${req.body.username} not found`);
            return res.status(404).json({ message: 'Sorry !! User  not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: ":[ Something bad happened please contact server admin" });
    }
    //set userRole to res so that it can be accessed in the next middleware
    res.userRole = userRole;
    next();
}

module.exports = getUserRole;