# springbootdevcontainer

Dieser Container bringt eine Entwicklungsumgebung für Java mit.

Hands-On Aufgaben:

- Aufsetzen einer MongoDB (Community)
-- Konfiguration als ReplicaSet (Standalone)
-- Einspielen eines Datenbank-Dumps

- ??? Schema ausdenken?

- Anlegen und Speichern von Daten
-- Shell bzw. VSCode Plugin MongoDB
-- Beispieldaten einspielen

- Einfaches Laden von Daten​
-- finde alle Nutzer ohne Favoriten
-- finde alle Nutzer mit mindestens 2 Favoriten die vor 1980 geboren sind
-- finde Sven

- Einfache Datenmanipulation​
-- Ändere den Nachnamen des Nutzers Blah zu Blubb
-- Lösche Nutzer 42
-- Füge "Double Bastard Ale" zu den Favoriten des Nutzers 1337 hinzu


- Projektionen​
-- zeige Name und Favoriten der 3 ältesten Someliers an

- GeoQueries​
-- Umkreissuche aller Liebhaber mit mindestens einen Favoriten um die Stadt TODO im Radius von 25km?


    NestedElementQueries​

    Transaktionen​

- Benutzen der Aggregation Pipeline​
-- erstelle eine Übersicht der 100 beliebtesten Biere
-- verjünge alle Personen mit mindestens 3 Favoriten um 2 Jahre

- Query Analyse und Optimierung
-- finde die jünsten Ale-Genießer