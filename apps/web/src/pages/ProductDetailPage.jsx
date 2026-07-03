import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, Star } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const selectedVariant = {
  id: product?._id,
  title: product?.category,
  inventory_quantity: product?.stock || 0,
};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] =useState("description");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        const formattedProduct = {...product, image: product.images?.[0] || "/images/logo.png", price: product.price,};

        const token = localStorage.getItem("token");


await fetch(
  `${API}/cart/add`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: product._id,
      quantity,
    }),
  }
);

        await addToCart(formattedProduct, selectedVariant, quantity, availableQuantity);
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) added.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  // const handleVariantSelect = useCallback((variant) => {
  //   setSelectedVariant(variant);

  //   if (variant.image_url && product?.images?.length > 0) {
  //     const imageIndex = product.images.findIndex(image => image.url === variant.image_url);

  //     if (imageIndex !== -1) {
  //       setCurrentImageIndex(imageIndex);
  //     }
  //   }
  // }, [product?.images]);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/products/${id}`,
      );

      const data = await response.json();

      setProduct(data.product);

      const productsResponse =
  await fetch(
    `${API}/products`,
  );

const productsData =
  await productsResponse.json();

setAllProducts(
  productsData.products
);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-purple-300 transition-colors mb-6">
          <ArrowLeft size={16} />
          Go back
        </Link>
        <div className="text-center text-red-400 p-8 glass-card rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-6">Error loading product: {error}</p>
        </div>
      </div>
    );
  }

const price = `₹${product?.price || 0}`;  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

const currentImage =
  product?.images?.[currentImageIndex] ||
  "/images/logo.png";

    const hasMultipleImages = 
    product?.images?.length > 1;

    const relatedProducts =
  allProducts.filter(
    p => p._id !== product._id
  );
  return (
    <>
      <Helmet>
        <title>{product.title} - Our Store</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>
      <div className="max-w-5xl mx-auto">
        <Link to="/store" className="inline-flex items-center gap-2 text-primary hover:text-purple-300 transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Store
        </Link>
        <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-lg">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl h-96 md:h-[500px]">
              <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

         

              {/* {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-pink-500/90 text-primary text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {product.ribbon_text}
                </div>
              )} */}
            </div>

            {hasMultipleImages && (
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-purple-500' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {hasMultipleImages && (
              <div className="hidden md:flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-purple-500' : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    <img
                      src={image || "/images/logo.png"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              
            )}
            
                
          </motion.div>

          

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
            <h1 className="text-4xl font-bold text-primary mb-2">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
  <Star
    className="fill-yellow-400 text-yellow-400"
    size={18}
  />

  <span className="font-medium text-primary">
    4.8
  </span>

  <span className="text-gray-400">
    (126 Reviews)
  </span>
</div>
            <p className="text-lg text-gray-600 mb-4">
  {product.category}
</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-secondary">{price}</span>
              {selectedVariant?.sale_price_in_cents && (
                <span className="text-2xl text-gray-400 line-through">{originalPrice}</span>
              )}
            </div>

            {/* {product.additional_info?.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.additional_info
                  .sort((a, b) => a.order - b.order)
                  .map((info) => (
                    <div key={info.id} className="border-l-2 border-purple-500/50 pl-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                      <div className="prose prose-invert text-gray-300 prose-sm" dangerouslySetInnerHTML={{ __html: info.description }} />
                    </div>
                  ))}
              </div>
            )} */}

            

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-white/20 rounded-full p-1">
                <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" disabled={quantity === 1} className="rounded-full h-8 w-8 text-primary hover:bg-gray-100"><Minus size={16} /></Button>
                <span className="w-10 text-center text-primary font-bold">{quantity}</span>
                <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="rounded-full h-8 w-8 text-primary hover:bg-gray-100"><Plus size={16} /></Button>
              </div>
            </div>

            <div className="mt-auto">
              <Button onClick={handleAddToCart} size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>

              
 <Button
  onClick={() => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          product: {
            ...product,
            image: product.images?.[0] || "/images/logo.png",
          },
          variant: selectedVariant,
          quantity,
        },
      },
    });
  }}
  size="lg"
  variant="outline"
  className="w-full mt-4 border-secondary text-secondary hover:bg-secondary hover:text-white"
>
  Buy Now
