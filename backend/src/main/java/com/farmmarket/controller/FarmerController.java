package com.marketplace.controller;

import com.marketplace.domain.Product;
import com.marketplace.domain.User;
import com.marketplace.service.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_FARMER')")
public class FarmerController {

    private final FarmerService farmerService;

    @GetMapping("/profile")
    public User getProfile(Principal principal) {
        return farmerService.getProfile(principal.getName());
    }

    @PutMapping("/profile")
    public User updateProfile(Principal principal, @RequestBody User user) {
        return farmerService.updateProfile(principal.getName(), user);
    }

    @PostMapping("/products")
    public Product createProduct(Principal principal, @RequestBody Product product) {
        return farmerService.createProduct(principal.getName(), product);
    }

    @GetMapping("/products")
    public List<Product> getProducts(Principal principal) {
        return farmerService.getFarmerProducts(principal.getName());
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(Principal principal, @PathVariable Long id, @RequestBody Product product) {
        return farmerService.updateProduct(principal.getName(), id, product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(Principal principal, @PathVariable Long id) {
        farmerService.deleteProduct(principal.getName(), id);
    }

    @GetMapping("/earnings")
    public Map<String, Double> getEarnings(Principal principal) {
        return Map.of("totalEarnings", farmerService.getEarnings(principal.getName()));
    }
}