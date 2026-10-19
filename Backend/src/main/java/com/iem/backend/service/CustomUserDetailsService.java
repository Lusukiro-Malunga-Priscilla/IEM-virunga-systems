package com.iem.backend.service;

import com.iem.backend.model.UserAccount;
import com.iem.backend.repository.UserAccountRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    public CustomUserDetailsService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        String normalized = usernameOrEmail.trim().toLowerCase();

        UserAccount account = userAccountRepository.findByUsername(normalized)
                .or(() -> userAccountRepository.findByUsernameIgnoreCase(normalized))
                .or(() -> userAccountRepository.findByEmail(normalized))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + normalized));

        return new User(
                account.getUsername(),
                account.getPassword(),
                account.isEnabled(),
                true,
                true,
                true,
                List.of(new SimpleGrantedAuthority("ROLE_" + account.getRole().name()))
        );
    }
}