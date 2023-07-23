const Pool = require("../config/db")

const selectAllTrashTypes = () => {
  return Pool.query(`SELECT * FROM trash_types`)
}

const selectDetailTrashType = (queryId) => {
  return Pool.query(`SELECT * FROM trash_types WHERE id='${queryId}'`)
}

const insertTrashType = (queryObject) => {
  const { queryId, type, amount } = queryObject
  return Pool.query(
    `INSERT INTO trash_types(id, type, amount)` +
    `VALUES('${queryId}', '${type}', '${amount}')`
  );
}

const updateTrashType = (queryObject) => {
  const { queryId, type, amount } = queryObject
  return Pool.query(
    `UPDATE trash_types SET type='${type}', amount='${amount}'` +
    `WHERE id='${queryId}'`
  );
}

const deleteTrashType = (queryId) => {
  return Pool.query(`DELETE FROM trash_type WHERE id='${queryId}'`)
}

module.exports = {
  selectAllTrashTypes,
  selectDetailTrashType,
  insertTrashType,
  updateTrashType,
  deleteTrashType
}