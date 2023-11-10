package com.marcapo.demo.service;

import java.util.List;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.marcapo.demo.model.Person;
import com.marcapo.demo.repository.BreweryRepository;
import com.marcapo.demo.repository.PersonRepository;
import com.mongodb.client.FindIterable;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class DemoService {

    private final BreweryRepository breweryRepository;
    private final PersonRepository personRepository;
    private final MongoTemplate mongoTemplate;

    public void doSomeAwesomeStuff() {

    }

}