</Button>


              {isStockManaged && canAddToCart && product.purchasable && (
                <p className="text-sm text-green-400 mt-3 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> {availableStock} in stock!
                </p>
              )}

              {isStockManaged && !canAddToCart && product.purchasable && (
                 <p className="text-sm text-yellow-400 mt-3 flex items-center justify-center gap-2">
                  <XCircle size={16} /> Not enough stock. Only {availableStock} left.
                </p>
              )}

              {/* {!product.purchasable && (
                  <p className="text-sm text-red-400 mt-3 flex items-center justify-center gap-2">
                    <XCircle size={16} /> Currently unavailable
                  </p>
              )} */}
            </div>

           

            
          </motion.div>
        </div>

            <div className="mt-8 border-t pt-6">

<div className="flex flex-wrap gap-3 mb-6">



</div>
{/* Product Details */}

<div className="mt-10 space-y-8">

  <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">

    <h2 className="text-2xl font-bold mb-4">
      Description
    </h2>

    <p className="text-gray-700 leading-8">
      {product.description}
    </p>

  </div>


  <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">

    <h2 className="text-2xl font-bold mb-4">
      Key Benefits
    </h2>

    <ul className="space-y-3 text-gray-700">

      {product.keyBenefits?.map(
        (benefit, index) => (

          <li key={index}>
            ✔ {benefit}
          </li>

        )
      )}

    </ul>

  </div>


  <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">

    <h2 className="text-2xl font-bold mb-4">
      Ingredients
    </h2>

    <p className="text-gray-700 leading-8">
      {product.ingredients}
    </p>

  </div>


  <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">

    <h2 className="text-2xl font-bold mb-4">
      Nutritional Information
    </h2>

    <p className="text-gray-700 leading-8">
      {product.nutritionalInformation}
    </p>

  </div>

</div>

</div>
{/* Uses + Reviews */}

<div className="grid md:grid-cols-2 gap-8 mt-12">

 {/* Uses Section */}

<div className="mt-10">

  <div className="grid gap-6">

  {product.uses?.map((use, index) => (

    <div
      key={index}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >

      <img
        src={use.image}
        alt={use.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">

        <h3 className="font-bold text-xl">
          {use.title}
        </h3>

        <p className="text-gray-500 mt-2">
          {use.description}
        </p>

      </div>

    </div>

  ))}

</div>


</div>

  


  {/* Reviews */}
  {/* <div className="bg-white rounded-2xl shadow-md p-8">

    <h2 className="text-2xl font-bold text-primary mb-6">
      Customer Reviews
    </h2>

    <div className="space-y-8">

      <div>

        <div className="flex gap-1 mb-3">

          <Star
            className="fill-yellow-400 text-yellow-400"
            size={18}
          />

          <Star
            className="fill-yellow-400 text-yellow-400"
            size={18}
          />

          <Star
            className="fill-yellow-400 text-yellow-400"
            size={18}
          />

          <Star
            className="fill-yellow-400 text-yellow-400"
            size={18}
          />

          <Star
            className="fill-yellow-400 text-yellow-400"
            size={18}
          />

        </div>

        <h3 className="font-semibold">
          Shraddha Kumari
        </h3>

        <p className="text-gray-500 mt-2">
          Amazing quality and authentic taste ❤️
        </p>

      </div>


      <div>

        <div className="flex gap-1 mb-3">

          <Star className="fill-yellow-400 text-yellow-400" size={18}/>
          <Star className="fill-yellow-400 text-yellow-400" size={18}/>
          <Star className="fill-yellow-400 text-yellow-400" size={18}/>
          <Star className="fill-yellow-400 text-yellow-400" size={18}/>
          <Star className="fill-yellow-400 text-yellow-400" size={18}/>

        </div>

        <h3 className="font-semibold">
          Rahul Mishra
        </h3>

        <p className="text-gray-500 mt-2">
          Packaging was excellent.
        </p>

      </div>

    </div>

  </div> */}

</div>

{/* You May Also Like */}

<div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    You May Also Like
  </h2>

  <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">

  {relatedProducts.map(item => (

    <div
      key={item._id}
      className="min-w-[250px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
    >

      <img
        src={
          item.images?.[0] ||
          "/images/logo.png"
        }
        alt={item.title}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">

        <h3 className="font-bold text-lg">
          {item.title}
        </h3>

        <p className="text-gray-500 mt-2">
          ₹{item.price}
        </p>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() =>
  navigate(`/product/${item._id}`)
}
        >
          View Product
        </Button>

      </div>

    </div>

  ))}

</div>

</div>
    
      </div>
    </>
  );
}

export default ProductDetailPage;