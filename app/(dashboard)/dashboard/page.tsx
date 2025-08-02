export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to your dashboard. This page requires authentication when Clerk is properly configured.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">What you can do here:</h2>
        <ul className="text-blue-800 space-y-1">
          <li>• View your project progress</li>
          <li>• Access client resources</li>
          <li>• Communication tools</li>
          <li>• Download deliverables</li>
        </ul>
      </div>
    </div>
  )
}