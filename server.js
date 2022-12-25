const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`); // npm i ws

const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];

const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  console.log(result);
  return result;
};

// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// code to create a server
const server = http.createServer(async (req, resp) => {
  console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});

// to listen for clients
server.listen(8000);

const wss = new WebSocket.Server({ port: 8080 });




const clients = new Map();
let clientID = 0;
let divDeck = divideDeckIntoPieces(deck);
let curr_turn = 1;
let total_turn = 0;
let sent = false;
let count = 4;
let num_of_moves = 0;
wss.on("connection", (ws) => {
  
  clientID = clientID + 1;
  clients.set(ws, clientID);

  let num_of_cleints = 0;
  if (clientID == 4) {
    for (let client of clients.keys()) {
      let new_obj = {
        deck: divDeck[num_of_cleints],
        mtype: "NewGame",
        color: checkColor(num_of_cleints),
        client: clients.get(client),
        board: board,
        type: "newboard",
        positionBoard: positionBoard,
      };

      num_of_cleints = num_of_cleints + 1;
      client.send(JSON.stringify(new_obj));
    }
    clientMessage("Take your turn", 1);
  }

  ws.on("message", (client_msg) => {
    let message = JSON.parse(client_msg.toString());

    let check_win = false;
    if (message['mtype'] == "takeTurn") {
      let c_RC = checkRC(message['row'], message['column']);
      if (curr_turn == message['clientID']) {
        let deck_index = curr_turn - 1;
        if(sent == true){
          deck_index += count;
        }
        let card = message['card'];
        let pr = false;
        pr = checkValidCard(divDeck[deck_index], card);

        let check = checkJack(divDeck[deck_index]);

        if (pr == true || check == true) {
          let newdeck = [];
          let once = false;
          if(check === true && c_RC === false && pr === false){
            for (let i = 0; i < divDeck[deck_index].length; i++) {
              if (retJack(divDeck[deck_index][i]) && once == false) {
                once = true;
              } else {
                newdeck.push(divDeck[deck_index][i]);
              }
            }
          }
          else if(check === false && pr === true){
            for (let i = 0; i < divDeck[deck_index].length; i++) {
              if (divDeck[deck_index][i] == card) {
              } else {
                newdeck.push(divDeck[deck_index][i]);
              }
            }
          }
          else if(check === true && pr === true){
            for (let i = 0; i < divDeck[deck_index].length; i++) {
              if (divDeck[deck_index][i] == card) {
              } else {
                newdeck.push(divDeck[deck_index][i]);
              }
            }
          }
          else if(check == true && c_RC == true){
            clientMessage("Coin already placed here", message['clientID']);
          }
          positionBoard[message['row']][message['column']] = deck_index % 2 == 0 ? "g" : "b";
          divDeck[deck_index] = newdeck;
          let total = 0;

          for (let client of clients.keys()) {
            if (clients.get(client) == curr_turn) {
              let new_obj = { 
                deck: newdeck,
                mtype: "NewDeck",
                type: "game"
              };
              client.send(JSON.stringify(new_obj));
            }
            let new_obj = { 
              positionBoard: positionBoard, 
              mtype: "NewPositionBoard" ,
              type: "game"
            };
            client.send(JSON.stringify(new_obj));
          }

          let res = findWinner();
          if(res == true){
            console.log('clients', message['clientID'], 'curr_turn', curr_turn);
            let t = message['clientID'];
            if(t % 2 == 0 && t == 2){
              curr_turn = -10;
              winMessage("You win!", message['clientID'], 4);
              return;
            }
            else if(t % 2 == 0 && t == 4){
              curr_turn = -10;
              winMessage("You win!", message['clientID'], 2);
              return;
            }
            else if(t % 2 != 0 && t == 3){
              curr_turn = -10;
              winMessage("You win!", message['clientID'], 1);
              return;
            }
            else if(t % 2 != 0 && t == 1){
              curr_turn = -10;
              winMessage("You win!", message['clientID'], 3);
              return;
            }
          }

          curr_turn += 1;
          num_of_moves += 1;
          curr_turn = curr_turn % 5;
          if (curr_turn == 0) {
            curr_turn += 1;
          }
          if(divDeck[deck_index].length == 0 && curr_turn == 1 && sent == false){
            let count = 4;
            for (let client of clients.keys()) {
              let obj = {
                deck: divDeck[count],
                mtype: "UpdatedDeck",
              };
              count++;
              client.send(JSON.stringify(obj));
            }
            sent = true;
            total_turn = total_turn + 1;
            clientMessage("Take your turn", curr_turn);
          }
          console.log('moves', num_of_moves);
          if(num_of_moves >= 48 && res != true){
            for (let client of clients.keys()) {
              let obj = {
                mtype: "clientMessage", 
                msg: "Draw!"
              };
              client.send(JSON.stringify(obj));
            }
          }
          else {
            clientMessage("Take your turn", curr_turn);
          }

          clientMessage("Take your turn", curr_turn);
        } 
        else if(c_RC == true){
          clientMessage("Coin already placed here", message['clientID']);
        }
        
        else {
          clientMessage("Invalid move", message['clientID']);
        }
      } else {
        clientMessage("Wait for your turn", message['clientID']);
      }
    }
  });
});


function clientMessage(message, curr_turn) {
  console.log(curr_turn);
  let obj = {
    mtype: "clientMessage", 
    msg: message 
  };
  let client = '';
  for (let [key, value] of clients.entries()) {
    if (value === curr_turn){
      client = key;
    }
  }
  client.send(JSON.stringify(obj));
}


function winMessage(message, curr_turn1, curr_turn2) {
  let obj = {
    mtype: "clientMessage", 
    msg: message 
  };
  let client1 = '';
  let client2 = '';
  for (let [key, value] of clients.entries()) {
    if (value === curr_turn1){
      client1 = key;
    }
    if (value === curr_turn2){
      client2 = key;
    }
  }
  client1.send(JSON.stringify(obj));
  client2.send(JSON.stringify(obj));
}

checkColor = (c) => {
  if(c % 2 == 0) {
    return 'green';
  }
  else {
    return 'blue';
  }
}

const checkJack = (c_deck) => {
    for(let i = 0; i < c_deck.length; i++){
      let t = c_deck[i].split('-');
      if(t[1][0] == 'j'){
        return true;
      }
    }
    return false;
}

const retJack = (c_deck) => {
  let t = c_deck.split('-');
  if(t[1][0] == 'j'){
    return true;
  }
  return false;
}

const checkRC = (row, col) => {
  if(positionBoard[row][col] == 'g' || positionBoard[row][col] == 'b'){
    return true;
  }
  return false;
}


const findWinner = () => {
  let win = false;
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      if(positionBoard[i][j] != '-'){
        console.log(win);
        if(positionBoard[i][j] == 'g'){
          win = winCondition('g', i, j);
          if(win == true){
            return true;
          }
        }
        else {
          win = winCondition('b', i, j);
          if(win == true){
            return true;
          }
        }
      }
    }
  }
  return false;
}


const winCondition = (val, row, col) => {
  if((row + 4) < 10){
    if((positionBoard[row][col] == val) && (positionBoard[row+1][col] == val) && (positionBoard[row+2][col] == val) && (positionBoard[row+3][col] == val) && (positionBoard[row+4][col] == val)){
      return true;
    }
  }

  if((col + 4) < 10) {
    if((positionBoard[row][col] == val) && (positionBoard[row][col+1] == val) && (positionBoard[row][col+2] == val) && (positionBoard[row][col+3] == val) && (positionBoard[row][col+4] == val)){
      return true;
    }
  }

  if((row - 4) > -1 && ((col + 4) < 10)){
    if((positionBoard[row][col] == val) &&  (positionBoard[row - 1][col + 1] == val) && (positionBoard[row - 2][col + 2] == val) && (positionBoard[row - 3][col + 3] == val) && (positionBoard[row - 4][col + 4] == val)){
      return true;
    }
  }

  if(((row + 4) < 10) && ((col + 4) < 10)){
    if((positionBoard[row][col] == val) && (positionBoard[row + 1][col + 1] == val) && (positionBoard[row + 2][col + 2] == val) && (positionBoard[row + 3][col + 3] == val) && (positionBoard[row + 4][col + 4] == val)){
      return true;
    }
  }
  return false;
}

const checkValidCard = (deck_list, card) => {
  for(let i = 0; i < deck_list.length; i++){
    if(deck_list[i] == card){
      return true;
    }
  }
  return false;
}
