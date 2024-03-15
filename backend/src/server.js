const express = require('express');

const app = express();
const port = 3009;

app.get('/', (req, res) => {
    //sample response
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});