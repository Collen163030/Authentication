const express = require('express');

const app = express();

//Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));