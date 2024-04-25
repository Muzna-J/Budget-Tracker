require("dotenv").config();
require("./db");
const express = require("express");
const app = express();
require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const incomeRoutes = require("./routes/income.routes");
app.use("/income", incomeRoutes);

const expenseRoutes = require("./routes/expense.routes");
app.use("/expense", expenseRoutes);

const categoryRoutes = require("./routes/category.routes");
app.use("/category", categoryRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use('/profile', profileRoutes);


require("./error-handling")(app);

module.exports = app;


