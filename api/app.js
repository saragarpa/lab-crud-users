require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const app = express();


/* DB init */
require('./config/db.config');

/* Middlewares */
app.use(express.json());
app.use(logger("dev")); 


/*API Routes Configuration*/
const routes = require("./config/routes.config");
app.use("/api/v1/", routes)



/*PORT Congiguration*/
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.info(`Application running at port ${port}`));