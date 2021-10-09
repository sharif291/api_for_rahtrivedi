const express = require("express"); //Line 1
const app = express(); //Line 2
const fs= require('fs')
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 5000; //Line 3

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get("/:account", (req, res) => {
  let AccountNO = req.params.account;
  if (fs.existsSync(`./data/${AccountNO}.json`)) {
    try {
      // Get existing data
      let prevdata = fs.readFileSync(`./data/${AccountNO}.json`);
      // make existing data json to object
      let data = JSON.parse(prevdata);
      res.send(302, { status: "succesfull", data: data });
    } catch (err) {
      res.send(400, { status: "Failed", data: err });
    }
  } else {
    res.send(404, { status: "Success", data: "File not Found" });
  }
});
app.get("/:account/:ticket", (req, res) => {
  let AccountNO = req.params.account;
  let Ticket = req.params.ticket;
  if (fs.existsSync(`./data/${AccountNO}.json`)) {
    try {
      // Get existing data
      let prevdata = fs.readFileSync(`./data/${AccountNO}.json`);
      // make existing data json to object
      let data = JSON.parse(prevdata);
      let result = data.map((x) => x.Ticket === Ticket);
      res.send(302, { status: "succesfull", data: result });
    } catch (err) {
      res.send(400, { status: "Failed", data: err });
    }
  } else {
    res.send(404, { status: "Success", data: "File not Found" });
  }
});

app.post("/add", (req, res) => {
  // const fs = require("fs");
  // get requested data
  let requested_data = {
    AccountNO: req.body.AccountNO || "",
    magic: req.body.magic || "",
    _Comment: req.body._Comment || "",
    digits: req.body.digits || "",
    open_price: req.body.open_price || "",
    open_time: req.body.open_time || "",
    stop_loss: req.body.stop_loss || "",
    symbol: req.body.symbol || "",
    take_profit: req.body.take_profit || "",
    ticket: req.body.ticket || "",
    type: req.body.type || "",
    volume: req.body.volume || "",
    volume_balance: req.body.volume_balance || "",
    volume_equity: req.body.volume_equity || "",
  };
  if (requested_data.AccountNO === "" || requested_data.ticket === "") {
    res.send(400, { status: "Failed", data: "invalid Account No or Ticket" });
  } else {
    try {
      // IF FILE EXISTS
      if (fs.existsSync(`./data/${requested_data.AccountNO}.json`)) {
        // Get existing data
        let prevdata = fs.readFileSync(
          `./data/${requested_data.AccountNO}.json`
        );
        // make existing data json to object
        let data = JSON.parse(prevdata);

        //Find index of specific object using findIndex method.
        objIndex = data.findIndex((x) => x.ticket == requested_data.ticket);
        // IF DATA ALREADY IN FILE or NOT
        if (objIndex == -1) {
          // Add new object to the file
          data.push(requested_data);
        } else {
          //Update object's name property.
          data[objIndex].AccountNO = requested_data.AccountNO;
          data[objIndex].magic = requested_data.magic;
          data[objIndex]._Comment = requested_data._Comment;
          data[objIndex].digits = requested_data.digits;
          data[objIndex].open_price = requested_data.open_price;
          data[objIndex].open_time = requested_data.open_time;
          data[objIndex].stop_loss = requested_data.stop_loss;
          data[objIndex].symbol = requested_data.symbol;
          data[objIndex].take_profit = requested_data.take_profit;
          data[objIndex].ticket = requested_data.ticket;
          data[objIndex].type = requested_data.type;
          data[objIndex].volume = requested_data.volume;
          data[objIndex].volume_balance = requested_data.volume_balance;
          data[objIndex].volume_equity = requested_data.volume_equity;
        }

        let json_data = JSON.stringify(data);
        fs.writeFileSync(`./data/${requested_data.AccountNO}.json`, json_data);
        res.send(201, { status: "succesfull", data: requested_data });
      }
      // IF FILE NOT EXISTS
      else {
        let json_data = JSON.stringify([requested_data]);
        fs.writeFileSync(`./data/${requested_data.AccountNO}.json`, json_data);
        res.send(201, { status: "succesfull", data: requested_data });
      }
    } catch (err) {
      res.send(400, { status: "Failed", data: err });
    }
  }
});
