const db = require("../../config/MySQL_DB_Config");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const middleware = require("../../middleware/verifyToken");

const JWT_KEY = process.env.JWT_SECRET_KEY;

async function signup_controller(req, res) {
  try {
    const data = req.body;
    const query = `INSERT INTO user (id, password, name, email, phone, state, gender, department, college) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const userInsertResult = await db.query(query, [
      data.id,
      data.password,
      data.name,
      data.email,
      data.phone,
      data.state,
      data.gender,
      data.department,
      data.college,
    ]);

    if (userInsertResult[0].affectedRows > 0) {
      if (data.register_plan != -1) {
        const registeredUsersInsertResult = await db.query(
          "INSERT INTO registered_users (id, register_plan, transaction_id) VALUES (?, ?, ?)",
          [data.id, data.register_plan, data.transaction_id || null]
        );

        if (registeredUsersInsertResult[0].affectedRows > 0) {
          return res.json({
            code: 1,
            message: "Register successfully",
          });
        }
      }
        return res.json({
          code: 1,
          message:
            "Register successfully but failed to update transaction details",
        });
    } else {
      return res.json({
        code: 0,
        message: "Failed to register",
      });
    }
  } catch (e) {
    console.log("Error in signup: " + e.message);
    if (e.message.includes("Duplicate entry")) {
      if (e.message.includes("user.PRIMARY")) {
        return res.json({
          code: -1,
          message: "User already exists",
        });
      } else if (e.message.includes("registered_users.transaction_id")) {
        return res.json({
          code: 0,
          message: "User enrolled but this transaction id is already used by other user",
        });
      } else {
        return res.json({
          code: -1,
          message: "Your data is duplicated with another user",
        });
      }
    } else {
      return res.json({ code: -1, message: "Internal server error" });
    }
  }
}

// Login controller
async function login_controller(req, res) {
  try {
    const req_data = req.body;
    const query = `select * from user where id = ?`;
    await db
      .query(query, [req_data.id, req_data.password])
      .then((result) => {
        const data = result[0];
        if (data.length > 0) {
          const detail = data[0];
          if (detail.password === req_data.password) {
            const token = jwt.sign(
              {
                id: data[0].id,
                details: detail,
              },
              JWT_KEY
            );
            const temp = middleware.verifyToken(token);
            console.log(temp);
            return res.json({
              code: 1,
              message: "Login successfull",
              token: token,
            });
          } else return res.json({ code: 0, message: "Invalid credentials" });
        } else
          return res.json({
            code: 0,
            message: "User not found",
          });
      })
      .catch((e) => {
        console.log("Error in sql query exce login: " + e.message);
        return res.json({ code: -1, message: "Internal server error" });
      });
  } catch (e) {
    console.log("Error in login: " + e.message);
    return res.json({ code: -1, message: "Internal server error" });
  }
}

async function tokenAuthController(req, res) {
  try {
    const data = req.body;
    const token = req.body.token
    const temp = middleware.verifyToken(token);
    if (temp.code == 1) {
      const details = temp.details
      const username = details.id
      return res.json({
        code: 1,
        temp:temp.details,
        data: {
          id: username,
          mail: temp.mail,
          name: temp.name
      } });
    }
    else
      return res.json(temp)
  } catch (e) {
    console.log("Error in token auth: " + e.message);
    return res.json({ code: -1, message: "Internal server error" });
  }
}

module.exports = {
  signup_controller,
  login_controller,
  tokenAuthController
};
