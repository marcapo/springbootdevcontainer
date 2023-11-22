//
// REQUIREMENT: MongoDB 7.x
//

// setup db
sudo apt-get install -y mongodb-org // install
sudo mkdir -p /data/db // create data folder
echo "START MONGODB"
sudo mongod --replSet local00 & // start a replicaSet as background process
sudo sleep 5 // wait for startup
echo "INIT REPLICA"
sudo mongosh --eval "rs.initiate();" // init the replica
sudo sleep 5
echo "RESTORE"
sudo mongorestore --gzip -d demo src/main/resources/dumps/ // dump is zipped
//


/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// select db
use("demo");

// find Bob
    db.person.find({ firstName: "Bob" });

// add a Bob
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
    });

// verify Bob's existence
    db.person.exists({ firstName: "Bob" });

// check for guys without a favorite beer in two differnt ways
    db.person.find({ "favoriteBeers": { $size: 0 } });
    db.person.find({ "favoriteBeers.0": { $exists: false } }) // false/0 or true/1 are legit bits
    db.person.find({ "favoriteBeers.0": { $exists: 0 } });

// check for minors that favor more than one beer
    db.person.find({ 
        "favoriteBeers.1": { $exists: true }, // using array position
        birthDate: { $gte: ISODate("2007-11-15 00:00:00.000Z") } 
    });
    db.person.find({$and: [
        { $expr: { $gt: [ { $size: "$favoriteBeers" }, 0 ] } }, // expression, because we cannot combine $size and $gt that easy
        { birthDate: { $gte: ISODate("2007-11-15 00:00:00.000Z") } }
    ]});

// update/change some of Bob's data and preferences    
    db.person.updateOne({firstName: "Bob"},{$set:{lastName:"Dr. Ing. Fest"}}); // $set manipulates a single attribute
    db.person.updateOne({firstName: "Bob"},{$push:{favoriteBeers:"Double Bastard Ale"}}); // $push adds an element to a list, duplicates are possible ($addToSet - no duplicates)

    // delete the first person matching the criteria - deleteMany would remove anyone matching
    db.getCollection("person").deleteOne({
    "firstName" : "Peter",
    "lastName" : "Biedermann"
});

// find the 3 oldest persons having atleast one favourite
db.person.find(
    { "favoriteBeers": { $not:{$size: 0} } }, // not empty
    {firstName:1,lastName:1,favoriteBeers:1}, // projection/view
    )
    .sort({birthDate:1,_id:1}) // sort by birthdate ascending and _id for consistent order
    .limit(3);

// Bob's date of birth
db.person.find({firstName: "Bob"}, { birthDate: 1}); //show only birthDate (1)

// the data in the dump cannot be queried for location because it has flaws
// we need a single field for the location in GeoJSON format, the fields latitude/longitute contain a number as a string with a comma
// update all without the new field in an aggregation pipeline
db.person.updateMany({"address.location":{$exists:false}},
    [  
    {$set: {"address.location":
        // set a field in GeoJSON format we later can query on { type, coordinates:[lon, lat] }
        {type:"Point",
        coordinates:[
        {$toDouble:{$replaceOne:{input:"$address.longitude",find:",",replacement:"."}}}, // replace the comma with a dot, then convert to double
        {$toDouble:{$replaceOne:{input:"$address.latitude",find:",",replacement:"."}}}
        ]}}
    },
    {$unset:["address.longitude","address.latitude"]}, // remove the old fields
    ]);
db.person.createIndex( { "address.location" : "2dsphere" } ); // create a geospatial index
// find fellow mates around Bob's area
db.person.find({ 
    "favoriteBeers": { $not: { $size: 0 } },
    "address.location":{
     $near: {   // query around a point up to a max distance
       $geometry: { // Bob's address as Point
          type: "Point" ,
          coordinates: [120.82756,62.331894]
       },
       $maxDistance: 250000, // 250km radius 
       $minDistance: 0
     }
   }} ,
).sort({"address.location":1}); // sort by distance ascending

// this will find everyone having IPA on their list
db.person.find({$and:[  // filter on tht same attribute needs explicit $and/$or
    {favoriteBeers:{$not:{$size:0}}},
    {favoriteBeers:/IPA/} // regex on the list of names, short for { $regex: /pattern/, $options:"imxs"}
    ]});

    // this will find everyone having solely IPA as favourite
db.person.find({$and:[
    {favoriteBeers:{$not:{$size:0}}},
    {favoriteBeers:{$not:{$elemMatch:{$not:/IPA/}}}} // double negation and $elemMatch to rule out other types of beer
    ]});

// find breweries that brew a beer with a specific combination
db.brewery.find({beers:{$elemMatch:{hop:"Cluster",malt:"Victory"}}}); // $elemMatch is required to find the combination
//else the query results in an any-of match
db.brewery.find({"beers.hop":"Cluster","beers.malt":"Victory"}); // wrong, will match on either the hop or the malt

// find the brewery with the biggest offerings
db.brewery.aggregate([  // using aggregation piepline because we want to sort on the length of a list and not some hash value
    {$set: {size_sort:{$size:"$beers"}}}, // set a helper attribute to sort on based on the size
    {$sort:{size_sort:-1,_id:1}}, // sort on the newly added attribute
    {$limit:1}, // give us the first match
    ]);

// who old is Bob
db.getCollection("person").aggregate([ // aggregation, so we can calculate the age
    {$match:{firstName:"Bob"}}, // look for Bob
    {$limit:1}, // there is only one Bob, we know that
    {$set:{age:{$subtract:[ {$year:new Date()},{$year:"$birthDate"}]}}}, // set the age as difference of the years of now and the birthDate
    {$project:{name:{$concat:["$firstName"," ","$lastName"]},age:"$age"}} // project Bob's full name and age
    ]);

