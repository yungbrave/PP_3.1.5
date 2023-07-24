package ru.kata.spring.boot_security.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.User;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
    @Query("select u from User u left join fetch u.roles where u.email =:email")
    User findUserByEmail(@Param("email") String email);

}

