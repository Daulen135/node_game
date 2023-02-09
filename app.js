const fs = require('fs');
//Запросить http модуль
const http = require('http');

// Создать сервер
const server = http.createServer((request, response) => {

  const url = new URL(request.url, `http:${request.headers.host}`);

  switch(url.pathname) {
    case '/':
      if (request.method === 'GET') {
        const name = url.searchParams.get('name');
        console.log(name);

        response.writeHead(202, {'Content-Type': 'text/html'});
        fs.createReadStream('./index.html').pipe(response);
        break;
      } else if(request.method === 'POST') {
        handlePostResponse(request, response);
        break;
      }
      break;

    default:
      response.writeHead(404, {'Content-Type': 'text/html'});
      fs.createReadStream('./404.html').pipe(response);
      break;
  }
})

server.listen(4001, () => {
  console.log("Server is listening at " + server.address().port);
})

// Функция для управления POST ответами 
function handlePostResponse(request, response){
  request.setEncoding('utf8');
  
  // Получать chunks событий 'data и проведение конкатенации в тело переменной
  let body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });
 
 //После получения данных данные, выбираем случайный выбор для сервера
 // Сравниваем выбор сервера с выбором игрока и отправляем соответствующее сообщение в ответ
  
  request.on('end', function () {
    const choices = ['rock', 'paper', 'scissors'];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Aww, we tied! I also chose ${randomChoice}.`;
    const victory = `Dang it, you won! I chose ${randomChoice}.`;
    const defeat = `Ha! You lost. I chose ${randomChoice}.`;

    if (choice === randomChoice) {
      message = tied;
    } else if (
        (choice === 'rock' && randomChoice === 'paper') ||
        (choice === 'paper' && randomChoice === 'scissors') ||
        (choice === 'scissors' && randomChoice === 'rock')
    ) {
      message = defeat;
    } else {
      message = victory;
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(`You selected ${choice}. ${message}`);
  });
}