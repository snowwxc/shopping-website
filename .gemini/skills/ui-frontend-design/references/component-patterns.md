# Component Patterns

Styling patterns for common Angular Material components in the Wood Carving Website.

## Product Cards (`mat-card`)

Use for displaying individual wood carvings in the gallery.

```css
.product-card {
  max-width: 300px;
  margin: var(--spacing-md);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  color: var(--color-primary);
}

.product-price {
  font-weight: bold;
  color: var(--color-accent);
}
```

## Primary Buttons (`mat-raised-button`)

```css
.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 24px;
}

.btn-primary:hover {
  background-color: var(--color-primary-light);
}
```

## Forms (`mat-form-field`)

```css
.form-container {
  max-width: 500px;
  margin: var(--spacing-xl) auto;
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

mat-form-field {
  width: 100%;
  margin-bottom: var(--spacing-md);
}
```

## Tables (`mat-table`)

For the admin dashboard order/product lists.

```css
.data-table {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.mat-header-row {
  background-color: var(--color-background);
}

.mat-header-cell {
  color: var(--color-primary);
  font-weight: bold;
}
```
