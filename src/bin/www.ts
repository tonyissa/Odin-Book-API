#!/usr/bin/env node
import dotenv from 'dotenv';
import app from '../app.js';
import serverDebug from 'debug';
import http from 'http';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';

/**
 * Module dependencies.
 */
dotenv.config();
const debug = serverDebug('Odin-Book-API');

if (!process.env) {
  throw new Error('Environmental variables not initialized')
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on('connection', (ws, req) => {
    const id = req.url!.slice(1);
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata)

    ws.on('error', console.error);
    
    ws.on('message', (data: string) => {
        const body = JSON.parse(data);
        body.sender = id;
        body.color = color;
        body.id = randomUUID();
        
        const outbound = JSON.stringify(body);
        [...clients.keys()].forEach(client => {
            client.send(outbound);
        })
    })
    
    ws.on("close", () => {
        clients.delete(ws);
      });
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr: any = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}