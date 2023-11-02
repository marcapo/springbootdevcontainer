package com.marcapo.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.marcapo.demo.model.Brewery;

public interface BreweryRepository extends MongoRepository<Brewery, String> {

}
