const Pool = require("../config/db")

const selectAllTrashes = () => {
  return Pool.query(`SELECT * FROM trashes`)
}

const selectDetailTrash = (queryId) => {
  return Pool.query(`SELECT * FROM trashes WHERE id='${queryId}'`)
}

const insertTrash = (queryObject) => {
  const { queryId, description, type, weight, photo, pickup_id } = queryObject
  return Pool.query(
    `INSERT INTO trashes(id, description, type, weight, photo, pickup_id)` +
    `VALUES('${queryId}', '${description}', '${type}', '${weight}', '${photo}', '${pickup_id}')`
  );
}

const updateTrash = (queryObject) => {
  const { queryId, description, type, weight } = queryObject
  return Pool.query(
    `UPDATE trashes SET description='${description}', type='${type}', weight='${weight}'` +
    `WHERE id='${queryId}'`
  );
}

const deleteTrash = (queryId) => {
  return Pool.query(`DELETE FROM trashes WHERE id='${queryId}'`)
}

module.exports = {
  selectAllTrashes,
  selectDetailTrash,
  insertTrash,
  updateTrash,
  deleteTrash
}