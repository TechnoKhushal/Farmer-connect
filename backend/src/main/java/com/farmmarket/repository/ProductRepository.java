package com.marketplace.repository;

import com.marketplace.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByFarmerId(Long farmerId);
    Optional<Product> findByIdAndFarmerId(Long id, Long farmerId);
}
