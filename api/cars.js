const fs = require('fs').promises;
const path = require('path');

module.exports = async function (context, req) {
    try {
        if (req.method === 'GET') {
            // Get the path to the cars.json file
            const carsFilePath = path.resolve(__dirname, '../cars.json');

            // Read the current cars array from the cars.json file
            let cars = await fs.readFile(carsFilePath, 'utf-8');
            cars = JSON.parse(cars);

            context.res = {
                status: 200,
                body: { success: true, cars: cars }
            };
        } else {
            context.res = {
                status: 405,
                body: { success: false, message: 'Method Not Allowed' }
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: { success: false, message: 'Internal Server Error' }
        };
    }
};
