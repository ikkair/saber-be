const Pool = require("../config/db")

const selectAllPickups = () => {
  return Pool.query(`SELECT * FROM pickups`)
}

const selectDetailPickup = (queryId) => {
  return Pool.query(`SELECT * FROM pickups WHERE id='${queryId}'`)
}

const insertPickup = (queryObject) => {
  const { queryId, amount, user_id } = queryObject
  return Pool.query(
    `INSERT INTO pickups(id, amount, user_id)` +
    `VALUES('${queryId}', ${amount}, '${user_id}')`
  );
}

const updatePickup = (queryObject) => {
  const { queryId, amount, user_id } = queryObject
  return Pool.query(
    `UPDATE pickups SET amount=${amount}, user_id='${user_id}'` +
    `WHERE id='${queryId}'`
  );
}

const deletePickup = (queryId) => {
  return Pool.query(`DELETE FROM pickups WHERE id='${queryId}'`)
}

module.exports = {
  selectAllPickups,
  selectDetailPickup,
  insertPickup,
  updatePickup,
  deletePickup
}