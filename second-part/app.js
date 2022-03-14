(function() {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsSendButton = document.querySelector('#wsSendButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');
  const getUsers = document.querySelector('#getUsers');

  const input_login = document.getElementById("input_login");
  const input_password = document.getElementById("input_password");

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  function handleResponse(response) {
    return response.ok
      ? response.json().then((data) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  }

  login.onclick = function() {
    fetch('/api/login', { method: 'POST', credentials: 'same-origin', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({user_name: input_login.value, user_password:  input_password.value})})
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {
        showMessage(err.message);
      });
  };

  logout.onclick = function() {
    fetch('/api/logout', { method: 'GET', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {
        showMessage(err.message);
      });
  };

  let ws;

  wsButton.onclick = function() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onerror = function() {
      showMessage('WebSocket error');
    };
    ws.onopen = function() {
      showMessage('WebSocket connection established');
    };
    ws.onclose = function() {
      showMessage('WebSocket connection closed');
      ws = null;
    };
    ws.onmessage = function(message){
      showMessage(message.data);
    }
  };

  wsSendButton.onclick = function() {
    if (!ws) {
      showMessage('No WebSocket connection');
      return;
    }

    ws.send('Hello World!');
    showMessage('Sent "Hello World!"');
  };
})();
