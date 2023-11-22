package com.marcapo.demo.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document
public class Person {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    private Address address;

    private Instant birthDate;  // or usage of Date

    private String phoneNumber;

    private List<String> favoriteBeers = new ArrayList<>();

}
