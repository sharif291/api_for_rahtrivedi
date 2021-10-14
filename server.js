const express = require("express"); //Line 1
const app = express(); //Line 2
const fs = require("fs");
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

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
  let ticket = req.params.ticket;

  if (fs.existsSync(`./data/${AccountNO}.json`)) {
    try {
      // Get existing data
      let prevdata = fs.readFileSync(`./data/${AccountNO}.json`);
      // make existing data json to object
      let data = JSON.parse(prevdata);
      data = data.Tickets;
      let result = data.filter((x) => x.ticket == ticket);
      res.send(302, { status: "succesfull", data: result });
    } catch (err) {
      res.send(400, { status: "Failed", data: err });
    }
  } else {
    res.send(404, { status: "Success", data: "File not Found" });
  }
});

app.post("/add", (req, res) => {
  // get requested data
  let requested_data = {
    AccountNO: req.body.AccountNO || "",
    Tickets: req.body.Tickets || "",
  };
  if (requested_data.AccountNO === "") {
    res.send(400, { status: "Failed", data: "invalid Account No" });
  } else {
    try {
      // IF FILE EXISTS
      if (fs.existsSync(`./data/${requested_data.AccountNO}.json`)) {
        // Get existing data
        let prevdata = fs.readFileSync(
          `./data/${requested_data.AccountNO}.json`
        );

        // make existing data json to object
        var data = JSON.parse(prevdata);
        data = data.Tickets;
        requested_data.Tickets.map((single_ticket) => {
          //Find index of specific object using findIndex method.
          objIndex = data.findIndex((x) => x.ticket == single_ticket.ticket);
          console.log("check " + objIndex);
          // IF DATA NOT in file
          if (objIndex == -1) {
            // Add new object to the file
            data.push(single_ticket);
          } else {
            //Update object's name property.
            data[objIndex].magic = single_ticket.magic;
            data[objIndex]._Comment = single_ticket._Comment;
            data[objIndex].digits = single_ticket.digits;
            data[objIndex].open_price = single_ticket.open_price;
            data[objIndex].open_time = single_ticket.open_time;
            data[objIndex].stop_loss = single_ticket.stop_loss;
            data[objIndex].symbol = single_ticket.symbol;
            data[objIndex].take_profit = single_ticket.take_profit;
            data[objIndex].ticket = single_ticket.ticket;
            data[objIndex].type = single_ticket.type;
            data[objIndex].volume = single_ticket.volume;
            data[objIndex].volume_balance = single_ticket.volume_balance;
            data[objIndex].volume_equity = single_ticket.volume_equity;
          }
        });

        const newData = {
          AccountNo: requested_data.AccountNO,
          Tickets: data,
        };

        let json_data = JSON.stringify(newData);
        fs.writeFileSync(`./data/${requested_data.AccountNO}.json`, json_data);
        res.send(201, { status: "succesfull", data: requested_data });
      }
      // IF FILE NOT EXISTS
      else {
        let json_data = JSON.stringify(requested_data);
        fs.writeFileSync(`./data/${requested_data.AccountNO}.json`, json_data);
        res.send(201, { status: "succesfull", data: requested_data });
      }
    } catch (err) {
      res.send(400, { status: "Failed", data: err });
    }
  }
});

const port = process.env.PORT || 5000; //Line 3

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
