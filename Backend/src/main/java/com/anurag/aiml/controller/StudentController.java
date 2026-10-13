package com.anurag.aiml.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anurag.aiml.entity.Student;
import com.anurag.aiml.jwt.JwtService;
import com.anurag.aiml.service.StudentService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService service;

    @Autowired
    private JwtService jwtServices;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // REGISTER
    @PostMapping("/register")
    public Student addStudent(
            @RequestBody Student newStudent) {

        return service.addingNewStudent(newStudent);
    }

    // GET ALL STUDENTS
    @GetMapping("/get")
    public List<Student> getStudents() {

        return service.get();
    }

    // GET STUDENTS WITH PAGINATION + SORTING
    @GetMapping("/get/page")
    public Page<Student> getting(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String sortDirection) {

        return service.getUsers(
                page,
                size,
                sortDirection
        );
    }

    // GET STUDENT BY ID
    @GetMapping("/get/{id}")
    public Student getStudentById(
            @PathVariable Long id) {

        return service.getStudentById(id);
    }

    // UPDATE STUDENT
    @PutMapping("/update/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        return service.updateUser(id, student);
    }

    // DELETE STUDENT
    @DeleteMapping("/delete/{id}")
    public String deleteStudent(
            @PathVariable Long id) {

        service.deleteByID(id);

        return "Student Deleted Successfully";
    }

    // LOGIN WITH JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student student) {

        Student existingUser =
                service.LoginUser(student);

        if (existingUser == null) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid Email or Password");
        }

        String token =
                jwtServices.generateToken(
                        existingUser.getEmail()
                );

        return ResponseEntity.ok(token);
    }

    // SEARCH BY NAME
    @GetMapping("/search/name/{name}")
    public List<Student> searchByName(
            @PathVariable String name) {

        return service.searchByName(name);
    }

    // SEARCH BY ROLL NUMBER
    @GetMapping("/search/roll/{rollNumber}")
    public List<Student> searchByRollNumber(
            @PathVariable String rollNumber) {

        return service.searchByRollNumber(
                rollNumber
        );
    }

    // SEARCH BY EMAIL
    @GetMapping("/search/email/{email}")
    public List<Student> searchByEmail(
            @PathVariable String email) {

        return service.searchByEmail(email);
    }
    @GetMapping("/valid")
    public ResponseEntity<?>validateToken(@RequestParam String token){
    	try {
    		jwtServices.validateToken(token);
    		return ResponseEntity.ok("Token is valid....");
    	}catch(Exception e) {
    		return ResponseEntity.badRequest().body("Token is invalid...");
    	}
    }
    @GetMapping("/verify")
    public ResponseEntity<?>getMethodName(@RequestHeader("Authorization")String token){
    	try {
			jwtServices.validateToken(token.replace("Bearer ",""));
    		return ResponseEntity.ok("Valid");
    	}catch(Exception e) {
    		return ResponseEntity.badRequest().body("Token Expired");
    	}
    }
}
