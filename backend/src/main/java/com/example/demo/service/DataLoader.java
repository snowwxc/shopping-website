package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Clear all products to ensure fresh seeding with correct URLs
        productRepository.deleteAll();

        // Product 1 - Black Bear
        productRepository.save(new Product("Hand-Carved Black Bear", "Finely detailed Michigan black bear, carved from a single block of White Oak. Hand-polished with natural beeswax.", 145.00, 5, "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=400&auto=format&fit=crop"));
        
        // Product 2 - Maple Leaf Bowl
        productRepository.save(new Product("Maple Leaf Bowl", "Turned from local Sugar Maple. The natural grain patterns evoke the rolling hills of the Traverse City area.", 85.00, 10, "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop"));
        
        // Product 3 - Lighthouse
        productRepository.save(new Product("Lighthouse Relief", "A deep-relief carving of a Michigan shoreline lighthouse. Captures the rugged spirit of Lake Superior.", 210.00, 3, "https://images.unsplash.com/photo-1507724591054-9994897ff211?q=80&w=400&auto=format&fit=crop"));
        
        // Product 4 - Walnut Coaster
        productRepository.save(new Product("Walnut Coaster Set", "Set of 4 coasters carved from premium Michigan Black Walnut. Heat-resistant and naturally durable.", 45.00, 15, "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=400&auto=format&fit=crop"));
        
        // Product 5 - Pine Forest
        productRepository.save(new Product("Pine Forest Mural", "A large-scale wall mural depicting a dense pine forest. Perfect for a cozy cabin or rustic home office.", 350.00, 2, "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=400&auto=format&fit=crop"));
        
        // Product 6 - Cedar Birdhouse
        productRepository.save(new Product("Cedar Birdhouse", "Hand-built from aromatic Michigan Red Cedar. Designed to attract local songbirds while adding charm to your garden.", 65.00, 8, "https://images.unsplash.com/photo-1590422204918-6f688863f684?q=80&w=400&auto=format&fit=crop"));
        
        // Product 7 - Canoe Paddle
        productRepository.save(new Product("Cedar Canoe Paddle", "A decorative paddle carved from Michigan Red Cedar. Hand-painted with traditional Great Lakes motifs.", 120.00, 4, "https://images.unsplash.com/photo-1544551763-77ef2d0ca9a1?q=80&w=400&auto=format&fit=crop"));
        
        // Product 8 - Walnut Bowl
        productRepository.save(new Product("Walnut Fruit Bowl", "Deep, rich Walnut bowl with a live-edge finish. Each piece is unique and sustainably sourced.", 95.00, 6, "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&auto=format&fit=crop"));
        
        // Product 9 - Basswood
        productRepository.save(new Product("Basswood Relief", "Intricate relief carving of a woodland scene. Basswood's fine grain allows for extreme detail.", 180.00, 3, "https://images.unsplash.com/photo-1588600036348-818a1583200a?q=80&w=400&auto=format&fit=crop"));
        
        // Product 10 - Spoons
        productRepository.save(new Product("White Pine Spoons", "Set of three kitchen spoons hand-carved from northern white pine. Food-safe finish with organic oils.", 35.00, 20, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop"));
        
        // Product 11 - Petoskey Stone
        productRepository.save(new Product("Petoskey Stone Inlay", "Small decorative box made of cherry wood with a genuine Petoskey stone inlay on the lid.", 110.00, 5, "https://images.unsplash.com/photo-1536640712247-c05afa5e2bc3?q=80&w=400&auto=format&fit=crop"));
        
        // Product 12 - Great Lakes Plaque
        productRepository.save(new Product("Great Lakes Plaque", "Detailed relief map of the Great Lakes region carved into a slab of live-edge oak.", 275.00, 2, "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=400&auto=format&fit=crop"));
        
        System.out.println("Data Loader: Successfully seeded 12 Michigan woodcraft products with updated URLs.");
    }
}
