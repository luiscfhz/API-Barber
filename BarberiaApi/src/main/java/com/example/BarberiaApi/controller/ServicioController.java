package com.example.BarberiaApi.controller;
import com.example.BarberiaApi.model.ServicioModel;
import com.example.BarberiaApi.repository.ServicioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioRepository repository;

    public ServicioController(ServicioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ServicioModel> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioModel> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ServicioModel crear(@RequestBody ServicioModel servicio) {
        servicio.setId(null);
        return repository.save(servicio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicioModel> actualizar(@PathVariable Long id, @RequestBody ServicioModel datos) {
        return repository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());
            existente.setDescripcion(datos.getDescripcion());
            existente.setPrecio(datos.getPrecio());
            existente.setDuracionMinutos(datos.getDuracionMinutos());
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