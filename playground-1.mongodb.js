/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('demo');

// Search for documents in the current collection.
db.getCollection('person')
    .find({ firstName: "Bob" });

db.person.insertOne({
    "firstName": "Bob",
    "lastName": "Martin",
    "address": {
        "city": "Ost Damian",
        "country": "Bhutan",
        "street": "Kursiefen 85c",
        "latitude": "62,331894",
        "longitude": "120,82756"
    },
    "birthDate": "Mon Oct 06 03:51:26 CET 1969",
    "phoneNumber": "+49-1555-8264668",
    "favoriteBeers": [
        "Founders Kentucky Breakfast",
    ],
    "_class": "com.marcapo.evenmoredynamictestservice.test.Person"
});


db.getCollection('person')
    .find({ firstName: "Bob" });


