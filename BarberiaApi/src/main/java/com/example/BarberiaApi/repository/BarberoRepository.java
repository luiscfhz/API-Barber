package com.example.BarberiaApi.repository;
import com.example.BarberiaApi.model.BarberoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BarberoRepository extends JpaRepository<BarberoModel, Long> {
}
