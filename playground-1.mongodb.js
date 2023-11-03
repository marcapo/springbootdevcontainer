/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// find Bob
use('demo');
console.log(
    db.person.find({ firstName: "Bob" }));

// add a Bob
use('demo');
console.log(
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
    }));

// check for Bob
use('demo');
console.log(
    JSON.parse(JSON.stringify(db.person.find({ firstName: "Bob" }).toArray())));

// check for guys without a favorite beer in two differnt ways
use('demo');
console.log(
    db.person.find({ "favoriteBeers": { $size: 0 } }));

use('demo');
console.log(
    db.person.find({ "favoriteBeers": { $size: 0 } }).count());

use('demo');
console.log(
    db.person.find({ "favoriteBeers.0": { $exists: 0 } }));

use('demo');
console.log(
    db.person.find({ "favoriteBeers.0": { $exists: 0 } }).count());

// check for babies that favor more then one beer
use('demo');
console.log(
    db.person.find({ "favoriteBeers.1": { $exists: true }, birthDate: { $gte: ISODate("2007-11-15 00:00:00.000Z") } }).toArray());

use('demo');
console.log(
    db.person.find({ "favoriteBeers.1": { $exists: true }, birthDate: { $gte: ISODate("2007-11-15 00:00:00.000Z") } }).count());


