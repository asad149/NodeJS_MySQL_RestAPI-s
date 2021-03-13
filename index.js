const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware

app.use(bodyParser.json());
app.use(cors());

// Database Configuration

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pos",
  multipleStatements: true,
});

// Database Connection
mysqlConnection.connect((err) => {
  if (!err) console.log("DB Connection succeded");
  else
    console.log(
      "DB connection failer \n Error : " + JSON.stringify(err, undefined, 2)
    );
});



app.get("/", (req, res) => res.send("Hello Asad"));

// Fetching all Record

app.get("/person", (req, res) => {
  mysqlConnection.query("SELECT * FROM person", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});


app.get("/item/:id", (req, res) => {
  mysqlConnection.query(
    `SELECT  it.ITEM_NAME,it.SALE_PRICE ,cat.CATEGORY_NAME,scat.SUB_CATEGORY_NAME,cat.CATEGORY_ID,scat.SUB_CATEGORY_ID,it.ITEM_ID
    FROM  item it , category cat , sub_category scat
    WHERE  scat.SUB_CATEGORY_ID = ?
    AND it.STATUS='Y'`,
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});



app.get("/cat", (req, res) => {

  mysqlConnection.query(`SELECT  cat.CATEGORY_SHORT_NAME , scat.SUB_CATEGORY_SHORT_NAME,cat.CATEGORY_ID , scat.SUB_CATEGORY_ID
  from category cat , sub_category scat
  WHERE cat.CATEGORY_ID  = scat.SUB_CATEGORY_ID
  AND cat.STATUS = 'Y'
  AND scat.STATUS ='Y'`, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});



// Fetching Specific Record by ID

app.get("/person/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM person WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

// Deleting Record by ID

app.delete("/person/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM person WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Delete Successfully");
      else console.log(err);
    }
  );
});

// Inserting Record

app.post("/person", (req, res) => {
  let per = req.body;

  var sql = "INSERT INTO person (id,name,age) VALUES ?";

  const values = [[per.id, per.name, per.age]];

  mysqlConnection.query(sql, [values], (err, rows, fields) => {
    if (!err) res.send("Record Inserted");
    else console.log(err);
  });
});

// Updating Record

app.put("/person", (req, res) => {
  mysqlConnection.query(
    "UPDATE person SET name=? where id=?",
    [req.body.name, req.body.id],
    (err, rows, fields) => {
      if (!err) res.send("Updated Successfully");
      else console.log(err);
    }
  );
});


const port = 4000 || process.env.PORT;

app.listen(port, () => console.log(`Port is running on this ${port}`));
