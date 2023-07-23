const Pool = require("../config/db")

const selectAllPickups = () => {
  return Pool.query(`SELECT * FROM pickups`)
}

const selectDetailPickup = (queryId) => {
  return Pool.query(`SELECT * FROM pickups WHERE id='${queryId}'`)
}

const insertPickup = (queryObject) => {
  const { queryId, address, user_id, time } = queryObject
  return Pool.query(
    `INSERT INTO pickups(id, address, user_id, time)` +
    `VALUES('${queryId}', '${address}', '${user_id}', '${time}')`
  );
}

const updatePickup = (queryObject) => {
  const { queryId, address, time} = queryObject
  return Pool.query(
    `UPDATE pickups SET address='${address}', time='${time}'` +
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