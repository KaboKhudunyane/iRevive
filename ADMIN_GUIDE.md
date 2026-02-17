# Admin Quick Start Guide - Product Management

## Getting Started

### Login
1. Go to `/admin/login`
2. Username: `admin`
3. Password: `admin123`
4. Click "Login"

---

## Managing Products

### View All Products
1. Click **Products** tab in admin dashboard
2. Products list appears on left side

### Create New Product
1. Click **+ New Product** button
2. Fill in:
   - **Title**: "iPhone 15 Pro"
   - **Slug**: "iphone-15-pro" (URL-friendly name)
   - **Description**: Product details
   - **Brand**: Apple (or other)
   - **Base Price**: 1500000 (in cents, so this = R15,000)
   - **Images**: Comma-separated paths (e.g., `/assets/img1.jpg, /assets/img2.jpg`)
3. Click **Create Product**

### Edit Product
1. Click product in list (left panel)
2. Edit form appears on right
3. Update title, description, or base price
4. Click **Save Changes**
5. Click **Delete Product** if needed

---

## Managing Product Variants

> **What is a variant?** Each combination of color + storage + condition is a separate SKU with its own stock level.

### Example
```
iPhone 13 Variants:
1. Midnight, 128GB, Excellent - 4 units in stock - R8,000
2. Midnight, 256GB, Excellent - 1 unit in stock - R8,200
3. Starlight, 256GB, Good - 2 units in stock - R8,000
```

### Add New Variant
1. Select product from left panel
2. Click **+ Add Variant** button
3. Fill in:
   - **Color**: "Midnight" (will appear in filters)
   - **Storage**: 128 (GB - numeric)
   - **Condition**: Excellent / Good / Fair / Like New
   - **Stock**: 5 (how many units available)
   - **Price Adjustment**: 0 (±cents from base price)
     - Example: Base R8,000 + Adjustment +200 = R8,200
   - **Image Path**: `/assets/phone-midnight.jpg` (or leave empty to use product image)
4. Click **Create Variant**

### Edit Variant
1. In Variants table, click **Edit** button
2. Update any field
3. Click **Update Variant**

### Delete Variant
1. In Variants table, click **Delete** button
2. Confirm deletion

### Update Stock Quickly
Without editing full variant:
1. In Variants table, find the stock value
2. Can see stock at a glance (shows "0" in red, others in green)
3. Click **Edit** if you need to change

---

## Understanding Pricing

### Base Price
All variants start at the product's **Base Price**.

### Price Adjustments
Add/subtract cents for specific variants:

```
iPhone 13 Base: R8,000 (800000 cents)

Midnight, 128GB: +R0 = R8,000
Midnight, 256GB: +R200 = R8,200 (more storage)
Starlight, 512GB: +R600 = R8,600 (premium color + storage)
Good Condition: -R300 = R7,700
```

**Tips:**
- Higher storage = higher price adjustment (+)
- Better condition = higher price adjustment (+)
- Popular colors = higher adjustment (+)
- Set to 0 for standard price

---

## Stock Management

### Viewing Stock
- **Admin → Products**: See stock in Variants table
- **Admin → Inventory** (legacy): Shows old product-level inventory (being phased out)
- **Products page (public)**: "In Stock (X available)" badge

### Low Stock Alert
When variant stock ≤ 2 units:
- Shows orange badge "LOW" in admin
- Still available on site
- But shows "only X available" warning

### Out of Stock
When variant stock = 0:
- Button disabled on product detail page
- Grayed out in selection options
- "Out of Stock" badge on product card

### Updating After Sale
Stock is **automatically reduced** when customer places order.

Example:
- Before order: iPhone 13 Midnight 128GB = 4 units
- Customer buys 1
- After order: iPhone 13 Midnight 128GB = 3 units (automatic)

---

## Inventory Tab (Legacy)

For future reference - this shows product-level inventory and will be deprecated.

Best practice: Use **Products tab** for accurate variant-level stock.

---

## Orders Tab

View all customer orders:
- Order ID
- Number of items
- Total amount
- Current status
- Date created

### Update Order Status
1. Find order
2. Click status dropdown
3. Select: Pending → Processing → Shipped → Delivered
4. Status updates immediately

---

## Best Practices

### ✅ DO:
- Create variants for every color/storage/condition combo you have in stock
- Set accurate stock numbers
- Update price adjustments to reflect value differences
- Delete variants when product is discontinued
- Check "Low Stock" items regularly

### ❌ DON'T:
- Leave variants at 0 stock (delete them instead)
- Set unrealistic price adjustments
- Forget to create variants for new colors
- Mix up storage values (use just the number: 64, 128, 256, 512)

---

## Common Issues

### "Out of Stock" showing but I have it in inventory
→ Create a variant! Stock is at variant level, not product level.

### Variant not appearing on product page
→ Check stock value - maybe it's 0. Set it to at least 1.

### Customer can't select my color option
→ That color variant might be out of stock. Check Variants table.

### Price doesn't match what I set
→ Check price adjustment! BASE + ADJUSTMENT = FINAL PRICE

---

## Tips & Tricks

### Quick Inventory Check
Dashboard → Dashboard tab shows:
- Total Products
- Total Stock (all variants)
- Total Sold
- Low Stock Items count

### Bulk Updates (Future)
Currently must update variants one-by-one. Coming soon: bulk import/export.

### Stock Forecasting (Future)
Track sales trends to reorder before running out.

---

## Support

If something doesn't work:
1. Check variant stock levels (must be > 0 to show)
2. Verify color/storage/condition are filled in
3. Reload page (Ctrl+R) to refresh
4. Check browser console (F12) for errors
5. Logout and login again

---

## Quick Reference

| Action | Location | Steps |
|--------|----------|-------|
| View products | Admin → Products → Left panel | Click product |
| Create product | Admin → Products → + New Product | Fill form |
| Edit product | Admin → Products → Select product → Edit form | Change fields → Save |
| Create variant | Admin → Products → Select product → + Add Variant | Fill form |
| Edit variant | Admin → Products → Select product → Variants → Edit | Change fields → Update |
| Delete variant | Admin → Products → Select product → Variants → Delete | Confirm |
| View orders | Admin → Orders | See all orders |
| Change order status | Admin → Orders → Status dropdown | Select new status |

