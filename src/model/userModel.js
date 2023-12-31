const Pool = require("../config/db")

const selectAllUsers = () => {
  return Pool.query(`SELECT * FROM users`)
}

const selectCreationDate = (queryId) => {
  return Pool.query(`SELECT creation_date FROM users WHERE id='${queryId}'`)
}

const selectWithdrawalUser = (queryId) => {
  return Pool.query(`SELECT SUM(amount) AS "Total Withdrawal" FROM users INNER JOIN withdrawals ON users.id = withdrawals.user_id WHERE users.id='${queryId}'`)
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

const updateUserBalance = (queryObject) => {
  const { queryId } = queryObject
  return Pool.query(
    `UPDATE users
    SET balance = (
      SELECT COALESCE(
          (SELECT SUM(pickups.balance)
          FROM pickups
          WHERE pickups.user_id = '${queryId}' AND pickups.status = 'success')
          ,0
      )
      -
      COALESCE(
          (SELECT SUM(withdrawals.amount)
          FROM withdrawals
          WHERE withdrawals.user_id = '${queryId}')
          ,0
      )
    )
     WHERE users.id = '${queryId}'`
  );
}

const updatePasswordUser = (queryObject) => {
  const { queryId, queryPwd} = queryObject
  return Pool.query(
    `UPDATE users SET password='${queryPwd}'` +
    `WHERE id='${queryId}'`
  );
}

const updateUser = (queryObject) => {
  const { queryId, name, queryFilename, queryPwd} = queryObject
  return Pool.query(
    `UPDATE users SET name='${name}', password='${queryPwd}',` +
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
  selectCreationDate,
  selectWithdrawalUser,
  insertUser,
  updateUser,
  updatePasswordUser,
  updateUserBalance,
  deleteUser,
}