package com.example.BarberiaApi.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cita")
public class citaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCita;
    private Long idCliente;
    private Long idBarbero;
    private Long idServicio;
    private LocalDateTime inicio;
    private LocalDateTime fin;
    @Enumerated(EnumType.STRING)
    private EstadoCita estado;

    public Long getIdCita() { return idCita; }
    public void setIdCita(Long idCita) { this.idCita = idCita; }
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public Long getIdBarbero() { return idBarbero; }
    public void setIdBarbero(Long idBarbero) { this.idBarbero = idBarbero; }
    public Long getIdServicio() { return idServicio; }
    public void setIdServicio(Long idServicio) { this.idServicio = idServicio; }
    public LocalDateTime getInicio() { return inicio; }
    public void setInicio(LocalDateTime inicio) { this.inicio = inicio; }
    public LocalDateTime getFin() { return fin; }
    public void setFin(LocalDateTime fin) { this.fin = fin; }
    public EstadoCita getEstado() { return estado; }
    public void setEstado(EstadoCita estado) { this.estado = estado; }
}