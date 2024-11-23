'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { getProduct, getUser } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react'
import NavBar from '@/components/NavBar'
import Link from 'next/link'

type Product = {
  id: string
  category: string
  name: string
  description: string
  images: string[]
  quantity: number
  price: number
  created_at: string
  seller_id: string
  rating: number
}

type Seller = {
  first_name: string
  last_name: string
  pfp: string
}

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchProductAndSeller = async () => {
      const fetchedProduct = await getProduct(id as string)
      setProduct(fetchedProduct)
      if (fetchedProduct) {
        const fetchedSeller = await getUser(fetchedProduct.seller_id)
        setSeller(fetchedSeller)
      }
    }
    fetchProductAndSeller()
  }, [id]);

  const [isMobile, setIsMobile] = useState(false);

  // Mobile Support for Responsive Design
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, []);

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
    }
  }

  if (!product || !seller) {
    return <ProductSkeleton />
  }

  return (
    <>
        <NavBar isMobile={isMobile} />
        <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
            <div 
            className="relative aspect-square"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
            <Card className="overflow-hidden rounded-xl">
                <CardContent className="p-0">
                {product.images.map((image, index) => (
                    <Image
                        key={image}
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className={`absolute inset-0 transition-opacity duration-300 ease-in-out rounded-xl ${
                            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
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
                </CardContent>
            </Card>
            </div>
            <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={seller.pfp} alt={`${seller.first_name} ${seller.last_name}`} />
                    <AvatarFallback>{seller.first_name[0]}{seller.last_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium">Seller</p>
                    <p className="text-lg">{seller.first_name} {seller.last_name}</p>
                </div>
            </div>
            <div>
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <p className="text-sm text-muted-foreground mt-2">{product.category}</p>
            </div>
            <div className="flex items-center space-x-2">
                <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                    key={i}
                    className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    />
                ))}
                </div>
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <p className="text-3xl font-bold">₱{product.price.toFixed(2)}</p>
            <p className="text-lg text-muted-foreground">{product.description}</p>
            <div className="space-y-2">
                <p className="text-sm font-medium">Quantity available: {product.quantity}</p>
                <p className="text-sm text-muted-foreground">
                Listed on {new Date(product.created_at).toLocaleDateString()}
                </p>
            </div>
            <Link href="/login">
                <Button className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
            </Link>
            </div>
        </div>
        </div>
    </>
  )
}

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32 mt-1" />
            </div>
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}