package com.marcapo.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.marcapo.demo.model.Person;

public interface PersonRepository extends MongoRepository<Person, String> {

}
