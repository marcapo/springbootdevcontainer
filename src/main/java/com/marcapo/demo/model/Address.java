package com.marcapo.demo.model;

import lombok.Data;

@Data
public class Address {

    private String city;

    private String country;

    private String street;

    // longitude/latitude need to be replaced by a proper GeoJson object - or atleast mapped correctly when writing/reading
    private String latitude;

    private String longitude;

}
