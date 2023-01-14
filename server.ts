import * as express from "express";
const fs = require('fs');

class Einkauf {
    /* Klasse zur Abbildung eines Eintrags in der Einkauf . Jeder
       Eintraag in der Einkauf wird durch ein Objekt (Instanz) dieser Klasse gebildet.
     */

    public besitzer: string;
    public aufgabe: string;
    public datum: Date;

    public  ort : string;

    private status: number; // 0 = nicht definiert, 1 = aktiv, 2 = deaktiviert, 3 = gelöscht
    private readonly id: number; // eindeutige und unveränderliche id eines Eintrags
    private static id_max: number = 0; // größte bisher vergebene id
    private static stack: Einkauf[] = [];  // Stack für alle erzeugten Einträge

    constructor(besitzer: string, aufgabe: string,ort :string , datum: Date, status: number) {
        this.id = ++Einkauf.id_max;  // Vergabe einer eindeutigen id
        this.status = status;
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.ort = ort;
        this.datum = new Date(datum);
        Einkauf.stack.push(this); // Der aktuelle Eintrag wird zur Sicherung auf den Stack gelegt
    }

    getID(): number {
        // Ermittlung der id des rufenden Eintrags
        return this.id;
    }

    getStatus(): number {
        // Ermittlung des Status des rufenden Eintrags
        return this.status;
    }

    setStatus(status: number): number {
        // Setzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    }

    static getLoPEintragStack(): Einkauf[] {
        // Rückgabe des vollständigen Stacks mit allen Einträgen
        return Einkauf.stack;
    }
}

class EinkaufAbb {
    /* Klasse zur Abbildung einer Einkauf .
       Die Einkauf enthält eine Liste mit Einträgen von Objekten der Klasse EinkaufEintrag.
     */
    public liste: Einkauf[];  // Liste der eingetragenen Elemente
    private static stack: EinkaufAbb[] = []; // Stack aller Einkaufs (im vorliegenden Fall ist nur
    // ein Element in diesem Stack enthalten
    constructor() {
        this.liste = [];
        EinkaufAbb.stack.push(this);
    }

    public getEinkaufEintrag(id: number): Einkauf {
        let einkauf_act: Einkauf = undefined;
        for (let i of this.liste) {
            if (id === i.getID()) {
                einkauf_act = i;
            }
        }
        return einkauf_act;
    }
}

class LogEinkauf {
    public besitzer: string;
    public aufgabe: string;
    public datum: Date;
    public ort : string;
    public status: number;

