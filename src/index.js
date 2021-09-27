require('dotenv').config();
const express = require('express');
const routers = require('./routers/routes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(routers);

app.listen(process.env.PORT);

