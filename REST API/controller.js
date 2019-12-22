var mysql = require('mysql');
var sqlQuery;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
    password: '',
    database: 'tyoaika'
});

let users = {
    userName: "Testi",
    loginTime: Date.now(),
    sessionId: 1234
};

module.exports =
    {

        // Hakee kaikki projektit ja niihin liittyvät työntekijät työaikoineen. 
        fetchAll: function (req, res) {
            
            if (req.query.tyoteID == "" &&  req.query.proNimi == "") {
                sqlQuery = "SELECT projektit.nimi, tyontekijat.nimi AS tyotenimi, tyoajat.aloitus" + 
                ", tyoajat.lopetus FROM tyoajat INNER JOIN tyontekijat ON tyoajat.tyoteID = tyontekijat.tyontekijaID INNER JOIN projektit ON tyoajat.proID = projektit.projektiID;"
            }
            else if (req.query.tyoteID == undefined && req.query.proNimi == undefined) {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyontekijat.nimi AS tyotenimi, tyoajat.aloitus, " + 
                "tyoajat.lopetus FROM ((tyoajat INNER JOIN tyontekijat ON tyoajat.tyoteID = tyontekijat.tyontekijaID INNER JOIN projektit ON tyoajat.proID = projektit.projektiID));"
            }
            else {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyontekijat.nimi AS tyotenimi, tyoajat.aloitus, " + 
                "tyoajat.lopetus AS FROM tyoajat INNER JOIN tyontekijat ON tyoajat.tyoteID = tyontekijat.tyontekijaID INNER JOIN projektit ON tyoajat.proID = projektit.projektiID " +
                "WHERE tyoajat.tyoteID LIKE '" + req.query.tyoteID + "%' AND projektit.nimi LIKE '" + req.query.proNimi + "%'" + ";";
            }
           
            console.log(sqlQuery);
            
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa tyoajat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    /*console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));*/

                    res.json(results);
                }
            });
        },

        fetchHours: function (req, res) {
            if (req.query.tyoteID == "" || req.query.tyoteID == undefined) {
                
            }
            else {
                sqlQuery = "SELECT aloitus, lopetus FROM tyoajat WHERE tyoteID='" + req.query.tyoteID + "' " 
                   
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa tunteja tyoajat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    /*console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));*/

                    res.json(results);
                }
            });
        },

        // Hakee kaikki projektit, jos parametrien arvot ovat tyhjiä. Mikäli eivät ole, rajataan vastaanotettujen
        // arvojen perusteella.
        fetchProjects: function (req, res) {
            
            if (req.query.projektiID == "" || req.query.projektiID == undefined) {   
                sqlQuery = "SELECT * FROM projektit";     
            }
            else {
                sqlQuery = "SELECT * FROM projektit WHERE projektiID LIKE '" + req.query.projektiID + "%' " + "AND nimi LIKE '" + req.query.nimi + "%' "; 
            }

            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa projektit-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    res.json(results);

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
            else if (req.query.nimi == undefined && req.query.tyontekijaID == undefined) {
                sqlQuery = "SELECT * FROM tyontekijat";
            }
            else {
                sqlQuery = "SELECT * FROM tyontekijat WHERE nimi LIKE '" + req.query.nimi + "%' " +
                    "AND tyontekijaID LIKE '" + req.query.tyontekijaID + "%' ";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa tyontekijat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                }
            });
        },

        //Hakee kaikki kellotetut työajat, tai jos tulee parametreja, haetaan niiden perusteella
        fetchTimes: function (req, res) {
            if (req.query.tyoaikaID == "" && req.query.tyoteID == "" && req.query.proID == "" && req.query.aloitus == ""
            && req.query.lopetus == "") {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus" + 
                ", tyoajat.lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID;";
            }
            else if (req.query.tyoaikaID == undefined && req.query.tyoteID == undefined && req.query.proID == undefined && req.query.aloitus == undefined
            && req.query.lopetus == undefined) {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus" + 
                ", tyoajat.lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID;";
            }
            else if (req.query.tyoaikaID == undefined && req.query.tyoteID == undefined && req.query.proID != undefined && req.query.aloitus == undefined
                && req.query.lopetus == undefined) {
                    sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus" + 
                    ", tyoajat.lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.proID='" + req.query.proID + "'";
                }
            else if (req.query.tyoaikaID == "" && req.query.tyoteID == "" && req.query.proID != "") {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus" + 
                ", tyoajat.lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID tyoajat.proID='" + req.query.proID + "'";
            }
            else if (req.query.tyoteID != "" && req.query.proID == "" || req.query.proID == undefined && req.query.tyoteID != undefined) {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus" + 
                ", tyoajat.lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.tyoteID='" + req.query.tyoteID + "'";
            }
           
            else if (req.query.tyoteID != "" && req.query.proID != "" && req.query.proID != undefined && req.query.tyoteID != undefined) {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus" + 
                ", tyoajat.lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.proID='" + req.query.proID + "' AND tyoajat.tyoteID='" + req.query.tyoteID + "'";
            }
            
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa tyoajat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    /*console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));*/

                    res.json(results);
                }
            });
        },

          //Hakee kuukauden, vuoden ja henkilön perusteella rajatut työtunnit.
          limitTimes: function (req, res) {
            
            if (req.query.tyoteID == "" && req.query.kuukausi == "" && req.query.vuosi == "") {
                sqlQuery = "SELECT * FROM tyoajat";
            }
            else if (req.query.kuukausi == "" && req.query.vuosi == "") {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus, tyoajat.lopetus AS lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.tyoteID=" + req.query.tyoteID;
            }
            else if (req.query.kuukausi == "") {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus, tyoajat.lopetus AS lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.tyoteID=" + req.query.tyoteID + " AND YEAR(tyoajat.lopetus)=" + req.query.vuosi;
            }
            else if (req.query.vuosi == "") {
                sqlQuery = sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus, tyoajat.lopetus AS lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.tyoteID=" + req.query.tyoteID + " AND MONTH(tyoajat.lopetus)=" + req.query.kuukausi;
            }
            else {
                sqlQuery = "SELECT projektit.nimi AS pronimi, tyoajat.aloitus, tyoajat.lopetus AS lopetus FROM tyoajat INNER JOIN projektit ON tyoajat.proID = projektit.projektiID WHERE tyoajat.tyoteID=" + req.query.tyoteID + " AND MONTH(tyoajat.lopetus)=" + req.query.kuukausi + " AND YEAR(tyoajat.lopetus)=" + req.query.vuosi;
            }
            
            
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe haettaessa dataa tyoajat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));

                    res.json(results);
                }
            });
        },

        

        // Lisää uuden projektin ja tarkastaa, onko tarvittavat parametrit syötetty.
        createProject: function (req, res) {

            var nimi = req.body.nimi;

            if (req.query.nimi == "" || req.query.nimi == "undefined") {
                console.log("Virhe lisattaessa uutta projektia, nimi puuttuu");
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO projektit (nimi)" + " " +
                    "VALUES " + "(" + "'" + nimi + "'" + ")" + ";";

            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe lisattaessa uutta projektia, syy: " + error);
                    window.alert(error);
                    res.send({ "status": 500, "error": error, "response": null });
                    
                }

                console.log("Data = " + JSON.stringify(results));
                console.log("Params = " + JSON.stringify(req.query));
                res.json(results);
            });
        },

        // Lisää uuden työntekijän ja tarkastaa, onko tarvittavat parametrit syötetty.
        createWorker: function (req, res) {

            var nimi = req.body.nimi;

            if (req.query.nimi == "undefined" || req.query.nimi == "") {
                console.log("Virhe lisattaessa uutta tyontekijaa, nimi puuttuu");
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO tyontekijat (nimi)" + " " +
                    "VALUES " + "(" + "'" + nimi + "'" + ")" + ";";

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

        // Projektin päivitys
        updateProject: function (req, res) {
            var nimi = req.body.nimi;
            var id = req.body.projektiID;
            if (req.query.tyontekijaID == "") {

            }
            else {
                sqlQuery = "UPDATE projektit SET nimi ="+"'" + nimi + "' WHERE projektiID=" + "'" + id + "'" + ";";  
            }
            connection.query(sqlQuery ,function (error, results,fields) {
                if (error) {
                    console.log("Virhe muokattaessa dataa tyontekijat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                }
            });

        },

        update: function (req, res) {

        },

        // Lisää uuden kellotuksen ja tarkastaa, onko tarvittavat parametrit syötetty.
        createTime: function (req, res) {
            var aloitus = req.body.aloitus;
            var lopetus = req.body.lopetus;
            var tyoteID = req.body.tyoteID;
            var proID = req.body.proID;
            // muokattava. testiä...
            if (aloitus == "") {
                console.log("Virhe lisattaessa uutta kellotusta, nimi puuttuu");
                res.send({ "status": 500, "error": error, "response": null });
                
            }
            else {
                sqlQuery = "INSERT INTO tyoajat (tyoteID, proID, aloitus, lopetus)" + " " +
                    "VALUES " + "(" + "'" + tyoteID + "'" + "," 
                    + "'" + proID + "'" + "," + "'" + aloitus + "'" + "," + "'" + lopetus + "'" + ")" + ";";

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

        // työntekijän päivitys
        updateWorker: function (req, res) {
            var nimi = req.body.nimi;
            var id = req.body.tyontekijaID;
            if (req.query.tyontekijaID == "") {

            }
            else {
                sqlQuery = "UPDATE tyontekijat SET nimi ="+"'" + nimi + "' WHERE tyontekijaID=" + "'" + id + "'" + ";";  
            }
            connection.query(sqlQuery ,function (error, results,fields) {
                if (error) {
                    console.log("Virhe muokattaessa dataa tyontekijat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                }
            });

        },

        update: function (req, res) {

        },

        // Poistaa työntekijän taulusta ID:n perusteella.
        deleteWorker: function (req, res) {
            var id = req.body.tyontekijaID;
            if (req.query.ID == "") {
                
            }
            else {
                sqlQuery = "DELETE FROM tyontekijat WHERE tyontekijaID=" + "'" + id + "'" + ";";
            }
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe poistettaessa dataa tyontekijat-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                    console.log(sqlQuery);
                }
            });
        },

        // Poistaa projektin taulusta ID:n perusteella.
        deleteProject: function (req, res) {
            var id = req.body.projektiID;
            if (req.query.ID == "") {
                
            }
            else {
                sqlQuery = "DELETE FROM projektit WHERE projektiID=" + "'" + id + "'" + ";";
            }

            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe poistettaessa dataa projektit-taulusta, syy: " + error);
                    res.send({ "status": 500, "error": error, "response": null });
                }
                else {
                    console.log("Data = " + JSON.stringify(results));
                    console.log("Params = " + JSON.stringify(req.query));
                    res.json(results);
                }
            });
        },

        // Poistaa kellotuksen ID:n perusteella
        deleteTime: function (req, res) {
            var id = req.body.tyoaikaID;

            if (req.query.ID == "") {
                
            }
            else {
                sqlQuery = "DELETE FROM tyoajat WHERE tyoaikaID=" + "'" + id + "'" + ";";
            }
            console.log(sqlQuery);
            connection.query(sqlQuery, function (error, results, fields) {
                if (error) {
                    console.log("Virhe poistettaessa dataa tyoajat-taulusta, syy: " + error);
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
