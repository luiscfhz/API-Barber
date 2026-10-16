package com.example.BarberiaApi.Controller;

import com.example.BarberiaApi.Model.clienteModel;
import com.example.BarberiaApi.Repository.clienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class clienteController {

    private final clienteRepository repository;

    public clienteController(clienteRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<clienteModel> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<clienteModel> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public clienteModel crear(@RequestBody clienteModel cliente) {
        cliente.setId(null);
        return repository.save(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<clienteModel> actualizar(@PathVariable Long id, @RequestBody clienteModel datos) {
        return repository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());
            existente.setTelefono(datos.getTelefono());
            existente.setCorreo(datos.getCorreo());
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