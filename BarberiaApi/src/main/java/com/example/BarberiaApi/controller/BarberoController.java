package com.example.BarberiaApi.controller;
import com.example.BarberiaApi.model.BarberoModel;
import com.example.BarberiaApi.repository.BarberoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barberos")
public class BarberoController {

    private final BarberoRepository repository;

    public BarberoController(BarberoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<BarberoModel> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarberoModel> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BarberoModel crear(@RequestBody BarberoModel barbero) {
        barbero.setId(null);
        return repository.save(barbero);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarberoModel> actualizar(@PathVariable Long id, @RequestBody BarberoModel datos) {
        return repository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());
            existente.setTelefono(datos.getTelefono());
            existente.setEspecialidad(datos.getEspecialidad());
            return ResponseEntity.ok(repository.save(existente));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}