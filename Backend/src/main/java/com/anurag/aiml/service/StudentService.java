package com.anurag.aiml.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.anurag.aiml.entity.Student;
import com.anurag.aiml.repo.StudentRepo;

@Service
public class StudentService {

    @Autowired
    StudentRepo repo;


    // REGISTER
    public Student addingNewStudent(Student newSStud) {

        return repo.save(newSStud);
    }


    // GET ALL STUDENTS
    public List<Student> get() {

        return repo.findAll();
    }


    // PAGINATION + ID SORTING
    public Page<Student> getUsers(
            int page,
            int size,
            String sortDirection) {

        Sort sort;

        if (sortDirection.equalsIgnoreCase("desc")) {

            sort = Sort.by("id").descending();

        } else {

            sort = Sort.by("id").ascending();
        }

        Pageable pageable =
                PageRequest.of(page, size, sort);

        return repo.findAll(pageable);
    }


    // GET STUDENT BY ID
    public Student getStudentById(Long id) {

        return repo.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User Not Found..."
                        )
                );
    }


    // DELETE STUDENT
    public void deleteByID(Long id) {

        repo.deleteById(id);
    }


    // UPDATE STUDENT
    public Student updateUser(
            Long id,
            Student newUser) {

        Student existingUser =
                repo.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User Not Found..."
                                )
                        );

        existingUser.setEmail(
                newUser.getEmail()
        );

        existingUser.setName(
                newUser.getName()
        );

        existingUser.setPassword(
                newUser.getPassword()
        );

        return repo.save(existingUser);
    }


    // LOGIN
    public Student login(
            String email,
            String password) {

        return repo.findByEmailAndPassword(
                email,
                password
        );
    }


    // LOGIN USER
    public Student LoginUser(Student student) {

        return repo.findByEmailAndPassword(
                student.getEmail(),
                student.getPassword()
        );
    }


    // SEARCH BY NAME
    public List<Student> searchByName(
            String name) {

        return repo.findAll()
                .stream()
                .filter(student ->
                        student.getName()
                                .toLowerCase()
                                .contains(
                                        name.toLowerCase()
                                )
                )
                .collect(Collectors.toList());
    }


    // SEARCH BY ROLL NUMBER
    public List<Student> searchByRollNumber(
            String rollNumber) {

        return repo.findAll()
                .stream()
                .filter(student ->
                        String.valueOf(
                                student.getId()
                        )
                        .equalsIgnoreCase(rollNumber)
                )
                .collect(Collectors.toList());
    }


    // SEARCH BY EMAIL
    public List<Student> searchByEmail(
            String email) {

        return repo.findAll()
                .stream()
                .filter(student ->
                        student.getEmail()
                                .toLowerCase()
                                .contains(
                                        email.toLowerCase()
                                )
                )
                .collect(Collectors.toList());
    }
}