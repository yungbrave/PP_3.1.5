package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;

    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.findUserByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("This email was not found");
        }
        return user;
    }

    @Override
    public User findUserById(Long id) {
        Optional<User> user = userDao.findById(id);
        return user.orElse(new User());
    }

    @Override
    public List<User> allUsers() {
        return userDao.findAll();
    }

    @Override
    public boolean saveUser(User user) {
        User currentUser = userDao.findUserByEmail(user.getUsername());
        if (currentUser != null) {
            throw new AuthenticationException("This email is already exists") {
            };
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.save(user);
        return true;
    }

    @Override
    public void deleteUser(Long id) {
        userDao.deleteById(id);
    }

    @Override
    public void updateUser(Long id, User user) {
        if (user.getPassword().isBlank()) {
            user.setPassword(findUserById(id).getPassword());
            user.setId(id);
            userDao.saveAndFlush(user);
        } else {
            user.setId(id);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userDao.saveAndFlush(user);
        }
    }


}