// the 10 most favoured beers
db.getCollection("person").aggregate([
    {$match:{favoriteBeers:{$not:{$size:0}}}}, // filter out irrelevant data ahead
    {$unwind:"$favoriteBeers"}, // create a document for every entry of the favourites, duplicating the person {p1,beers:[b1,b2]} => {p1,beers:b1},{p1,beers:b2}
    {$group:{_id:"$favoriteBeers",count:{$sum:1}}}, // group the same person-beer together and count the occurence
    {$sort:{count:-1,_id:1}}, // sort descending
    {$limit: 10}, // limit to the top 10
    // additonal adding a ranking in numbers
    {$group:{_id:null,beers:{$push:"$$CURRENT"}}}, // group all documents into one (null) with the list of all person-beer
    {$unwind:{path:"$beers",includeArrayIndex:"rank"}}, // split the grouped document again, taking advantage of the index as rank
    {$set:{"beers.rank":{$add:["$rank",1]}}}, // move the rank to the nested beer document
    {$replaceRoot:{newRoot:"$beers"}}, // make the nested beer document the new root document, discarding the surrounding person data {p1, beer:b1} => {b1}   
    {$unset:"$count"}, // remove irrelevant fields
    ]);
    
// find the 100 oldest persons favouring Stout and a brewery provinding it
db.getCollection("person").aggregate([
        // filter, sort and limit to the 100 oldest
        {$match:{favoriteBeers:/Stout/}},
        {$sort:{birthDate:1,_id:1}},
        {$limit:100},
        // filter out any non-Stout favourite
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
          {$unwind:"$favoriteBeers"}, // flatten the favoriteBeers into documents
          {$lookup:{
              from:"brewery", // join each beer with a brewery
              as: "breweries",
              let:{favorite:"$favoriteBeers"}, // define variable for further processing
              pipeline:[
              {$unwind:"$beers"}, // unwind the list of beers of each brewery because it is a nested object list
              {$match:{$expr:{$eq:["$beers.name","$$favorite"]}}}, // filter out breweries not providing any of the favourites
              {$project:{name:"$name",beer:"$$favorite"}}, // reduce unwanted information
              {$group:{_id:"$beer",brewery:{$first:"$$CURRENT"}}}, // reverse the $unwind of beers, add the first matching brewery
              {$replaceRoot:{newRoot:"$brewery"}}, // discard the duplicated brewery data (brewery-beers-brewery), return only the beers-brewery
              ]
          }},
        {$group:{_id:"$_id",person:{$first:"$$CURRENT"},favorites:{$push:"$$CURRENT.breweries"}}}, // revert again the $unwind stage and add the newly aquired beers-brewery
        {$set:{"person.favoriteBeers":{ // we merge the list of arrays [[beers],[beers]] into a single list
                  $reduce: {
                    input: "$favorites",
                    initialValue: [],
                    in: {$concatArrays: ['$$value', '$$this']}
                  }
                }}},
        {$replaceRoot:{newRoot:"$person"}}, // flatten the grouped documents by discarding the surrounding document {id,{person:{id}}} => {person:{id}} 
        {$project:{name:{$concat:["$firstName"," ","$lastName"]},favoriteBeers:"$favoriteBeers"}} // project and simply show the name and list of beers including the brewery
        ]);

// Doppelbock makes younger - using update with aggregation pipeline
db.person.updateMany(
    {$and:[
        {$expr:{$gte:[{$size:"$favoriteBeers"},2]}}, // expression to combine size and gte
        {favoriteBeers:/Doppelbock/}]}, // check for the desired type of beer
    [   //pipeline, updating a single attribute
    {$set:{birthDate:{ // replace birthDate
        $dateAdd: { // with the birthDate itself plus two years
            startDate: "$birthDate",
            unit: "year",
            amount: 2,
        }
    }}}
    ]);

// get the most liked beers around Bob's hood
db.person.aggregate([
    {$match:{firstName:"Bob"}}, // we use Bob's location as a start
    {$limit:1}, // highlander rule
    {$lookup:{ // we do a selfjoin now
        from:"person",
        as:"persons",
        let:{home:"$address.location"}, // define variables that can be used further, here: Bob's location
        pipeline:[ // pipelining again
        {
         $geoNear: { // filter for others around Bob (geo stages can only be the first stage in a pipeline)
            near: "$$home", // the variable we defined before, acessed by double $
            distanceField: "distance", // this is an invisible field for internal computing and comparision
            maxDistance: 250000,
            query: {favoriteBeers:{$not:{$size:0}}}, // filter out irrelevant documents
            spherical: true // query a plane cirle or a sphere - relevant in edge cases around the poles
         }
       },     
        ]}},
    {$unwind:"$persons"}, // make the bob-persons into seperate documents
    {$unwind:"$persons.favoriteBeers"}, // split bob-person-beers into bob-person-beer
    {$group:{_id:"$persons.favoriteBeers",count:{$sum:1}}}, // group and count the beers again
    {$sort:{"count":-1}}, // rank the result
    ]);

// query analysis
db.person.createIndex({birthDate:1}); // sorting on lots of date requires an index to be able to sort in memory, else having a permormance penalty by sorting on disk
db.person.createIndex({favoriteBeers:1}); // index the favourites we like to search on so often
db.person.find({favoriteBeers: /Ale/}) // regex on an index list (multi index) has a bad performance
    .sort({birthDate:-1,_id:1})
    .limit(10)
    .hint( { $natural : 1 } ) // compare with and without index => force the usage of no index
    .explain("executionStats"); // stats regarding the execution, which plan did win, indices used, documents visited