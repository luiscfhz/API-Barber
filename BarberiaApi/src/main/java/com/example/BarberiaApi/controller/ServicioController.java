package com.example.BarberiaApi.controller;

import com.example.BarberiaApi.model.ServicioModel;
import com.example.BarberiaApi.repository.ServicioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioRepository repo;

    public ServicioController(ServicioRepository repo) { this.repo = repo; }

    @GetMapping
    public List<ServicioModel> listar() { return repo.findAll(); }

    @PostMapping
    public ServicioModel crear(@RequestBody ServicioModel s) {
        s.setIdServicio(null);
        return repo.save(s);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicioModel> actualizar(@PathVariable Long id, @RequestBody ServicioModel s) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        s.setIdServicio(id);
        return ResponseEntity.ok(repo.save(s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}