import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            disabled
            className="flex items-center gap-2 text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
        </div>

        {/* Project Header Skeleton */}
        <div className="bg-white rounded-lg p-6 mb-8 animate-pulse">
          <div className="flex gap-6">
            {/* Project Image Skeleton */}
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0"></div>

            <div className="flex-1">
              {/* Category and Creator Skeleton */}
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              
              {/* Project Title Skeleton */}
              <div className="h-8 bg-gray-200 rounded w-96 mb-4"></div>

              {/* Funding Info Skeleton */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>

              {/* Contact Button Skeleton */}
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Support Information Card Skeleton */}
        <Card className="mb-8 animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
            
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  {index < 4 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gift Information Card Skeleton */}
        <Card className="mb-8 animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-20 mb-6"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start py-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center py-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Support Card Skeleton */}
        <Card className="mb-8 animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-28 mb-6"></div>
            
            <div className="flex justify-between items-center py-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>

        {/* Total Amount Summary Skeleton */}
        <div className="mt-8 p-6 bg-white rounded-lg border-2 border-red-100 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 