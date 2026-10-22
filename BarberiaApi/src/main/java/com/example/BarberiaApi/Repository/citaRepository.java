package com.example.BarberiaApi.Repository;

import com.example.BarberiaApi.Model.citaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface citaRepository extends JpaRepository<citaModel, Long> {

    @Query("SELECT COUNT(c) > 0 FROM citaModel c " +
            "WHERE c.idBarbero = :idBarbero " +
            "AND c.estado <> com.example.BarberiaApi.Model.EstadoCita.CANCELADA " +
            "AND c.inicio < :fin AND c.fin > :inicio " +
            "AND c.idCita <> :idCita")
    boolean hayEmpalme(@Param("idBarbero") Long idBarbero,
                       @Param("inicio") LocalDateTime inicio,
                       @Param("fin") LocalDateTime fin,
                       @Param("idCita") Long idCita);
}