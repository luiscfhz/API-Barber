package com.example.BarberiaApi.Controller;

import com.example.BarberiaApi.Model.clienteModel;
import com.example.BarberiaApi.Repository.clienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class clienteController {

    private final clienteRepository repo;

    public clienteController(clienteRepository repo) { this.repo = repo; }

    @GetMapping
    public List<clienteModel> listar() { return repo.findAll(); }

    @PostMapping
    public clienteModel crear(@RequestBody clienteModel c) {
        c.setIdCliente(null);
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<clienteModel> actualizar(@PathVariable Long id, @RequestBody clienteModel c) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        c.setIdCliente(id);
        return ResponseEntity.ok(repo.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}