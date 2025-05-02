import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, ChevronDown, User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative h-10 w-24">
                <Image
                  src="https://images.apollo247.in/images/icons/apollo247.svg" 
                  alt="Apollo 24/7"
                  width={96}
                  height={40}
                  className="object-contain"
                  style={{height:"48px"}}
                />
              </div>
            </Link>
            
            {/* Location Selector */}
            <div className="flex items-center text-gray-700">
              <Image
                  src="https://images.apollo247.in/images/ic_location_new.svg?tr=q-80,w-50,dpr-2,c-at_max" 
                  alt="Apollo 24/7"
                  width={24}
                  height={24}
                  className="object-contain"
                  style={{height:"24px"}}
                />
              <div className="flex flex-col">
                <span className="text-xs" style={{color: "#4b4a48"}}>Select Location</span>
                <div className="flex items-center">
                  <span className="text-sm font-bold" style={{color: "#121414"}}>Select Address</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mx-6" style={{flex : "0.7 1 0%"}}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 text-gray-500" style={{backgroundColor : "#FF6F6"}}/>
              </div>
              <input
                type="text"
                placeholder="Search Doctors, Specialities, Conditions etc."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Login Button */}
          <div className="flex items-center">
            <button className="flex items-center space-x-2 border border-teal-700 rounded-md px-4 py-2 text-teal-700 font-medium">
              <span>Login</span>
              <div className="h-6 w-6 rounded-full bg-teal-700 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Navigation Menu */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
              Buy Medicines
            </Link>
            <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
              Find Doctors
            </Link>
            <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
              Lab Tests
            </Link>
            <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
              Circle Membership
            </Link>
            <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
              Health Records
            </Link>
            <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
              Diabetes Reversal
            </Link>
            <div className="flex items-center relative">
              <Link href="#" className="text-gray-900 px-3 py-4 text-sm font-bold">
                Buy Insurance
              </Link>
              <span className="absolute top-3 right-0 text-xs font-medium text-green-600">New</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}