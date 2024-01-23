const db = require('../../config/MySQL_DB_Config')


async function getLoginAllLists(req, res) {
    try {
        const departmentList = await db.query('select name from department')

        const stateList = await db.query('select name from states')

        const collegeList = await db.query('select name from college')

        const registerList = await db.query("select * from register_plan");

        return res.json({
            code: 1,
            data: {
                department: departmentList[0] ,
                college: collegeList[0] ,
                register: registerList[0] ,
                state: stateList[0],
            }
        })
    } catch (e) {
        console.log("Error in getting all list due to: " + e.message);
        return res.json({ code: -1, message: "Internal server error" });
    }
}



async function getDepartmentList(req, res) {
    
}

async function getStateList(req, res) {
    
}

async function get_register_plan_list(req, res) {
    
}

async function get_college_list(req, res) { }




module.exports = {
    getDepartmentList,
    getStateList,
    get_register_plan_list,
    get_college_list,
    getLoginAllLists
}