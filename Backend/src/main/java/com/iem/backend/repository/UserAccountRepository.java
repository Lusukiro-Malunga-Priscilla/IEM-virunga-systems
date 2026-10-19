package com.iem.backend.repository;

import com.iem.backend.model.Role;
import com.iem.backend.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    
    Optional<UserAccount> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    @Query("SELECT u FROM UserAccount u WHERE LOWER(u.username) = LOWER(:username)")
    Optional<UserAccount> findByUsernameIgnoreCase(@Param("username") String username);
    
    Optional<UserAccount> findByEmail(String email);

    List<UserAccount> findByRole(Role role);

    List<UserAccount> findByRoleIn(List<Role> roles);
}