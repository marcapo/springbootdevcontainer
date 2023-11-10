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
        "birthDate": ISODate("1969-10-06T03:51:26.321+0100"),
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
    db.person.find({ "favoriteBeers": { $not: { $size: 0 } }})

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

use("demo");
db.person.updateOne({firstName: "Bob"},{$set:{lastName:"Dr. Ing. Fest"}});

use("demo");
db.person.updateOne({firstName: "Bob"},{$push:{favoriteBeers:"Double Bastard Ale"}});

use("demo");
db.getCollection("person").deleteOne({
    "firstName" : "Peter",
    "lastName" : "Biedermann"
});

db.person.find(
    { "favoriteBeers": { $not:{$size: 0} } },
    {firstName:1,lastName:1,favoriteBeers:1},
    )
    .sort({birthDate:1,_id:1})
    .limit(3);

use("demo");
db.person.updateMany({"address.location":{$exists:false}},[
    {$set: {"address.location":
        {type:"Point",
        coordinates:[
        {$toDouble:{$replaceOne:{input:"$address.longitude",find:",",replacement:"."}}},
        {$toDouble:{$replaceOne:{input:"$address.latitude",find:",",replacement:"."}}}
        ]}}
    },
    {$unset:["address.longitude","address.latitude"]},
    ]);
db.person.createIndex( { "address.location" : "2dsphere" } );
db.person.find({ 
    "favoriteBeers": { $not: { $size: 0 } },
    "address.location":{
     $near: {
       $geometry: {
          type: "Point" ,
          coordinates: [120.82756,62.331894]
       },
       $maxDistance: 2500000,
       $minDistance: 0
     }
   }} ,
).sort({"address.location":1});


use("demo");
db.person.find({$and:[{favoriteBeers:{$not:{$size:0}}},{favoriteBeers:
    {$not:{$elemMatch:{$not:/IPA/}}}
    }]});


use("demo");
db.brewery.aggregate([
    {$set: {size_sort:{$size:"$beers"}}},
    {$sort:{size_sort:-1,_id:1}},
    {$limit:1},
    ]);


use("demo");
db.getCollection("person").aggregate([
    {$match:{firstName:"Bob"}},
    {$limit:1},
    {$set:{age:{$subtract:[ {$year:new Date()},{$year:"$birthDate"}]}}},
    {$project:{name:{$concat:["$firstName"," ","$lastName"]},age:"$age"}}
    ]);

use("demo");
db.getCollection("person").aggregate([
    {$match:{favoriteBeers:{$not:{$size:0}}}},
    {$unwind:"$favoriteBeers"},
    {$group:{_id:"$favoriteBeers",count:{$sum:1}}},
    {$sort:{count:-1,_id:1}},
    {$limit: 10},
    {$group:{_id:null,beers:{$push:"$$CURRENT"}}},
    {$unwind:{path:"$beers",includeArrayIndex:"rank"}},
    {$set:{"beers.rank":{$add:["$rank",1]}}},
    {$replaceRoot:{newRoot:"$beers"}},
    {$unset:"$count"},
    ]);
    
    use("demo");
    db.getCollection("person").aggregate([
        {$match:{favoriteBeers:/Stout/}},
        {$sort:{birthDate:1,_id:1}},
        {$limit:100},
        {
            $set: {
              favoriteBeers: {
                $filter: {
                  input: "$favoriteBeers",
                  cond: {
                    $regexMatch: {
                      input: "$$this",
                      regex: /Stout/
                    }
                  }
                }
              }
            }
          },
          {$unwind:"$favoriteBeers"},
          {$lookup:{
              from:"brewery",
              as: "breweries",
              let:{favorite:"$favoriteBeers"},
              pipeline:[
              {$unwind:"$beers"},
              {$match:{$expr:{$eq:["$beers.name","$$favorite"]}}},
              {$project:{name:"$name",beer:"$$favorite"}},
              {$group:{_id:"$beer",brewery:{$first:"$$CURRENT"}}},
              {$replaceRoot:{newRoot:"$brewery"}},
              ]
          }},
        {$group:{_id:"$_id",person:{$first:"$$CURRENT"},favorites:{$push:"$$CURRENT.breweries"}}},
        {$set:{"person.favoriteBeers":{
                  $reduce: {
                    input: "$favorites",
                    initialValue: [],
                    in: {$concatArrays: ['$$value', '$$this']}
                  }
                }}},
        {$replaceRoot:{newRoot:"$person"}},
        {$project:{name:{$concat:["$firstName"," ","$lastName"]},favoriteBeers:"$favoriteBeers"}}
        ]);

use("demo");
db.person.updateMany(
    {$and:[{$expr:{$gte:[{$size:"$favoriteBeers"},2]}},{favoriteBeers:/Doppelbock/}]},
    [
    {$set:{birthDate:{
        $dateAdd: {
            startDate: "$birthDate",
            unit: "year",
            amount: 2,
        }
    }}}
    ]);
            


use("demo");
db.person.aggregate([
    {$match:{firstName:"Bob"}},
    {$lookup:{
        from:"person",
        as:"persons",let:{home:"$address.location"},
        pipeline:[
        {
         $geoNear: {
            near: "$$home",
            distanceField: "distance",
            maxDistance: 250000,
            query: {favoriteBeers:{$not:{$size:0}}},
            spherical: true
         }
       },     
        ]}},
    {$unwind:"$persons"},
    {$unwind:"$persons.favoriteBeers"},
    {$group:{_id:"$persons.favoriteBeers",count:{$sum:1}}},
    {$sort:{"count":-1}},
    ]);
    
use("demo");

db.person.find({
    favoriteBeers: /Ale/
})
.sort({birthDate:-1,_id:1})
.limit(10)
.hint( { $natural : 1 } ) //compare with and without
.explain("executionStats");
db.person.createIndex({birthDate:1});
db.person.createIndex({favoriteBeers:1});