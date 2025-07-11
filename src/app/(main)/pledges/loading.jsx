import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
  return (
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

      {/* Page Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>

      {/* Summary Skeleton */}
      <div className="h-6 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mr-4"></div>
        <span className="text-gray-600 text-lg">후원 내역을 불러오는 중...</span>
      </div>

      {/* Pledge List Skeletons */}
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Image Skeleton */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                
                <div className="flex-1">
                  {/* Date and Number Skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  
                  {/* Title Skeleton */}
                  <div className="h-6 bg-gray-200 rounded w-64 mb-2"></div>
                  
                  {/* Subtitle Skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  
                  {/* Amount and Status Skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 