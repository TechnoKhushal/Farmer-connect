package com.marketplace.repository;

import com.marketplace.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0.0) FROM Order o JOIN o.products oi " +
           "JOIN Product p ON p.id = oi.productId " +
           "WHERE p.farmerId = :farmerId AND o.status = 'COMPLETED'")
    Double calculateEarningsByFarmerId(@Param("farmerId") Long farmerId);
}
