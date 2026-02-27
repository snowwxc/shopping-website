import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/product.service';
import { ImageUploadService } from '../../core/image-upload.service'; // Import ImageUploadService

@Component({
  selector: 'app-product-create-edit',
  templateUrl: './product-create-edit.component.html',
  styleUrls: ['./product-create-edit.component.css']
})
export class ProductCreateEditComponent implements OnInit {
  productForm: FormGroup;
  editMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private imageUploadService: ImageUploadService // Inject ImageUploadService
  ) {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''] // Add imageUrl form control
    });
  }

  // Getters for easy access to form controls
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get imageUrl() { return this.productForm.get('imageUrl'); } // New getter

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.productId = +id;
        this.productService.getProduct(this.productId).subscribe(product => {
          this.productForm.patchValue(product);
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageUploadService.uploadImage(file).subscribe(
        (imageUrl: string) => {
          this.productForm.patchValue({ imageUrl: imageUrl });
          console.log('Image uploaded successfully:', imageUrl);
        },
        error => {
          console.error('Image upload failed:', error);
          // Handle error, e.g., show a snackbar message
        }
      );
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.editMode) {
        this.productService.updateProduct(this.productId!, this.productForm.value).subscribe(() => {
          this.router.navigate(['/admin/dashboard']);
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe(() => {
          this.router.navigate(['/admin/dashboard']);
        });
      }
    }
  }
}
