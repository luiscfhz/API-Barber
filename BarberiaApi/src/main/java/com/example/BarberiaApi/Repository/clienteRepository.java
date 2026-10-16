package com.example.BarberiaApi.Repository;

import com.example.BarberiaApi.Model.clienteModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface clienteRepository extends JpaRepository<clienteModel, Long> {
}