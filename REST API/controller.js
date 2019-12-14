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
        fetchProjects: function (req, res) {
            connection.query('SELECT * FROM projektit', function (error, results, fields) {
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

        //Haetaan kaikki työntekijät, tai jos tulee parametreja, niin haetaan niiden perusteella
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

        create: function (req, res) {
            if (req.query.NIMI === "" || req.query.OSOITE == "" || req.query.ASTY_AVAIN == "" || req.query.POSTINRO == "" || req.query.POSTITMP == "" || req.query.LUONTIPVM == "") {
                console.log("Virhe lisattaessa uutta asiakasta, tayta kaikki kentat");
                //res.send(error);
                //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN)" + " " +
                    "VALUES" + " " + "(" + "'" + req.query.NIMI + "'" + "," + "'" + req.query.OSOITE + "'" + "," + "'" + req.query.POSTINRO +
                    "'" + "," + "'" + req.query.POSTITMP + "'" + "," + "'" + req.query.LUONTIPVM + "'" + "," + "'" + req.query.ASTY_AVAIN + "'" + ")" + ";";

                //sqlQuery = "SELECT * FROM asiakas WHERE NIMI LIKE '" + req.query.NIMI + "%' " +
                //    "AND OSOITE LIKE '" + req.query.OSOITE + "%' AND ASTY_AVAIN LIKE '" + req.query.ASTY_AVAIN + "%'";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe lisattaessa uutta asiakasta, syy: " + error);
                    window.alert(error);
                    //res.send(error);
                    //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
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


        }
    }