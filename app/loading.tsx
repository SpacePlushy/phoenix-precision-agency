import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Phoenix Logo Placeholder */}
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-lg">PA</span>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading Phoenix Precision Agency...</span>
        </div>
        
        {/* Progress Indication */}
        <div className="mt-6 max-w-xs mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          Preparing your digital transformation experience
        </p>
      </div>
    </div>
  );
}