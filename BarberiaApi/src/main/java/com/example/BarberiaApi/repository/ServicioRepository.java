package com.example.BarberiaApi.repository;

import com.example.BarberiaApi.model.ServicioModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioRepository extends JpaRepository<ServicioModel, Long> {
}