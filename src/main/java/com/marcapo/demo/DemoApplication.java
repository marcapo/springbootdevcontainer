package com.marcapo.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.marcapo.demo.service.DemoService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@SpringBootApplication(scanBasePackages = "com.marcapo")
public class DemoApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	private final DemoService demoService;

	@Override
	public void run(String... args) throws Exception {
		demoService.doSomeAwsomeStuff();
	}

}
