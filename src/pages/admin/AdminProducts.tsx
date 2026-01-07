import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/services/products";

const AdminProducts = () => {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-heading">Shop Products</h2>
        <button className="text-caption border-thin px-4 py-2">
          + New Product
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-border p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            </div>

            <div className="flex gap-4 text-sm">
              <button className="text-muted-foreground hover:text-foreground">
                Edit
              </button>
              <button className="text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
