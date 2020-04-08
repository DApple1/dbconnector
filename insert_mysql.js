const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');

let stream = fs.createReadStream("stage_test.csv");
let myData = [];
let csvStream = csv
  .parse()

  // Data event for when new line of CSV has been parsed
  .on("data", function (data) {
    myData.push(data);
  })

  // End event for when file has been completely read.
  // shift() skips the first row/headers in csv file
  .on("end", function () {
    myData.shift();

    // Create a new connection to the database
    const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "GoldenBear)#01",
      database: "db_example"
    });


    // open the connection
    con.connect((error) => {
      if (error) {
        console.error(error);
      } else {

        // DELETE STATEMENT to delete existing data
        let deleteSQL = "DELETE FROM users";
        con.query(deleteSQL, function (err, result) {
          if (err) throw err;
          console.log("Number of records deleted: " + result.affectedRows);
        });

        // INSERT STATEMENT to push data to database
        let insertSQL = 'INSERT INTO users (id, email, name, dow) VALUES ?';
        con.query(insertSQL, [myData], (error, response) => {
          console.log(error || response);
        });

        // Terminate connection after all queries are executed
        // Quit packet is sent to the MySQL server
        con.end((err) => { });
      }
    });
  });
// Method used to take a readable stream and connect it to a writeable stream
stream.pipe(csvStream);