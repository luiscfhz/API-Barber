package com.example.BarberiaApi.Repository;

import com.example.BarberiaApi.Model.citaModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface citaRepository extends JpaRepository<citaModel, Long> {

    List<citaModel> findByFecha(LocalDate fecha);

    List<citaModel> findByClienteId(Long clienteId);

    boolean existsByBarberoIdAndFechaAndHora(Long barberoId, LocalDate fecha, LocalTime hora);
}