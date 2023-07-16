const Pool = require("../config/db")

const selectAllWithdrawals = () => {
  return Pool.query(`SELECT * FROM withdrawals`)
}

const selectDetailWithdrawal = (queryId) => {
  return Pool.query(`SELECT * FROM withdrawals WHERE id='${queryId}'`)
}

const insertWithdrawal = (queryObject) => {
  const { queryId, amount, user_id } = queryObject
  return Pool.query(
    `INSERT INTO withdrawals(id, amount, user_id)` +
    `VALUES('${queryId}', ${amount}, '${user_id}')`
  );
}

const updateWithdrawal = (queryObject) => {
  const { queryId, amount, user_id } = queryObject
  return Pool.query(
    `UPDATE withdrawals SET amount=${amount}, user_id='${user_id}'` +
    `WHERE id='${queryId}'`
  );
}

const deleteWithdrawal = (queryId) => {
  return Pool.query(`DELETE FROM withdrawals WHERE id='${queryId}'`)
}

module.exports = {
  selectAllWithdrawals,
  selectDetailWithdrawal,
  insertWithdrawal,
  updateWithdrawal,
  deleteWithdrawal
}