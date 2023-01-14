// Globale Variablen ----------------------------------------------------------
var serviceName;
var statusCreate = 0; // Status des Eingabemodus: 0 = offen, 1 = eingeben, 2 = ändern
var username; // aktuelle Bearbeiterperson
// Debug Informationen über console.log ausgeben
var logEvent = true; // Ausgabe der Event-Starts in console.log
var logEventFull = false; // Ausgabe der vollständigen Events in console.log
function start() {
    var request = new XMLHttpRequest();
    request.open('GET', 'version');
    request.send();
    request.onload = function (event) {
        // Eventhandler das Lesen der aktuellen Tabelle vom Server
        if (request.status === 200) { // Erfolgreiche Rückgabe
            serviceName = request.response;
            // Version eintragen
            document.getElementById("version-title").innerText = serviceName;
            document.getElementById("version").innerText = serviceName;
            console.log(serviceName);
        }
        else { // Fehlermeldung vom Server
            console.log("Fehler bei der Übertragung", request.status);
            if (logEvent)
                console.log("Fehler bei der Übertragung", request.status, "\n", event);
        }
    };
}
function basisdaten(event) {
    /* Aufbau der Tabelle nach der Eingabe des Bearbeiters
     */
    event.preventDefault();
    username = document.getElementById("user-name").value;
    if (logEvent)
        console.log("Basisdaten: ", username); // Debug
    // Freigabe der LoP-Ausgabe im HTML-Dokument
    var lop_liste = document.getElementById("lop-liste");
    lop_liste.classList.remove("as-unsichtbar");
    lop_liste.classList.add("as-sichtbar");
    // Lesen der aktuellen Tabelle vom Server und Ausgabe in lop-tbody
    renderLoP();
}
function renderLoP() {
    /*
    * Ausgabe der aktuellen LoP und Abschluss ausstehender Nutzer-Interaktionen.
    * Alle Eingabefelder in der LoP-Tabelle werden gelöscht.
    */
    var table_body = document.getElementById("lop-tbody");
    var html_LoP = "";
    // XMLHttpRequest aufsetzen und absenden ----------------------------------
    var request = new XMLHttpRequest();
    // Request starten
    request.open('GET', 'read');
    request.send();
    request.onload = function (event) {
        // Eventhandler für das Lesen der aktuellen Tabelle vom Server
        if (request.status === 200) { // Erfolgreiche Rückgabe
            html_LoP = request.response;
            if (logEventFull)
                console.log("Ergebnis vom Server: ", html_LoP);
            table_body.innerHTML = html_LoP;
            var lopCreateSave = document.getElementById("lop-create-save");
            lopCreateSave.classList.remove("as-unsichtbar");
            lopCreateSave.classList.add("as-sichtbar");
            statusCreate = 0; // Der Status 0 gibt die Bearbeitung aller Events frei.
            // Die ausgegebene Tabelle im Browser entspricht jetzt dem aktuellen
            // Stand.
        }
        else { // Fehlermeldung vom Server
            console.log("Fehler bei der Übertragung", request.status);
            if (logEvent)
                console.log("Fehler bei der Übertragung", request.status, "\n", event);
        }
    };
}
function aufgabe(event) {
    /*
    * Abfragefenster für das Erzeugen (Create) eines neuen Eintrags in der LoP
    * */
    event.preventDefault();
    var command = event.submitter.value;
    if (command === "neu") {
        if (logEvent)
            //console.log("function aufgabe-> create new button clicked"); // Debug
        if (statusCreate === 0) {
            //console.log("statuscreate" + statusCreate);
            statusCreate = 1; // Der Status 1 sperrt die Bearbeitung anderer Events, die nicht zur
            // Eingabe des neuen Einkauf-Eintrags gehören
            var tbody = document.getElementById("lop-tbody");
            var html = tbody.innerHTML; // aktuellen Tabelleninhalt sichern
            //console.log("html " + html);
            var datumNew = (new Date()).toISOString().slice(0, 10); //aktuelles Datum bestimmen
            //console.log("what is datumnew " + datumNew);
            // Aufbau und Ausgabe der Eingabefelder für ein neues Element der LoP
            // Die Eingabefelder werden in der ersten Zeile der Tabelle angelegt
            var get_aufgabe = "<tr class='b-dot-line' data-lop-id='" + undefined + "'> " +
                "<td data-purpose='besitzer' data-lop-id='" + undefined + "'>" +
                "<input name='Besitzer' type='text' data-lop-id='" + undefined +
                "' value = " + username + ">" +
                "</td>" +
                "<td data-purpose='aufgabe' data-lop-id='" + undefined + "'>" +
                " <form>" +
                "<input name = 'Aufgabe' type = 'text'  " +
                "placeholder = 'Aufgabe'  class= 'as-width-100pc' data-input ='aufgabe' required>" +
                "<br>" +
                "<input type = 'submit' value = 'speichern' class='as-button-0' " +
                "data-purpose = 'speichern' data-lop-id = 'undefinded'>" +
                "<input type = 'submit' value = 'zurück' class='as-button' " +
                "data-purpose = 'zurück' data-lop-id = 'undefinded'>" +
                "</form>" +
                "</td>" +
                "<td data-purpose = 'ort' data-lop-id ='" + undefined + "'>" +
                "<input name = 'Ort' type = 'text'  " +
                "placeholder = 'Ort'  class= 'as-width-25pc' id='input_location' data-input ='ort' required>" +
                "</td>>" +
                "<td data-purpose='datum' data-lop-id='" + undefined + "'>" +
                "<input  name='Datum' type='text' " +
                "data-lop-id='" + undefined + "' data-purpose='datum'" +
                "' value = " + datumNew + ">" +
                "</td>" +
                "</tr>";
            tbody.innerHTML = get_aufgabe + html;
        }
    }
    else if (command === "sichern") {
        /* Die Funktion "sichern" ist noch nicht implementiert.
           Es erfolgt in der vorliegenden Version nur eine Ausgabe der vollständigen Liste
           als JSON in die console.log.
         */
        if (logEvent)
            //console.log("function aufgabe -> sichern");
        // XMLHttpRequest aufsetzen und absenden
        var request_1 = new XMLHttpRequest();
        // Request starten
        request_1.open('GET', 'save');
        request_1.send();
        request_1.onload = function (event) {
            // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
            // vom Server
            if (request_1.status === 200) { // Erfolgreiche Rückgabe
                if (logEventFull)
                    console.log("Daten gesichert");
                renderLoP();
            }
            else { // Fehlermeldung vom Server
                console.log("Fehler bei der Übertragung", request_1.status);
                if (logEvent)
                    console.log("Fehler bei der Übertragung", request_1.status, "\n", event);
            }
        };
    }
    else {
        // Clickins Nirgendwo
        if (logEvent)
            console.log("function aufgabe -> ?"); // Debug
    }
}
function createUpdateDelete(event) {
    /*
    * Create, Update und Delete von Einträgen in der LoP
    */
    event.preventDefault();
    if (logEvent)
        console.log("createUpdateDelete -> lop-tbody; click"); // Debug
    if (logEventFull)
        console.log("\"createUpdateDelete -> lop-tbody; click", event); // Debug
    var command = event.target.getAttribute("data-purpose");
    var idSelect = event.target.getAttribute("data-lop-id");
    if (logEvent)
        console.log("command: ", command, "id: ", idSelect); // Debug
    if (command === "zurück") {
        // zurück -------------------------------------------------------------------------------------
        // Rückkehr aus dem aktuellen Abfragefenster ohne Änderung
        if (logEvent)
            console.log("function  createUpdateDelete -> zurück"); // Debug
        renderLoP();
    }
    else if (command === "speichern") {
        // speichern ------------------------------------------------------------------------------
        // Erzeugen (Create) eines neuen Eintrags in der LoP
        if (logEvent)
            console.log("function  createUpdateDelete -> speichern btn clicked"); // Debug
        if (statusCreate === 1) {
            var aufgabe_aktuell = event.target.parentElement[0].value;
            var _aufgabe_aktuell = this.document.getElementById('input_location').value;
            //const ort_aktuell = event.target.nextSibling.parentElement[0].value;
            console.log("Task name  " + aufgabe_aktuell + " location name : "+ _aufgabe_aktuell);
            if(_aufgabe_aktuell === ""){
            alert("location must be given");
           }else{
            if (aufgabe_aktuell === "") {
            alert("Aufgaben must be given");
                // Wenn keine Aufgabe angegeben wurde, wird die Erzeugung des Eintrags abgebrochen.
                renderLoP();
            }else {
                // Entnehmen der Daten für den neuen Eintrag aus dem HTML-Dokument
                var td_actual = event.target.parentElement.parentElement;
                //const aufgabe_aktuell = td_actual.target.parentElement[0].value;
                var besitzer_aktuell = td_actual.previousSibling.childNodes[0].value;
                var ort_aktuell = td_actual.nextSibling.childNodes[0].value;
                var datum_aktuell = td_actual.nextSibling.nextSibling.childNodes[0].value;
                if (logEvent)
                    console.log("eingabe_aktuell: ", besitzer_aktuell, aufgabe_aktuell, ort_aktuell, datum_aktuell); // Debug
                // Übertragen der neuen Aufgabe an den Server ---------------------------
                // XMLHttpRequest aufsetzen und absenden
                var request_2 = new XMLHttpRequest();
                // Request starten
                request_2.open('POST', 'create');
                request_2.setRequestHeader('Content-Type', 'application/json');
                request_2.send(JSON.stringify({
                    "besitzer": besitzer_aktuell,
                    "aufgabe": aufgabe_aktuell,
                    "ort": ort_aktuell,
                    "datum": datum_aktuell,
                    "status": 1
                }));
                request_2.onload = function (event) {
                    // Eventhandler das Lesen der aktuellen Tabelle vom Server
                    if (request_2.status === 200) { // Erfolgreiche Rückgabe
                        renderLoP();
                    }
                    else { // Fehlermeldung vom Server
                        console.log("Fehler bei der Übertragung", request_2.status);
                        if (logEvent)
                            console.log("Fehler bei der Übertragung", request_2.status, "\n", event);
                    }
                };
                renderLoP();
            }
           }

            
            
        }
    }
    else if (command === "besitzer" || command === "aufgabe" || command === "datum" || command == "ort" ||
        (command == "aendern" && statusCreate == 0)) {
        // Ändern aktivieren ----------------------------------------------------------------------
        // Ausgabe der Eingabefelder für die Änderung (Update) eines LoP-Eintrags
        if (logEvent)
            console.log("function  createUpdateDelete -> besitzer, aufgabe, ort,datum"); // Debug
        if (logEventFull)
            console.log("update: ", event.target.parentElement); // Debug
        var asbuttoms = document.getElementById("lop-tbody");
        asbuttoms.classList.remove("as-button-1");
        asbuttoms.classList.add("as-button-2");
        if (statusCreate === 0) {
            statusCreate = 2; // Der Status 2 sperrt die Bearbeitung anderer Events, die nicht zur
            // Bearbeitung der Änderung des LoP-Eintrags gehören
            var mod = void 0;
            var tr_act_1;
            var id_act = void 0;
            if (command != "aendern") {
                tr_act_1 = event.target.parentElement;
                id_act = Number(tr_act_1.getAttribute('data-lop-id'));
                mod = 'read';
            }
            else {
                tr_act_1 = event.target.parentElement.parentElement;
                id_act = Number(tr_act_1.getAttribute('data-lop-id'));
                var request_3 = new XMLHttpRequest();
                request_3.open('POST', 'change');
                request_3.setRequestHeader('Content-Type', 'application/json');
                request_3.send(JSON.stringify({
                    "id_act": id_act
                }));
                mod = 'change';
            }
            if (logEventFull)
                console.log("id_act: ", id_act); // Debug
            // XMLHttpRequest aufsetzen und absenden
            var request_4 = new XMLHttpRequest();
            // Request starten
            request_4.open('POST', mod);
            request_4.setRequestHeader('Content-Type', 'application/json');
            request_4.send(JSON.stringify({
                "id_act": id_act
            }));
            request_4.onload = function (event) {
                // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
                // vom Server
                if (request_4.status === 200) { // Erfolgreiche Rückgabe
                    var html_Change = request_4.response;
                    if (logEventFull)
                        console.log("Ergebnis vom Server: ", html_Change);
                    tr_act_1.innerHTML = html_Change;
                }
                else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request_4.status);
                    if (logEvent)
                        console.log("Fehler bei der Übertragung", request_4.status, "\n", event);
                }
            };
        }
    }
    else if (command === "loeschen") {
        console.log(statusCreate);
        // löschen --------------------------------------------------------------------------------
        if (statusCreate === 0 || statusCreate == 2) {
            /* Ein Element der LoP wird durch das Löschen an dieser Stelle nur deaktiviert
               (Status = 2) und nicht endgültig gelöscht (Status = 3).
            */
            if (logEvent)
                console.log("function  createUpdateDelete -> löschen"); // Debug
            if (logEventFull)
                console.log("löschen: ", event.target); // Debug
            // aktuelles Element ermitteln
            var id_act = Number(event.target.getAttribute('data-lop-id'));
            // XMLHttpRequest aufsetzen und absenden
            var request_5 = new XMLHttpRequest();
            // Request starten
            request_5.open('POST', 'delete');
            request_5.setRequestHeader('Content-Type', 'application/json');
            request_5.send(JSON.stringify({
                "id_act": id_act
            }));
            request_5.onload = function (event) {
                // Eventhandler für das Lesen der aktuellen Tabellenzeile zum Ändern oder Löschen
                // vom Server
                if (request_5.status === 200) { // Erfolgreiche Rückgabe
                    if (logEventFull)
                        console.log("Gelöscht: ");
                    renderLoP();
                }
                else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request_5.status);
                    if (logEvent)
                        console.log("Fehler bei der Übertragung", request_5.status, "\n", event);
                }
            };
        }
    }
    else if (command === "speichern2" || command == "aendern") {
        // ändern ---------------------------------------------------------------------------------
        if (statusCreate === 2) {
            // Das aktuelle Element der LoP wird entsprechend der Nutzereingabe geändert
            if (logEvent)
                console.log("function  createUpdateDelete -> ändern"); // Debug
            if (logEventFull)
                console.log("ändern: ", event.target); // Debug
            var id_act = Number(event.target.getAttribute('data-lop-id'));
            // XMLHttpRequest aufsetzen und absenden
            var request_6 = new XMLHttpRequest();
            // Geänderte Daten aus HTML-Dokument übernehmen
            var td_actual = event.target.parentElement.parentElement;
            var aufgabe_aktuell = td_actual.childNodes[0].value;
            var ort_aktuell = td_actual.nextSibling.childNodes[0].value;
            var besitzer_aktuell = td_actual.previousSibling.childNodes[0].value;
            var datum_aktuell = td_actual.nextSibling.nextSibling.nextSibling.childNodes[0].value;
            if (logEvent)
                console.log("ändern: ", besitzer_aktuell, aufgabe_aktuell, datum_aktuell, ort_aktuell); // Debug
            // aktuelles Element ermitteln
            // Request starten
            request_6.open('POST', 'update');
            request_6.setRequestHeader('Content-Type', 'application/json');
            request_6.send(JSON.stringify({
                "id_act": id_act,
                "besitzer": besitzer_aktuell,
                "aufgabe": aufgabe_aktuell,
                "ort": ort_aktuell,
                "datum": datum_aktuell
            }));
            request_6.onload = function (event) {
                // Eventhandler das Lesen der aktuellen Tabelle vom Server
                if (request_6.status === 200) { // Erfolgreiche Rückgabe
                    renderLoP();
                }
                else { // Fehlermeldung vom Server
                    console.log("Fehler bei der Übertragung", request_6.status);
                    if (logEvent)
                        console.log("Fehler bei der Übertragung", request_6.status, "\n", event);
                }
            };
        }
    }
    else {
        // Clicks ins Nirgendwo -------------------------------------------------------------------
        if (logEvent)
            console.log("function  createUpdateDelete -> ?"); // Debug
    }
}
document.addEventListener("DOMContentLoaded", function () {
    start();
    document.getElementById("eingabe-basisdaten").addEventListener("submit", function (event) {
        /* Nach der Eingabe des Bearbeiternamens wird die Tabelle aufgebaut
         */
        if (logEvent)
            console.log("eingabe-basisdaten; submit"); // Debug
        basisdaten(event);
    });
    document.getElementById("lop-create-save").addEventListener("submit", function (event) {
        /* Callback für die Buttons
           - "neu" -> neuen Eintrag für die LoP abfragen
           - "sichern" -> aktuelle LoP auf dem Server sichern
         */
        if (logEvent)
            console.log("lop-create-save; submit"); // Debug
        if (logEventFull)
            console.log("lop-create-save; submit", event); // Debug
        aufgabe(event);
    });
    document.getElementById("lop-tbody").addEventListener("click", function (event) {
        /* Callback für die Buttons
           - "speichern" -> Erzeugen eines neuen Eintrags in der LoP anhand der Eingabedaten (CREATE)
           - "zurück" -> abbrechen der aktiven Aktion
           - "ändern" -> ändern eines ausgewählten Eintrags in der LoP anhand der Eingabedaten (UPDATE)
           - "löschen" -> löschen eines ausgewählten Eintrags (DELETE)
         */
        event.preventDefault();
        if (logEvent)
            console.log("lop-list-render; click"); // Debug
        if (logEventFull)
            console.log("llop-list-render; click", event); // Debug
        createUpdateDelete(event);
    });
});
//# sourceMappingURL=shopping.js.map