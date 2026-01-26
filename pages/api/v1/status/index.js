import database from "infra/database.js";
import { Client } from "pg";
import { version } from "react";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVesionResult = await database.query("SHOW server_version;");
  const databaseVesionValue = databaseVesionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("show max_connections;");
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVesionValue,
        max_connections: parseInt(maxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
