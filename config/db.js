const { Pool } = require('pg')

try {
  const pool = new Pool()

  console.log(`Database is connected`.bgYellow.black.bold)

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  module.exports = pool
} catch (e) {
  console.log(e.stack)
}
