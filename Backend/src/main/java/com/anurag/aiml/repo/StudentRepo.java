package com.anurag.aiml.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anurag.aiml.entity.Student;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {

    Student findByEmailAndPassword(String email, String password);

    Student findByEmail(String email);

    List<Student> findByNameContainingIgnoreCase(String name);
}