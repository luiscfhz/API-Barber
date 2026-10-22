package com.example.BarberiaApi.Controller;

import com.example.BarberiaApi.Model.EstadoCita;
import com.example.BarberiaApi.Model.citaModel;
import com.example.BarberiaApi.Repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
public class citaController {

    private final citaRepository repo;
    private final clienteRepository clienteRepo;
    private final barberoRepository barberoRepo;
    private final servicioRepository servicioRepo;

    public citaController(citaRepository repo, clienteRepository clienteRepo,
                          barberoRepository barberoRepo, servicioRepository servicioRepo) {
        this.repo = repo;
        this.clienteRepo = clienteRepo;
        this.barberoRepo = barberoRepo;
        this.servicioRepo = servicioRepo;
    }

    @GetMapping
    public List<citaModel> listar() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody citaModel c) {
        c.setIdCita(null);
        ResponseEntity<?> error = validar(c, 0L);
        if (error != null) return error;
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody citaModel c) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        c.setIdCita(id);
        ResponseEntity<?> error = validar(c, id);
        if (error != null) return error;
        return ResponseEntity.ok(repo.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<?> validar(citaModel c, Long idActual) {
        if (c.getIdCliente() == null || c.getIdBarbero() == null || c.getIdServicio() == null
                || c.getInicio() == null || c.getFin() == null || c.getEstado() == null) {
            return error(HttpStatus.BAD_REQUEST, "Faltan datos obligatorios de la cita");
        }
        if (!c.getFin().isAfter(c.getInicio())) {
            return error(HttpStatus.BAD_REQUEST, "La hora de fin debe ser posterior al inicio");
        }
        if (!clienteRepo.existsById(c.getIdCliente())) return error(HttpStatus.BAD_REQUEST, "El cliente no existe");
        if (!barberoRepo.existsById(c.getIdBarbero())) return error(HttpStatus.BAD_REQUEST, "El barbero no existe");
        if (!servicioRepo.existsById(c.getIdServicio())) return error(HttpStatus.BAD_REQUEST, "El servicio no existe");

        if (c.getEstado() != EstadoCita.CANCELADA
                && repo.hayEmpalme(c.getIdBarbero(), c.getInicio(), c.getFin(), idActual)) {
            return error(HttpStatus.CONFLICT, "El barbero ya tiene una cita que se cruza con ese horario");
        }
        return null;
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String mensaje) {
        return ResponseEntity.status(status).body(Map.of("mensaje", mensaje));
    }
}