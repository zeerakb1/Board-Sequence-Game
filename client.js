const ws = new WebSocket(`ws://localhost:8080`);

const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  const [cards, setCards] = React.useState([]);
  const [color, setColor] = React.useState('color ');
  const [currentPlayer, setPlayer] = React.useState(1);
  const [deck, setDeck] = React.useState([]);
  const [textBox, setTextBox] = React.useState("Add message here");



  let diamondSign = "♦";
  let heartSign = "♥";
  let spadesSign = "♠";
  let clubsSign = "♣";


  ws.onopen = () => {
    console.log('Helloooooooo!!!!')
  };

  ws.onmessage = (event) => {

    let server_msg = JSON.parse(event.data);
    let mtype = server_msg['mtype'];

    if (server_msg.type == "newboard") {
      let c = 'color '
      let b = server_msg['board'];
      let p = server_msg['positionBoard'];
      let d = server_msg['deck'];
      c += server_msg['color'];
      let cl = server_msg['client'];
      setPlayer(cl);
      setPositionBoard(p);
      setDeck(d);
      setColor(c);
      setBoard(b);
    } else if (mtype == "NewPositionBoard") {
      
      let positionBoard = server_msg['positionBoard'];
      setPositionBoard(positionBoard);
    } else if (mtype == "NewDeck") {
      
      let newdeck = server_msg['deck'];
      setDeck(newdeck);
    } else if (server_msg['msg'] == "Coin already placed here") {
      setTextBox(server_msg['msg']);
    }
    else if (mtype == "clientMessage") {

      setTextBox(server_msg['msg']);
    } 
    else if (mtype == "UpdatedDeck") {
      let newdeck = server_msg['deck'];
      setDeck(newdeck);
    }
  };

  const checkValidMove = (value, r, col) => {
    let check = false;
    for(let i = 0; i < deck.length; i++){
      if(deck[i] == value){
        check = true;
      }
    }
    let obj = {
      clientID: currentPlayer,
      row: r,
      column: col,
      mtype: "takeTurn",
      card: value,
    };
    ws.send(JSON.stringify(obj));

  }
  ws.onclose = function () {};

  const getValue = (value) => {
    let z = 0;
    for(let i = 0; i < value.length; i++){
      if(value[i] == '-'){
        z = i + 1;
        break;
      }
    }
    if(value[z + 1] == " "){
      return value[z];
    }
    else {
      return (value[z] + value[z + 1]);
    }
  
  }

  const getSymbol = (value) => {
    let x = value.split(" ");
    // console.log(x)
    let len = x.length - 1;
    // console.log(len)
    if(x[len] == "spades"){
      return spadesSign;
    }
    else if(x[len] == "clubs"){
      return clubsSign;
    }
    else if(x[len] == "hearts"){
      return heartSign;
    }
    else if(x[len] == "diams"){
      return diamondSign;
    }
  }

  const checkJack = (value) => {
    console.log(value);
  }
  
  let suit = "suit";
  let rank = "rank";

  return (
    <div>
      <div class="container">
        {board.map((value, valueID) => 
        (
          <div class="playingCards fourColours rotateHand">
            <ul class="table">
              {
              value.map((data, index) => {
                let pos_value = positionBoard[index][valueID];
                let temp = data.split(' ');
                let card = temp[0];
                let back = temp[1];
                if(card == 'card' && back == 'back'){
                  return (
                     <div>
                       <li>
                        <div class="card back"><span class={rank}></span></div>
                       </li>
                     </div> 
                  );
                }
                else if(pos_value == "b"){
                  return (<div>
                    <li>
                      <div className="card"><div className="blue"></div></div>
                    </li>
                  </div>)
                }
                else if(pos_value == "g"){
                  return (<div>
                    <li>
                      <div className="card"><div className="green"></div></div>
                    </li>
                  </div>)
                }
                else {
                  return (<div>
                    <li>
                     <div class={data} onClick={() => checkValidMove(data, index, valueID)}>
                       <span class={rank}>{getValue(data)}</span> <span class={suit}>{getSymbol(data)}</span>
                     </div>
                    </li>
                  </div>)
                }
              }
              )}
            </ul>
          </div>
        ))}
      </div>

      <div class="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        {
          <div class="playingCards fourColours rotateHand">
            <ul class="table">
              {deck.map((val, valID) => 
              {
                checkJack(val);
                let card_value = getValue(val);
                let symbol = getSymbol(val);
                return (
                <li>
                  <a class={val}>
                    <span class={rank}>{card_value}</span>
                    <span class={suit}>{symbol}</span>
                  </a>
                </li>
                );
              }
              )}
            </ul>
          </div>
        }
        <div className="text_box"> {textBox} </div>
        <div className={color}></div>
      </div>
    </div>
  );
};

ReactDOM.render(<Sequence />, document.querySelector(`#root`));
