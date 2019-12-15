var mysql = require('mysql');
var sqlQuery;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
    password: 'Kissa123',
    database: 'tyoaika'
});

let users = {
    userName: "Testi",
    loginTime: Date.now(),
    sessionId: 1234
};

module.exports =
    {
        // Hakee kaikki projektit, jos parametrien arvot ovat tyhjiä. Mikäli eivät ole, rajataan vastaanotettujen
        // arvojen perusteella.
        fetchProjects: function (req, res) {
            if (req.query.projektiID == "") {
                sqlQuery = "SELECT * FROM projektit";
            }
            else {
                sqlQuery = "SELECT * FROM projektit WHERE projektiID LIKE '" + req.query.projektiID + "%' " + "AND nimi LIKE '" + req.query.nimi + "%' ";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa projektit-taulusta, syy: " + error);
                    //res.send(error);
                    //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    res.json(results);
                    
                    //res.statusCode = 201;
                    //res.send(results);
                    //res.send({ "status": 768, "error": null, "response": results });
                }
            });

    },

    login: function (request, response) {
        users.userName = request.body.username;
        response.cookie("userData", users);
        response.redirect("/");
    },

        //Hakee kaikki työntekijät, tai jos tulee parametreja, haetaan niiden perusteella
        fetchWorkers: function (req, res) {
            if (req.query.nimi == "" && req.query.tyontekijaID == "") {
                sqlQuery = "SELECT * FROM tyontekijat";
            }
            else {
                sqlQuery = "SELECT * FROM tyontekijat WHERE nimi LIKE '" + req.query.nimi + "%' " +
                    "AND tyontekijaID LIKE '" + req.query.tyontekijaID + "%' ";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa tyontekijat-taulusta, syy: " + error);
                    //res.send(error);
                    //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                    //res.statusCode = 201;
                    //res.send(results);
                    //res.send({ "status": 768, "error": null, "response": results });
                }
            });
        },

        //Hakee kaikki kellotetut työajat, tai jos tulee parametreja, haetaan niiden perusteella
        fetchTimes: function (req, res) {
            if (req.query.tyoaikaID == "" && req.query.tyoteID == "" && req.query.proID == "" && req.query.aloitus == ""
            && req.query.lopetus == "") {
                sqlQuery = "SELECT * FROM tyoajat";
            }
            else {
                sqlQuery = "SELECT * FROM tyoajat WHERE tyoaikaID LIKE '" + req.query.tyoaikaID + "%' " +
                    "AND tyoteID LIKE '" + req.query.tyoteID + "%' " + "AND proID LIKE '" + req.query.proID + "%' ";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa tyoajat-taulusta, syy: " + error);
                    //res.send(error);
                    //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                    //res.statusCode = 201;
                    //res.send(results);
                    //res.send({ "status": 768, "error": null, "response": results });
                }
            });
        },

        // Lisää uuden projektin ja tarkastaa, onko tarvittavat parametrit syötetty.
        createProject: function (req, res) {
            if (req.query.nimi == "") {
                console.log("Virhe lisattaessa uutta projektia, nimi puuttuu");
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO projektit (nimi)" + " " +
                    "VALUES " + "(" + "'" + req.query.nimi + "'" + ")" + ";";

            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe lisattaessa uutta projektia, syy: " + error);
                    window.alert(error);
                    //res.send(error);
                    //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
                    res.send({ "status": 500, "error": error, "response": null });
                    
                }

                console.log("Data = " + JSON.stringify(results));
                console.log("Params = " + JSON.stringify(req.query));
                res.json(results);
            });
        },

        // Lisää uuden työntekijän ja tarkastaa, onko tarvittavat parametrit syötetty.
        createWorker: function (req, res) {
            if (req.query.nimi == "") {
                console.log("Virhe lisattaessa uutta tyontekijaa, nimi puuttuu");
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO tyontekijat (nimi)" + " " +
                    "VALUES " + "(" + "'" + req.query.nimi + "'" + ")" + ";";

            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe lisattaessa uutta tyontekijaa, syy: " + error);
                    window.alert(error);
                    res.send({ "status": 500, "error": error, "response": null });
                    
                }

                console.log("Data = " + JSON.stringify(results));
                console.log("Params = " + JSON.stringify(req.query));
                res.json(results);
            });
        },

        // Lisää uuden kellotuksen ja tarkastaa, onko tarvittavat parametrit syötetty.
        createTime: function (req, res) {
            if (req.query.nimi == "") {
                console.log("Virhe lisattaessa uutta kellotusta, nimi puuttuu");
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO tyoajat (tyoteID, proID, aloitus, lopetus)" + " " +
                    "VALUES " + "(" + "'" + req.query.tyoteID + "'" + "," 
                    + "'" + req.query.proID + "'" + "," + "'" + req.query.aloitus + "'" + "," + "'" + req.query.lopetus + "'" + ")" + ";";

            }

            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe lisattaessa uutta tyoaikaa, syy: " + error);
                    window.alert(error);
                    res.send({ "status": 500, "error": error, "response": null });
                    
                }

                console.log("Data = " + JSON.stringify(results));
                console.log("Params = " + JSON.stringify(req.query));
                res.json(results);
            });
        },

        update: function (req, res) {

        },

        delete: function (req, res) {
            if (req.query.ID == "") {
                
            }
            else {
                sqlQuery = "DELETE FROM asiakas WHERE AVAIN=" + "'" + req.params.id + "'" + ";";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                }
            });


        }
    }