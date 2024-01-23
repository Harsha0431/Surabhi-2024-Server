const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');


app.use(express.json());
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());

require('dotenv').config()

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`listening on port ${PORT}`);
});


const login_router = require('./routes/Login/login_router')
const list_router = require('./routes/List/list_route')

app.use('/api', login_router)

app.use('/api/list' , list_router)