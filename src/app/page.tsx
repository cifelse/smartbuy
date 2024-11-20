'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllProducts, getAllCategories } from "@/lib/supabase";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string,
  name: string,
  price: number,
  rating: number,
  category: string,
  images: Array<string>,
}

type Category = {
  name: string,
  icon: string,
}

export default function Home() {
  const [products, setProducts] = useState<Array<Product>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  
  // Fetch Products and Categories on Component Mount
  useEffect(() => {
    (async () => {
      const fetchedProducts: Array<Product> = await getAllProducts();
      const fetchedCategories: Array<Category> = await getAllCategories();
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    })();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobile, setIsMobile] = useState(false);

  // Mobile Support for Responsive Design
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, []);

  // Filter Products by Category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar isMobile={isMobile} />

      {/* Filter Bar */}
      <nav className="sticky top-16 bg-white z-10 border-b">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex justify-start items-center space-x-2 md:space-x-4">
            <Button 
              variant={selectedCategory === 'All' ? "default" : "outline"}
              onClick={() => setSelectedCategory('All')}
              className="whitespace-nowrap"
              size={isMobile ? "sm" : "default"}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="whitespace-nowrap"
                size={isMobile ? "sm" : "default"}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Product Panel Proper */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-base text-center mb-10">
          Your Trusted Tindahan Online—Shop Smart, Save Big, Live Better!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}