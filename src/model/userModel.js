const Pool = require("../config/db")

const selectAllUsers = () => {
  return Pool.query(`SELECT * FROM users`)
}

const selectDetailUser = (queryId) => {
  return Pool.query(`SELECT * FROM users WHERE id='${queryId}'`)
}

const selectUserByEmail = (queryEmail) => {
  return Pool.query(`SELECT * FROM users WHERE email='${queryEmail}'`)
}

const insertUser = (queryObject) => {
  const { queryId, name, email, queryPwd, role} = queryObject
  let roleQuery = ""
  let roleInsert = ""
  if(role){
    roleQuery = `, '${role}'`
    roleInsert = `, role`
  }
  return Pool.query(
    `INSERT INTO users(id, name, email, password ${roleInsert})` +
    `VALUES('${queryId}', '${name}', '${email}', '${queryPwd}' ${roleQuery})`
  );
}

const updateUser = (queryObject) => {
  const { queryId, name, queryFilename} = queryObject
  return Pool.query(
    `UPDATE users SET name='${name}',` +
    `photo='${queryFilename}' WHERE id='${queryId}'`
  );
}

const deleteUser = (queryId) => {
  return Pool.query(`DELETE FROM users WHERE id='${queryId}'`)
}

module.exports = {
  selectAllUsers,
  selectDetailUser,
  selectUserByEmail,
  insertUser,
  updateUser,
  deleteUser,
}