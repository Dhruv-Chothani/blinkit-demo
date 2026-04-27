import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import localStorageService from "@/services/localStorageService";
import { Plus, Edit, Trash2, Package, TrendingUp, Users, DollarSign, LogOut, Store } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Please enter a price"),
  stock: z.string().min(0, "Please enter stock quantity"),
  image: z.string().url("Please enter a valid image URL"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

type ProductFormData = z.infer<typeof productSchema>;

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const categories = [
    'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Meat', 'Seafood',
    'Snacks', 'Beverages', 'Grains', 'Spices', 'Personal Care'
  ];

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login/vendor');
      return;
    }

    loadVendorData();
  }, [user, navigate]);

  const loadVendorData = () => {
    // Load vendor's products only
    const vendorProducts = localStorageService.getProductsByVendor(user?.id || '');
    setProducts(vendorProducts);

    // Load vendor's orders
    const vendorOrders = localStorageService.getOrdersByVendor(user?.id || '');
    setOrders(vendorOrders);
  };

  const onAddProduct = async (data: ProductFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newProduct = localStorageService.addProduct({
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        image: data.image,
        description: data.description,
        vendorId: user.id,
        vendorName: user.storeName || user.name,
        vendorEmail: user.email,
        stock: parseInt(data.stock),
      });

      setProducts([...products, newProduct]);
      setIsAddProductOpen(false);
      productForm.reset();
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateProduct = async (data: ProductFormData) => {
    if (!user || !editingProduct) return;

    setIsLoading(true);
    try {
      const updatedProduct = localStorageService.updateProduct(editingProduct.id, {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        image: data.image,
        description: data.description,
        stock: parseInt(data.stock),
      });

      if (updatedProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setEditingProduct(null);
        productForm.reset();
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const success = localStorageService.deleteProduct(productId);
      if (success) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description,
    });
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.stock > 0).length;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.storeName || 'Vendor Dashboard'}</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Store
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="tab-trigger">My Products</TabsTrigger>
            <TabsTrigger value="orders" className="tab-trigger">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Products</h2>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="click-feedback">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your store
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={productForm.handleSubmit(onAddProduct)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input {...productForm.register("name")} />
                        {productForm.formState.errors.name && (
                          <p className="text-sm text-destructive">{productForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => productForm.setValue("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {productForm.formState.errors.category && (
                          <p className="text-sm text-destructive">{productForm.formState.errors.category.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input type="number" {...productForm.register("price")} />
                        {productForm.formState.errors.price && (
                          <p className="text-sm text-destructive">{productForm.formState.errors.price.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input type="number" {...productForm.register("stock")} />
                        {productForm.formState.errors.stock && (
                          <p className="text-sm text-destructive">{productForm.formState.errors.stock.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input {...productForm.register("image")} placeholder="https://example.com/image.jpg" />
                      {productForm.formState.errors.image && (
                        <p className="text-sm text-destructive">{productForm.formState.errors.image.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input {...productForm.register("description")} />
                      {productForm.formState.errors.description && (
                        <p className="text-sm text-destructive">{productForm.formState.errors.description.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit Product Dialog */}
              <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Update product information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={productForm.handleSubmit(onUpdateProduct)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name</Label>
                        <Input {...productForm.register("name")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select 
                          value={productForm.watch("category")} 
                          onValueChange={(value) => productForm.setValue("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price (₹)</Label>
                        <Input type="number" {...productForm.register("price")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-stock">Stock Quantity</Label>
                        <Input type="number" {...productForm.register("stock")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">Image URL</Label>
                      <Input {...productForm.register("image")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Input {...productForm.register("description")} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="table-row-hover">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditProduct(product)}
                            className="click-feedback"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteProduct(product.id)}
                            className="click-feedback"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="table-row-hover">
                      <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'cancelled' ? 'destructive' : 'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;
