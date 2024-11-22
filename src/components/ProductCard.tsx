import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Plus } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  images: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasMultipleImages = product.images.length > 1;

  const nextImage = useCallback(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  }, [product.images.length, hasMultipleImages]);

  const prevImage = useCallback(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  }, [product.images.length, hasMultipleImages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (hasMultipleImages) {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    }
  }, [prevImage, nextImage, hasMultipleImages]);

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-label={`Product: ${product.name}`}
    >
      <Card className="overflow-hidden transition-shadow duration-300 group-hover:shadow-lg">
        <div className="relative aspect-square">
          {product.images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={`${product.name} - Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {hasMultipleImages && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                onClick={prevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {product.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentImageIndex(index)}
                    onKeyPress={(e) => e.key === 'Enter' && setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-sm font-bold mt-1">₱{product.price.toFixed(2)}</p>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" aria-hidden="true" />
            <span className="text-sm">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        <Link href={`/products/${product.id}`} passHref>
          <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="View product details">
            <ShoppingCart className="h-5 w-5" />
            <Plus className="h-3 w-3 absolute -top-1 -right-1 bg-white rounded-full" />
          </Button>
        </Link>
      </div>
    </div>
  );
}