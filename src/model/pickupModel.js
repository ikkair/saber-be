const Pool = require("../config/db")

const selectAllPickups = () => {
  return Pool.query(`SELECT * FROM pickups ORDER BY time`)
}

const selectWaitingTrashes = (queryId) => {
  return Pool.query(`SELECT count(*) FROM trashes INNER JOIN pickups ON pickups.id=trashes.pickup_id WHERE pickups.id='${queryId}' AND trashes.status='waiting'`)
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

const updatePickupCourier = (queryObject) => {
  const { pickup_id, status} = queryObject
  return Pool.query(
    `UPDATE pickups SET status='${status}'` +
    `WHERE id='${pickup_id}'`
  );
}

const updatePickupBalance = (queryObject) => {
  const { queryId } = queryObject
  return Pool.query(
    `UPDATE pickups 
    SET balance=(SELECT SUM(trashes.weight * trash_types.amount)
    FROM trashes INNER JOIN trash_types ON trashes.type=trash_types.id
    WHERE trashes.pickup_id='${queryId}' AND trashes.status='accepted')
    WHERE EXISTS (SELECT 1 FROM trashes WHERE trashes.pickup_id='${queryId}' AND trashes.status='accepted')`
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
  selectWaitingTrashes,
  insertPickup,
  updatePickupBalance,
  updatePickup,
  updatePickupCourier,
  deletePickup
}