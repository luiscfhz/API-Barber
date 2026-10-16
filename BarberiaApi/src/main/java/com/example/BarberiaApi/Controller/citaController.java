package com.example.BarberiaApi.Controller;

import com.example.BarberiaApi.Model.citaModel;
import com.example.BarberiaApi.Repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class citaController {

    private final citaRepository citaRepository;
    private final clienteRepository clienteRepository;
    private final BarberoRepository barberoRepository;
    private final ServicioRepository servicioRepository;

    public citaController(citaRepository citaRepository,
                          clienteRepository clienteRepository,
                          BarberoRepository barberoRepository,
                          ServicioRepository servicioRepository) {
        this.citaRepository = citaRepository;
        this.clienteRepository = clienteRepository;
        this.barberoRepository = barberoRepository;
        this.servicioRepository = servicioRepository;
    }

    @GetMapping
    public List<citaModel> listar(@RequestParam(required = false) LocalDate fecha) {
        if (fecha != null) {
            return citaRepository.findByFecha(fecha);
        }
        return citaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<citaModel> obtener(@PathVariable Long id) {
        return citaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody citaModel cita) {
        ResponseEntity<String> error = validar(cita);
        if (error != null) {
            return error;
        }
        cita.setId(null);
        if (cita.getEstado() == null) {
            cita.setEstado("PENDIENTE");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(citaRepository.save(cita));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody citaModel datos) {
        return citaRepository.findById(id).map(existente -> {
            ResponseEntity<String> error = validar(datos);
            if (error != null) {
                return (ResponseEntity<?>) error;
            }
            existente.setCliente(datos.getCliente());
            existente.setBarbero(datos.getBarbero());
            existente.setServicio(datos.getServicio());
            existente.setFecha(datos.getFecha());
            existente.setHora(datos.getHora());
            existente.setEstado(datos.getEstado());
            return ResponseEntity.ok(citaRepository.save(existente));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!citaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        citaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Verifica que cliente, barbero y servicio existan, y que el horario esté libre
    private ResponseEntity<String> validar(citaModel cita) {
        if (cita.getCliente() == null || cita.getBarbero() == null || cita.getServicio() == null
                || cita.getFecha() == null || cita.getHora() == null) {
            return ResponseEntity.badRequest()
                    .body("Faltan datos: cliente, barbero, servicio, fecha y hora son obligatorios");
        }
        if (!clienteRepository.existsById(cita.getCliente().getId())) {
            return ResponseEntity.badRequest().body("El cliente no existe");
        }
        if (!barberoRepository.existsById(cita.getBarbero().getId())) {
            return ResponseEntity.badRequest().body("El barbero no existe");
        }
        if (!servicioRepository.existsById(cita.getServicio().getId())) {
            return ResponseEntity.badRequest().body("El servicio no existe");
        }
        if (citaRepository.existsByBarberoIdAndFechaAndHora(
                cita.getBarbero().getId(), cita.getFecha(), cita.getHora())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El barbero ya tiene una cita a esa hora");
        }
        return null;
    }
}