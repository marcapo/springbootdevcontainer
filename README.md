# springbootdevcontainer

Dieser Container bringt eine Entwicklungsumgebung für Java mit.

Hands-On Aufgaben:

- Aufsetzen einer MongoDB (Community) +
-- Konfiguration als ReplicaSet (Standalone) +
-- Einspielen eines Datenbank-Dumps +

- Datenstruktur +
-- Models Anhand der gegeben Datenstruktur aus den Dumps erstellen +
-- MongoRepositories für die beiden Collections anlegen +

- Anlegen und Speichern von Daten
-- Shell bzw. VSCode Plugin MongoDB +
-- finde Bob +
-- füge Bob hinzu +
-- finde alle Neider ohne Favoriten +
-- finde alle Jünglinge mit mindestens 2 Favoriten die noch nicht 16 sind +
-- finde die Brauerei mit dem größten Angebot

- Einfache Datenmanipulation​ //TODO
-- Ändere den Nachnamen Bobs zu "Dr. Ing. Fest"
-- Lösche Nutzer 42
-- Füge "Double Bastard Ale" zu den Favoriten von Sven hinzu

- Projektionen​
-- zeige Name und Favoriten der 3 ältesten Someliers an
-- wie alt ist Sven eigentlich?

- GeoQueries​
-- Umkreissuche aller Liebhaber mit mindestens einem Favoriten um die Stadt TODO im Radius von 25km?

- NestedElement Queries​
-- suche nach Personen, die Ausschließlich Weißbier verköstigen

- Benutzen der Aggregation Pipeline​
-- erstelle eine Übersicht der 100 beliebtesten Biere
-- finde alle Pils-Trinker und deren Lieblingsbrauereien
-- verjünge alle Personen mit mindestens 3 Favoriten um 2 Jahre
-- liste den nähesten Kunden einer Brauerei

- Query Analyse und Optimierung
-- finde die 10 jüngsten Ale-Genießer

    Transaktionen​ //TODO