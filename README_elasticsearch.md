ElasticSearch 

Elasticsearch ships with a wide range of built-in analyzers, which can be used in any index without further configuration:

Standard Analyzer
    The standard analyzer divides text into terms on word boundaries, as defined by the Unicode Text Segmentation algorithm. It removes most punctuation, lowercases terms, and supports removing stop words. 
Simple Analyzer
    The simple analyzer divides text into terms whenever it encounters a character which is not a letter. It lowercases all terms. 
Whitespace Analyzer
    The whitespace analyzer divides text into terms whenever it encounters any whitespace character. It does not lowercase terms. 
Stop Analyzer
    The stop analyzer is like the simple analyzer, but also supports removal of stop words. 
Keyword Analyzer
    The keyword analyzer is a “noop” analyzer that accepts whatever text it is given and outputs the exact same text as a single term. 
Pattern Analyzer
    The pattern analyzer uses a regular expression to split the text into terms. It supports lower-casing and stop words. 
Language Analyzers
    Elasticsearch provides many language-specific analyzers like english or french. 
Fingerprint Analyzer
    The fingerprint analyzer is a specialist analyzer which creates a fingerprint which can be used for duplicate detection. 
Custom Analyzer
    Define tokenizer, filter, etc to the specific need


curl -X PUT "localhost:9200/french_example?pretty" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "analysis": {
      "filter": {
        "french_elision": {
          "type":         "elision",
          "articles_case": true,
          "articles": [
              "l", "m", "t", "qu", "n", "s",
              "j", "d", "c", "jusqu", "quoiqu",
              "lorsqu", "puisqu"
            ]
        },
        "french_stop": {
          "type":       "stop",
          "stopwords":  "_french_" 
        },
        "french_keywords": {
          "type":       "keyword_marker",
          "keywords":   ["Example"] 
        },
        "french_stemmer": {
          "type":       "stemmer",
          "language":   "light_french"
        }
      },
      "analyzer": {
        "rebuilt_french": {
          "tokenizer":  "standard",
          "filter": [
            "french_elision",
            "lowercase",
            "french_stop",
            "french_keywords",
            "french_stemmer"
          ]
        }
      }
    }
  }
}
'

curl -X POST "localhost:9200/_analyze?pretty" -H 'Content-Type: application/json' -d'
{
  "analyzer": "whitespace",
  "text":     "The quick brown fox jumps over the lazy dog."
}
'

curl -X POST "localhost:9200/_analyze?pretty" -H 'Content-Type: application/json' -d'
{
  "tokenizer": "standard",
  "filter":  [ "lowercase", "asciifolding" ],
  "text":      "Is this a déja vu?"
}
'

curl -X GET "localhost:9200/french_example/_analyze?pretty" -H 'Content-Type: application/json' -d'
{
  "analyzer": "rebuilt_french", 
  "text":     "Is this a déjà vu?"
}
'
curl -X GET "localhost:9200/_analyze?pretty" -H 'Content-Type: application/json' -d'
{
  "analyzer": "french", 
  "text":     "Is this a déjà vu?"
}
'



curl -XPOST "localhost:9200/_bulk?pretty" -H 'Content-Type: application/json' --data-binary @shakespeare.json

curl -H 'Content-type: application/json' -XPOST 'http://localhhost:9200/shakespeare_act/_search' -d '{
 "size": 0,
 "aggs": {
  "plays": {
   "terms": {
    "field": "play_name.keyword",
    "size": 1000
   },
   "aggs": {
    "acts": {
     "terms": {
      "field": "text_entry.keyword",
      "size": 1000
     }
    }
   }
  }
 }
}'

//fuzzy 
curl -H 'Content-type: application/json' -XPOST 'http://localhost:9200/shakespeare_act/_search' -d '{
 "size": 10000,
 "query": {
  "fuzzy": {
   "play_name": {
    "value": "rihcard"
   }
  }
 },
 "aggs": {
  "plays": {
   "terms": {
    "field": "play_name.keyword",
    "size": 1000
   },
   "aggs": {
    "acts": {
     "terms": {
      "field": "text_entry.keyword",
      "size": 1000
     }
    }
   }
  }
 }
}'

https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-rest-overview.html

curl -X POST "localhost:9200/_sql?format=txt" -H 'Content-Type: application/json' -d'
{
  "query": "SELECT * FROM shakespeare_act ORDER BY play_name DESC LIMIT 5"
}
'

curl -XPOST 'http://localhost:9200/_sql/translate&pretty' -H 'Content-type: application/json' -d '
{
 "query": "SELECT * FROM shakespeare_act ORDER BY play_name DESC LIMIT 5"
}
'
