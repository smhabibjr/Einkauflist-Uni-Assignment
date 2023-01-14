"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require('fs');
var Einkauf = /** @class */ (function () {
    function Einkauf(besitzer, aufgabe, ort, datum, status) {
        this.id = ++Einkauf.id_max; // Vergabe einer eindeutigen id
        this.status = status;
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.ort = ort;
        this.datum = new Date(datum);
        Einkauf.stack.push(this); // Der aktuelle Eintrag wird zur Sicherung auf den Stack gelegt
    }
    Einkauf.prototype.getID = function () {
        // Ermittlung der id des rufenden Eintrags
        return this.id;
    };
    Einkauf.prototype.getStatus = function () {
        // Ermittlung des Status des rufenden Eintrags
        return this.status;
    };
    Einkauf.prototype.setStatus = function (status) {
        // Setzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    };
    Einkauf.getLoPEintragStack = function () {
        // Rückgabe des vollständigen Stacks mit allen Einträgen
        return Einkauf.stack;
    };
    Einkauf.id_max = 0; // größte bisher vergebene id
    Einkauf.stack = []; // Stack für alle erzeugten Einträge
    return Einkauf;
}());
var EinkaufAbb = /** @class */ (function () {
    // ein Element in diesem Stack enthalten
    function EinkaufAbb() {
        this.liste = [];
        EinkaufAbb.stack.push(this);
    }
    EinkaufAbb.prototype.getEinkaufEintrag = function (id) {
        var einkauf_act = undefined;
        for (var _i = 0, _a = this.liste; _i < _a.length; _i++) {
            var i = _a[_i];
            if (id === i.getID()) {
                einkauf_act = i;
            }
        }
        return einkauf_act;
    };
    EinkaufAbb.stack = []; // Stack aller Einkaufs (im vorliegenden Fall ist nur
    return EinkaufAbb;
}());
var LogEinkauf = /** @class */ (function () {
    function LogEinkauf(besitzer, aufgabe, ort, datum, status) {
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.ort = ort;
        this.datum = datum;
        this.status = status;
    }
    return LogEinkauf;
}());
// ----------------------------------------------------------------------------
// Funktionen
function EinkaufSave(einkauf, file) {
    // Sichern der übergebenen daten in die Datei mit dem Pfad file.
    // Der gespeicherte JSON-String wird von der Funkion zurückgegeben
    // Aufbau des JSONs mit der Einkauf als Objekt der Klasse LogEinkauf
    var logEinkauf = [];
    for (var _i = 0, _a = einkauf_aktuell.liste; _i < _a.length; _i++) {
        var i = _a[_i];
        logEinkauf.push(new LogEinkauf(i.besitzer, i.aufgabe, i.ort, i.datum, i.getStatus()));
    }
    // Umwandeln des Objekts in einen JSON-String
    var logEinkaufJSON = JSON.stringify(logEinkauf);
    // Schreiben des JSON-Strings der Daten in die Datei mit dem Pfadnamen "file"
    fs.writeFile(file, logEinkaufJSON, function (err) {
        if (err)
            throw err;
        if (logRequest)
            console.log("Einkauf gesichert in der Datei: ", file);
    });
    return logEinkaufJSON;
}
function renderEinkauf(einkaufhtml) {
    // Aufbereitung der aktuellen Einkauf als html-tbody
    var html_Einkauf = "";
    for (var i in einkaufhtml.liste) {
        // Ein Element der Einkauf wird nur ausgegeben, wenn sein Status auf aktiv (1) steht.
        if (einkaufhtml.liste[i].getStatus() === 1) {
            var id = einkaufhtml.liste[i].getID();
            var besitzer = einkaufhtml.liste[i].besitzer;
            var aufgabe_1 = einkaufhtml.liste[i].aufgabe;
            var ort = einkaufhtml.liste[i].ort;
            var datum = einkaufhtml.liste[i].datum;
            var datum_string = datum.toISOString().slice(0, 10);
            html_Einkauf += "<tr class='b-dot-line' data-lop-id='" + id + "'>";
            html_Einkauf += "<td class='click-value' data-purpose='besitzer' " +
                "data-lop-id='" + id + "'>" + besitzer + "</td>";
            html_Einkauf += "<td class='click-value as-width-100pc' data-purpose='aufgabe' " +
                "data-lop-id='" + id + "'>" + aufgabe_1 + "</td>";
            html_Einkauf += "<td class='click-value' data-purpose='ort' " +
                "data-lop-id='" + id + "'>" + ort + "</td>";
            html_Einkauf += "<td class='click-value' data-purpose='datum'" +
                " data-lop-id='" + id + "'>" + datum_string + "</td>";
            html_Einkauf += "<td >" +
                "<input  type = 'submit' value = 'ändern' class='as-button-1' " +
                "data-purpose = 'aendern' data-lop-id = '" + id + "'>" +
                "<input  type = 'submit' value = 'löschen' class='as-button-1' " +
                "data-purpose = 'loeschen' data-lop-id = '" + id + "'>" +
                "</td>";
            html_Einkauf += "</tr>";
        }
    }
    return html_Einkauf;
}
function change(einkaufChange) {
    var id_act = einkaufChange.getID();
    var besitzer = einkaufChange.besitzer;
    var aufgabe = einkaufChange.aufgabe;
    var ort = einkaufChange.ort;
    var datum = einkaufChange.datum;
    var html_Change = "";
    html_Change += "<td><input type='text' value='" + besitzer + "'></td>" +
        "<td><input class='as-width-100pc' type='text' value='" +
        aufgabe + "'>" +
        " <form>" +
        "<input type = 'submit' value = 'speichern' class='as-button-0' " +
        "data-purpose = 'speichern2' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'zurück' class='as-button' " +
        "data-purpose = 'zurück' data-lop-id = '" + id_act + "'>" +
        "</form>" +
        "<td><input type='text' value='" + ort + "'></td>" +
        "<br>" +
        "</td>" +
        "<td><input type='text' value='" + datum.toISOString().slice(0, 10) + "'>" +
        "</td>";
    return html_Change;
}
function renderEinkaufChange(einkaufChange) {
    // Aufbereitung des aktuellen Eintrags für die Änderungs-/Löschausgabe in
    // der zugehörigen Tabellenzeile
    var id_act = einkaufChange.getID();
    var besitzer = einkaufChange.besitzer;
    var aufgabe = einkaufChange.aufgabe;
    var ort = einkaufChange.ort;
    var datum = einkaufChange.datum;
    var html_Change = "";
    html_Change += "<td><input type='text' value='" + besitzer + "'></td>" +
        "<td><input class='as-width-100pc' type='text' value='" +
        aufgabe + "'>" +
        " <form>" +
        "<input type = 'submit' value = 'ändern' class='as-button-0' " +
        "data-purpose = 'aendern' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'zurück' class='as-button' " +
        "data-purpose = 'zurück' data-lop-id = '" + id_act + "'>" +
        "<input type = 'submit' value = 'löschen' class='as-button' " +
        "data-purpose = 'loeschen' data-lop-id = '" + id_act + "'>" +
        "</form>" +
        "<td><input type='text' value='" + ort + "'></td>" +
        "<br>" +
        "</td>" +
        "<td><input type='text' value='" + datum.toISOString().slice(0, 10) + "'>" +
        "</td>";
    return html_Change;
}
// Globale Variablen ----------------------------------------------------------
var programmname = "Einkaufsliste";
var version = 'V.1.001';
var username; // aktuelle Bearbeiterperson
var einkauf_aktuell = new EinkaufAbb(); // einkauf anlegen
var clientRunCounter = 0; // Anzahl der Serveraufrufe vom Client
// Debug Informationen über console.log ausgeben
var logRequest = true;
// ----------------------------------------------------------------------------
// Die aktuelle einkauf wird bei jeder Änderung zur Sicherung und Wiederverwendung in
// einer Datei mit eindeutigem Dateinamen gespeichert.
var logRunDate = (new Date()).toISOString();
var logEinkaufFile_work = "log/logEinkauf.json";
var logEinkaufFile_save_pre = "log/logEinkauf";
fs.readFile(logEinkaufFile_work, "utf-8", function (err, einkaufData) {
    // Einlesen der letzten aktuellen Cleint  -----------------------------------------
    if (err) {
        // Wenn die Datei nicht existiert, wird eine neue Liste angelegt
        einkauf_aktuell.liste = [];
    }
    else {
        // Wenn die Datei existiert, werden die JSON-Daten eingelesen und es wird
        // die letzte aktuelle LoP rekonstruiert.
        var lopDataJSON = JSON.parse(einkaufData); // JSON aus den eingelesenen Daten
        for (var _i = 0, lopDataJSON_1 = lopDataJSON; _i < lopDataJSON_1.length; _i++) {
            var i = lopDataJSON_1[_i];
            // Aus dem JSON die LoP aufbauen
            einkauf_aktuell.liste.push(new Einkauf(i.besitzer, i.aufgabe, i.ort, new Date(i.datum), i.status));
        }
    }
    if (logRequest)
        console.log("Eikauf eingelesen. Anzahl der Einträge: ", einkauf_aktuell.liste.length);
});
// ----------------------------------------------------------------------------
// Aktivierung des Servers
var server = express();
var serverPort = 9090;
var serverName = programmname + " " + version;
server.listen(serverPort);
console.log("Der Server \"" + serverName + "\" steht auf Port ", serverPort, "bereit", "\nServerstart: ", logRunDate);
server.use(express.urlencoded({ extended: false })); // URLencoded Auswertung ermöglichen
server.use(express.json()); // JSON Auswertung ermöglichen
// ----------------------------------------------------------------------------
// Mapping von Aliases auf reale Verzeichnisnamen im Dateisystem des Servers
// Basisverzeichnis des Webservers im Dateisystem
var rootDirectory = __dirname;
server.use("/style", express.static(rootDirectory + "/style"));
server.use("/script", express.static(rootDirectory + "/script"));
console.log("root directory: ", rootDirectory);
// ----------------------------------------------------------------------------
// Start der Website auf dem Client durch Übergabe der index.html -------------
server.get("/", function (req, res) {
    if (logRequest)
        console.log("GET /");
    res.status(200);
    res.sendFile(rootDirectory + "/html/shopping.html");
});
server.get("/favicon.ico", function (req, res) {
    // Hier wird das Icon für die Website ausgeliefert
    if (logRequest)
        console.log("GET favicon.ico");
    res.status(200);
    res.sendFile(rootDirectory + "/image/favicon.ico");
});
server.get("/version", function (req, res) {
    // Hier wird die Serverversion ausgeliefert
    if (logRequest)
        console.log("GET version");
    res.status(200);
});
// ----------------------------------------------------------------------------
// CREATE - Neuer Eintrag in die Einkauf
server.post("/create", function (req, res) {
    ++clientRunCounter;
    // Wert vom Client aus dem JSON entnehmen
    var besitzer = String(req.body.besitzer);
    var aufgabe = String(req.body.aufgabe);
    var ort = String(req.body.ort);
    var datum = new Date(req.body.datum);
    username = besitzer;
    if (logRequest)
        console.log("Post /create: ", clientRunCounter);
    einkauf_aktuell.liste.push(new Einkauf(besitzer, aufgabe, ort, datum, 1));
    // Die aktuelle LoP wird gesichert und in einer
    // Datei (logLoPFile_work) gespeichert. Die Datei wird bei jeder Berechnung wieder
    // mit dem aktuellen Stand der LoP überschrieben.
    EinkaufSave(einkauf_aktuell, logEinkaufFile_work);
    // Rendern der aktuellen LoP und Rückgabe des gerenderten Tabellenteils (tbody)
    var html_tbody = renderEinkauf(einkauf_aktuell);
    res.status(200);
    res.send(html_tbody);
});
// ----------------------------------------------------------------------------
// READ
server.get("/read", function (req, res) {
    // READ - Rückgabe der vollständigen LoP als html-tbody
    ++clientRunCounter;
    var einkausliste_aktuellLength = einkauf_aktuell.liste.length;
    if (logRequest)
        console.log("GET /read: ", clientRunCounter, einkausliste_aktuellLength);
    if (einkauf_aktuell === undefined) {
        res.status(404);
        res.send("Cleint  does not exist");
    }
    else {
        // Rendern der aktuellen LoP
        var html_tbody = renderEinkauf(einkauf_aktuell);
        res.status(200);
        res.send(html_tbody);
    }
});
server.post("/read", function (req, res) {
    // READ -Rückgabe der Tabellenzeile für ändern und löschen
    ++clientRunCounter;
    // Wert vom Client aus dem JSON entnehmen
    var id_act = Number(req.body.id_act);
    var lopChange = einkauf_aktuell.getEinkaufEintrag(id_act);
    if (logRequest)
        console.log("Post /read: ", clientRunCounter, id_act, lopChange);
    if (einkauf_aktuell === undefined || lopChange.getStatus() !== 1) {
        res.status(404);
        res.send("Item " + id_act + " does not exist");
    }
    else {
        // Rendern der aktuellen LoP
        var html_change = renderEinkaufChange(lopChange);
        res.status(200);
        res.send(html_change);
    }
});
// change - Einkauf-Eintrag ändern
server.post("/change", function (req, res) {
    ++clientRunCounter;
    var id_act = Number(req.body.id_act);
    var lopChange = einkauf_aktuell.getEinkaufEintrag(id_act);
    if (logRequest)
        console.log("Post /read: ", clientRunCounter, id_act, lopChange);
    if (einkauf_aktuell === undefined || lopChange.getStatus() !== 1) {
        res.status(404);
        res.send("Item " + id_act + " does not exist");
    }
    else {
        // Rendern der aktuellen LoP
        var html_change = change(lopChange);
        res.status(200);
        res.send(html_change);
    }
});
// ----------------------------------------------------------------------------
// UPDATE - Einkauf-Eintrag ändern
server.post("/update", function (req, res) {
    // Werte vom Client aus dem JSON entnehmen
    ++clientRunCounter;
    var id_act = Number(req.body.id_act);
    var besitzer = String(req.body.besitzer);
    var aufgabe = String(req.body.aufgabe);
    var ort = String(req.body.ort);
    var datum = new Date(req.body.datum);
    if (logRequest)
        console.log("GET /update: ", clientRunCounter, id_act);
    var lopUpdate = einkauf_aktuell.getEinkaufEintrag(id_act);
    if (lopUpdate === undefined || lopUpdate.getStatus() !== 1) {
        res.status(404);
        res.send("Item " + id_act + " does not exist");
    }
    else {
        lopUpdate.besitzer = besitzer;
        lopUpdate.aufgabe = aufgabe;
        lopUpdate.ort = ort;
        lopUpdate.datum = datum;
        // Sichern der aktuellen LoP in die Datei logLoPFile_work
        EinkaufSave(einkauf_aktuell, logEinkaufFile_work);
        // Rendern der aktuellen LoP
        renderEinkauf(einkauf_aktuell);
        res.status(200);
        res.send("Item " + id_act + " changed");
    }
    // Rückgabe der Werte an den Client
});
// ----------------------------------------------------------------------------
// DELETE - LoP-Eintrag aus der Liste löschen
server.post("/delete", function (req, res) {
    // Wert vom Client aus dem JSON entnehmen
    ++clientRunCounter;
    var id_act = Number(req.body.id_act);
    var lopDelete = einkauf_aktuell.getEinkaufEintrag(id_act);
    if (logRequest)
        console.log("Post /delete: ", clientRunCounter, id_act, lopDelete);
    if (lopDelete === undefined || lopDelete.getStatus() !== 1) {
        res.status(404);
        res.send("Item " + id_act + " does not exist");
    }
    else {
        lopDelete.setStatus(2);
        // Sichern der aktuellen LoP in die Datei logLoPFile_work
        EinkaufSave(einkauf_aktuell, logEinkaufFile_work);
        // Rendern der aktuellen LoP und Rückgabe des gerenderten Tabellenteils (tbody)
        //        const html_tbody = renderLoP(loP_aktuell)
        res.status(200);
        res.send("Item " + id_act + " deleted");
    }
});
// ----------------------------------------------------------------------------
// SAVE - LoP in Datei mit Datumstempel sichern
server.get("/save", function (req, res) {
    /* Die aktuelle LoP wird zur Sicherung und Wiederverwendung in einer Datei
       mit eindeutigem Dateinamen mit dem aktuellen Datumsstempel gespeichert.
     */
    ++clientRunCounter;
    if (logRequest)
        console.log("Get /save: ", clientRunCounter);
    var logRunDate = (new Date()).toISOString().replace(/:/g, "-");
    var logLoPFile_save = logEinkaufFile_save_pre + logRunDate + ".json";
    // Sichern der aktuellen LoP in die Datei logLoPFile_save
    EinkaufSave(einkauf_aktuell, logLoPFile_save);
    res.status(200);
    res.send("LoP saved");
});
// ----------------------------------------------------------------------------
server.use(function (req, res) {
    // Es gibt keine reguläre Methode im Server für die Beantwortung des Requests
    ++clientRunCounter;
    if (logRequest)
        console.log("Fehler 404", req.url);
    res.status(404);
    res.set('content-type', 'text/plain; charset=utf-8');
    var urlAnfrage = req.url;
    res.send(urlAnfrage +
        "\n\nDie gewünschte Anfrage kann vom Webserver \"" + serverName +
        "\" nicht bearbeitet werden!");
});
//# sourceMappingURL=server.js.map