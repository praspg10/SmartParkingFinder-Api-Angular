package com.smartparking.userservice.dto;

import lombok.Data;
import com.smartparking.userservice.model.Role;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private Role role; // specific for registration
}
