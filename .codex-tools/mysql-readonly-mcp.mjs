import mysql from 'mysql2/promise';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const config = {
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 4,
  namedPlaceholders: true,
};

const pool = mysql.createPool(config);

const server = new Server(
  {
    name: 'mysql-readonly',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

function rejectUnsafeSql(sql) {
  const normalized = sql.trim().replace(/\/\*[\s\S]*?\*\//g, ' ');

  if (!/^(select|show|describe|desc|explain)\b/i.test(normalized)) {
    throw new Error('Only read-only SQL is allowed: SELECT, SHOW, DESCRIBE, DESC, EXPLAIN.');
  }

  if (/\b(insert|update|delete|replace|alter|drop|truncate|create|rename|grant|revoke|set|use|lock|unlock|call|load)\b/i.test(normalized)) {
    throw new Error('Unsafe SQL keyword detected. This MCP server is read-only.');
  }

  if (normalized.includes(';') && normalized.replace(/;\s*$/, '').includes(';')) {
    throw new Error('Multiple SQL statements are not allowed.');
  }
}

function textResult(value) {
  return {
    content: [
      {
        type: 'text',
        text: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
      },
    ],
  };
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'mysql_query',
      description: 'Run a read-only SQL query against the configured MySQL database.',
      inputSchema: {
        type: 'object',
        properties: {
          sql: {
            type: 'string',
            description: 'Read-only SQL. Allowed: SELECT, SHOW, DESCRIBE, DESC, EXPLAIN.',
          },
          params: {
            type: 'array',
            description: 'Optional positional parameters for prepared statements.',
            items: {},
          },
        },
        required: ['sql'],
      },
    },
    {
      name: 'mysql_list_tables',
      description: 'List tables in the configured MySQL database.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'mysql_describe_table',
      description: 'Describe columns for a table in the configured MySQL database.',
      inputSchema: {
        type: 'object',
        properties: {
          table: {
            type: 'string',
            description: 'Table name.',
          },
        },
        required: ['table'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  if (name === 'mysql_list_tables') {
    const [rows] = await pool.query('SHOW TABLES');
    return textResult(rows);
  }

  if (name === 'mysql_describe_table') {
    const table = String(args.table ?? '');
    if (!/^[A-Za-z0-9_]+$/.test(table)) {
      throw new Error('Invalid table name.');
    }

    const [rows] = await pool.query(`DESCRIBE \`${table}\``);
    return textResult(rows);
  }

  if (name === 'mysql_query') {
    const sql = String(args.sql ?? '');
    rejectUnsafeSql(sql);

    const [rows] = await pool.execute(sql, Array.isArray(args.params) ? args.params : []);
    return textResult(rows);
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
