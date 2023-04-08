const socket = io('https://play.discosea.com:3100');

// Find the HTML elements to display client IDs
let localClientEl = document.getElementById('local-client');
if (!localClientEl) {
  localClientEl = document.createElement('h4');
  localClientEl.id = 'local-client';
  document.body.insertBefore(localClientEl, document.body.firstChild);
}

let remoteClientsEl = document.getElementById('remote-clients');
if (!remoteClientsEl) {
  remoteClientsEl = document.createElement('div');
  remoteClientsEl.id = 'remote-clients';
  document.body.appendChild(remoteClientsEl);
}

socket.on('connect', () => {
  console.log('Connected to the server');
  const localClientId = socket.id;
  localClientEl.textContent = `Local client ID: ${localClientId}`;
});

socket.on('connectedClients', (connectedClients) => {
  console.log('Connected clients:', connectedClients);
  remoteClientsEl.innerHTML = '';
  connectedClients.forEach((client) => {
    if (client.socketId !== socket.id) {
      let clientEl = document.getElementById(client.socketId);
      if (!clientEl) {
        clientEl = document.createElement('h4');
        clientEl.id = client.clientId;
        remoteClientsEl.appendChild(clientEl);
      }
      clientEl.textContent = `Remote client ID: ${client.socketId}`;
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
