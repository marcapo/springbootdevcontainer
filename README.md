# springbootdevcontainer

Dieser Container bringt eine Entwicklungsumgebung für Java mit.

Hands-On Aufgaben:

- Aufsetzen einer MongoDB (Community)
-- Konfiguration als ReplicaSet (Standalone)
-- Einspielen eines Datenbank-Dumps

- Datenstruktur
-- Models Anhand der gegeben Datenstruktur aus den Dumps erstellen
-- MongoRepositories für die beiden Collections anlegen

- Anlegen und Speichern von Daten
-- Shell bzw. VSCode Plugin MongoDB
-- finde Bob
-- füge Bob hinzu
-- finde alle Neider ohne Favoriten
-- finde alle Jünglinge mit mindestens 2 Favoriten die noch nicht 16 sind

- Einfache Datenmanipulation​
-- Ändere den Nachnamen Bobs zu "Dr. Ing. Fest"
-- Lösche den Schmäher Peter Biedermann
-- Füge "Double Bastard Ale" zu den Favoriten von Bob hinzu

- Projektionen​
-- zeige Name und Favoriten der 3 ältesten Someliers an
-- Wann wurde Bob geboren?

- GeoQueries​
-- Umkreissuche aller Liebhaber mit mindestens einem Favoriten um Bobs Heimatstadt im Radius von 250km sortiert nach Entfernung?

- NestedElement Queries​
-- Welche Biere verwenden 'Cluster' Hopfen und 'Vicotry' Malz?
-- suche nach Personen, die ausschließlich IPA verköstigen

- Benutzen der Aggregation Pipeline​
-- finde die Brauerei mit dem größten Angebot
-- wie alt ist Bob eigentlich?
-- erstelle eine Übersicht der 10 beliebtesten Biere
-- finde die 100 ältesten le Stout-Trinker und deren Lieblingsbrauereien
-- verjünge alle Doppelbock-Trinker mit mindestens 2 Favoriten um 2 Jahre
-- Welche Biere finden den meisten Absatz um Bobs Heimat herum in einer Region von 250km?

- Query Analyse und Optimierung
-- finde die 10 jüngsten Ale-Genießer