    constructor(besitzer: string, aufgabe: string, ort : string, datum: Date , status: number) {
        this.besitzer = besitzer;
        this.aufgabe = aufgabe;
        this.ort = ort;
        this.datum = datum;
        this.status = status;
    }
}

// ----------------------------------------------------------------------------
// Funktionen

function EinkaufSave(einkauf:  EinkaufAbb , file: string): string {
    // Sichern der übergebenen daten in die Datei mit dem Pfad file.
    // Der gespeicherte JSON-String wird von der Funkion zurückgegeben
    // Aufbau des JSONs mit der Einkauf als Objekt der Klasse LogEinkauf
    const logEinkauf: LogEinkauf[] = [];
    for (let i of einkauf_aktuell.liste) {
        logEinkauf.push(new LogEinkauf(i.besitzer, i.aufgabe , i.ort , i.datum, i.getStatus()));
    }

    // Umwandeln des Objekts in einen JSON-String
    const logEinkaufJSON = JSON.stringify(logEinkauf);
    // Schreiben des JSON-Strings der Daten in die Datei mit dem Pfadnamen "file"
    fs.writeFile(file, logEinkaufJSON, (err) => {

        if (err) throw err;
        if (logRequest)
            console.log("Einkauf gesichert in der Datei: ", file);
    });
    return logEinkaufJSON;
}

function renderEinkauf(einkaufhtml: EinkaufAbb): string {
    // Aufbereitung der aktuellen Einkauf als html-tbody

    let html_Einkauf: string = "";
    for (let i in einkaufhtml.liste) {
        // Ein Element der Einkauf wird nur ausgegeben, wenn sein Status auf aktiv (1) steht.
        if (einkaufhtml.liste[i].getStatus() === 1) {
            let id = einkaufhtml.liste[i].getID();
            let besitzer = einkaufhtml.liste[i].besitzer;
            let aufgabe = einkaufhtml.liste[i].aufgabe;
            let ort = einkaufhtml.liste[i].ort;
            let datum = einkaufhtml.liste[i].datum;
            let datum_string = datum.toISOString().slice(0, 10);
            html_Einkauf += "<tr class='b-dot-line' data-lop-id='" + id + "'>"
            html_Einkauf += "<td class='click-value' data-purpose='besitzer' " +
                "data-lop-id='" + id + "'>" + besitzer + "</td>";
            html_Einkauf += "<td class='click-value as-width-100pc' data-purpose='aufgabe' " +
                "data-lop-id='" + id + "'>" + aufgabe + "</td>";
            html_Einkauf += "<td class='click-value' data-purpose='ort' " +
                "data-lop-id='" + id + "'>" + ort + "</td>";
            html_Einkauf += "<td class='click-value' data-purpose='datum'" +
                " data-lop-id='" + id + "'>" + datum_string + "</td>";
            html_Einkauf += "<td >"  +
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
function  change(einkaufChange : Einkauf) : string {

    let id_act = einkaufChange.getID();
    let besitzer = einkaufChange.besitzer;
    let aufgabe = einkaufChange.aufgabe;
    let ort = einkaufChange.ort;
    let datum = einkaufChange.datum;
    let html_Change: string = "";
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
function renderEinkaufChange(einkaufChange: Einkauf): string {
    // Aufbereitung des aktuellen Eintrags für die Änderungs-/Löschausgabe in
    // der zugehörigen Tabellenzeile

    let id_act = einkaufChange.getID();
    let besitzer = einkaufChange.besitzer;
    let aufgabe = einkaufChange.aufgabe;
    let ort = einkaufChange.ort;
    let datum = einkaufChange.datum;
    let html_Change: string = "";

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
let programmname: string = "Einkaufsliste";
let version: string = 'V.1.001';
let username: string;   // aktuelle Bearbeiterperson
let einkauf_aktuell: EinkaufAbb = new EinkaufAbb();  // einkauf anlegen
let clientRunCounter: number = 0;  // Anzahl der Serveraufrufe vom Client

// Debug Informationen über console.log ausgeben
const logRequest: boolean = true;

// ----------------------------------------------------------------------------
// Die aktuelle einkauf wird bei jeder Änderung zur Sicherung und Wiederverwendung in
// einer Datei mit eindeutigem Dateinamen gespeichert.
const logRunDate: string = (new Date()).toISOString();
const logEinkaufFile_work: string = "log/logEinkauf.json";
const logEinkaufFile_save_pre: string = "log/logEinkauf";

fs.readFile(logEinkaufFile_work, "utf-8", (err, einkaufData) => {
    // Einlesen der letzten aktuellen Cleint  -----------------------------------------
    if (err) {
        // Wenn die Datei nicht existiert, wird eine neue Liste angelegt
        einkauf_aktuell.liste = [];
    } else {
        // Wenn die Datei existiert, werden die JSON-Daten eingelesen und es wird
        // die letzte aktuelle LoP rekonstruiert.
        const lopDataJSON = JSON.parse(einkaufData); // JSON aus den eingelesenen Daten
        for (let i of lopDataJSON) {
            // Aus dem JSON die LoP aufbauen
            einkauf_aktuell.liste.push(
                new Einkauf(i.besitzer, i.aufgabe,i.ort ,new Date(i.datum), i.status));
        }
    }
    if (logRequest)
        console.log("Eikauf eingelesen. Anzahl der Einträge: ",
            einkauf_aktuell.liste.length);
});

// ----------------------------------------------------------------------------
// Aktivierung des Servers
const server = express();
const serverPort: number = 9090;
const serverName: string = programmname + " " + version;
server.listen(serverPort);
console.log("Der Server \"" + serverName + "\" steht auf Port ", serverPort, "bereit",
    "\nServerstart: ", logRunDate);

server.use(express.urlencoded({extended: false})); // URLencoded Auswertung ermöglichen
server.use(express.json()); // JSON Auswertung ermöglichen

// ----------------------------------------------------------------------------
// Mapping von Aliases auf reale Verzeichnisnamen im Dateisystem des Servers

// Basisverzeichnis des Webservers im Dateisystem
let rootDirectory = __dirname;
server.use("/style", express.static(rootDirectory + "/style"));
server.use("/script", express.static(rootDirectory + "/script"));
console.log("root directory: ", rootDirectory);

// ----------------------------------------------------------------------------
// Start der Website auf dem Client durch Übergabe der index.html -------------
server.get("/", (req: express.Request, res: express.Response) => {
    if (logRequest) console.log("GET /");
    res.status(200);
    res.sendFile(rootDirectory + "/html/shopping.html");
});
server.get("/favicon.ico", (req: express.Request, res: express.Response) => {
    // Hier wird das Icon für die Website ausgeliefert
    if (logRequest) console.log("GET favicon.ico");
    res.status(200);
    res.sendFile(rootDirectory + "/image/favicon.ico");
});
server.get("/version", (req: express.Request, res: express.Response) => {
    // Hier wird die Serverversion ausgeliefert
    if (logRequest) console.log("GET version");
    res.status(200);

});

// ----------------------------------------------------------------------------
// CREATE - Neuer Eintrag in die Einkauf
server.post("/create", (req: express.Request, res: express.Response) => {
    ++clientRunCounter;
    // Wert vom Client aus dem JSON entnehmen
    const besitzer: string = String(req.body.besitzer);
    const aufgabe: string = String(req.body.aufgabe);
    const ort : string = String(req.body.ort);
    const datum: Date = new Date(req.body.datum);
    username = besitzer;

    if (logRequest) console.log("Post /create: ", clientRunCounter);

    einkauf_aktuell.liste.push(new Einkauf(besitzer, aufgabe, ort ,datum, 1));

    // Die aktuelle LoP wird gesichert und in einer
    // Datei (logLoPFile_work) gespeichert. Die Datei wird bei jeder Berechnung wieder
    // mit dem aktuellen Stand der LoP überschrieben.
    EinkaufSave(einkauf_aktuell, logEinkaufFile_work);

    // Rendern der aktuellen LoP und Rückgabe des gerenderten Tabellenteils (tbody)
    const html_tbody = renderEinkauf(einkauf_aktuell)
    res.status(200);
    res.send(html_tbody);

});

// ----------------------------------------------------------------------------
// READ
server.get("/read", (req: express.Request, res: express.Response) => {
    // READ - Rückgabe der vollständigen LoP als html-tbody
    ++clientRunCounter;

    const einkausliste_aktuellLength = einkauf_aktuell.liste.length;
    if (logRequest) console.log("GET /read: ", clientRunCounter, einkausliste_aktuellLength);

    if (einkauf_aktuell === undefined) {
        res.status(404)
        res.send("Cleint  does not exist");

    } else {
        // Rendern der aktuellen LoP
        const html_tbody = renderEinkauf(einkauf_aktuell)
        res.status(200);
        res.send(html_tbody);
    }
});

server.post("/read", (req: express.Request, res: express.Response) => {
    // READ -Rückgabe der Tabellenzeile für ändern und löschen
    ++clientRunCounter;

    // Wert vom Client aus dem JSON entnehmen
    const id_act: number = Number(req.body.id_act);

    const lopChange = einkauf_aktuell.getEinkaufEintrag(id_act);

    if (logRequest) console.log("Post /read: ", clientRunCounter, id_act, lopChange);

    if (einkauf_aktuell === undefined || lopChange.getStatus() !== 1) {
        res.status(404)
        res.send("Item " + id_act + " does not exist");

    } else {
        // Rendern der aktuellen LoP
        const html_change = renderEinkaufChange(lopChange);
        res.status(200);
        res.send(html_change);
    }
});
// change - Einkauf-Eintrag ändern
server.post("/change" , (req: express.Request , res : express.Response) =>{
    ++clientRunCounter;
    const id_act: number = Number(req.body.id_act);
    const lopChange = einkauf_aktuell.getEinkaufEintrag(id_act);
    if (logRequest) console.log("Post /read: ", clientRunCounter, id_act, lopChange);

    if (einkauf_aktuell === undefined || lopChange.getStatus() !== 1) {
        res.status(404)
        res.send("Item " + id_act + " does not exist");

    } else {
        // Rendern der aktuellen LoP
        const html_change = change(lopChange);
        res.status(200);
        res.send(html_change);
    }


});
// ----------------------------------------------------------------------------
// UPDATE - Einkauf-Eintrag ändern
server.post("/update", (req: express.Request, res: express.Response) => {
    // Werte vom Client aus dem JSON entnehmen
    ++clientRunCounter;

    const id_act: number = Number(req.body.id_act);
    const besitzer: string = String(req.body.besitzer);
    const aufgabe: string = String(req.body.aufgabe);
    const ort : string = String(req.body.ort);
    const datum: Date = new Date(req.body.datum);

    if (logRequest) console.log("GET /update: ", clientRunCounter, id_act);

    const lopUpdate = einkauf_aktuell.getEinkaufEintrag(id_act);

    if (lopUpdate === undefined || lopUpdate.getStatus() !== 1) {
        res.status(404)
        res.send("Item " + id_act + " does not exist");
    } else {
        lopUpdate.besitzer = besitzer;
        lopUpdate.aufgabe = aufgabe;
        lopUpdate.ort = ort;
        lopUpdate.datum = datum;

        // Sichern der aktuellen LoP in die Datei logLoPFile_work
        EinkaufSave(einkauf_aktuell, logEinkaufFile_work);

        // Rendern der aktuellen LoP
        renderEinkauf(einkauf_aktuell)
        res.status(200);
        res.send("Item " + id_act + " changed");

    }
    // Rückgabe der Werte an den Client
});

// ----------------------------------------------------------------------------
// DELETE - LoP-Eintrag aus der Liste löschen
server.post("/delete", (req: express.Request, res: express.Response) => {
    // Wert vom Client aus dem JSON entnehmen
    ++clientRunCounter;
    const id_act: number = Number(req.body.id_act);

    const lopDelete = einkauf_aktuell.getEinkaufEintrag(id_act);

    if (logRequest) console.log("Post /delete: ", clientRunCounter,
        id_act, lopDelete);

    if (lopDelete === undefined || lopDelete.getStatus() !== 1) {
        res.status(404)
        res.send("Item " + id_act + " does not exist");
    } else {
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
server.get("/save", (req: express.Request, res: express.Response) => {
    /* Die aktuelle LoP wird zur Sicherung und Wiederverwendung in einer Datei
       mit eindeutigem Dateinamen mit dem aktuellen Datumsstempel gespeichert.
     */
    ++clientRunCounter;
    if (logRequest) console.log("Get /save: ", clientRunCounter);

    const logRunDate: string = (new Date()).toISOString().replace(/:/g, "-");
    const logLoPFile_save: string = logEinkaufFile_save_pre    +logRunDate + ".json";

    // Sichern der aktuellen LoP in die Datei logLoPFile_save
    EinkaufSave(einkauf_aktuell, logLoPFile_save);

    res.status(200);
    res.send("LoP saved");
});

// ----------------------------------------------------------------------------
server.use((req, res) => {
    // Es gibt keine reguläre Methode im Server für die Beantwortung des Requests
    ++clientRunCounter;
    if (logRequest) console.log("Fehler 404", req.url);
    res.status(404);
    res.set('content-type', 'text/plain; charset=utf-8')
    const urlAnfrage: string = req.url;
    res.send(urlAnfrage +
        "\n\nDie gewünschte Anfrage kann vom Webserver \"" + serverName +
        "\" nicht bearbeitet werden!");
});


