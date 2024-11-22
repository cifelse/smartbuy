import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NavBar({ isMobile, hideButton }: Readonly<{ isMobile: boolean; hideButton?: boolean }>) {
    return (
        <header className="border-b sticky top-0 bg-white z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            
                <Link href="/">
                    <div className="flex items-center">
                        <ShoppingBag className="h-6 w-6 mr-2" />
                        <h1 className="text-2xl font-bold">SmartBuy</h1>
                    </div>
                </Link>
                <div className="flex gap-2 md:gap-4">
                    {!hideButton && (
                        <>
                            <Link href="/login" passHref>
                                <Button variant="default" size={isMobile ? "sm" : "default"}>Log In</Button>
                            </Link>
                            <Link href="/login" passHref>
                                <Button variant="outline" size={isMobile ? "sm" : "default"}>Be a Seller</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}