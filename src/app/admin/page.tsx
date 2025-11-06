import VersionStatus from '@/components/VersionStatus'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Version Management</h2>
          <VersionStatus />
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Application Statistics</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Static Pages Generated</div>
              <div className="text-2xl font-bold text-green-400">330</div>
            </div>
            <div>
              <div className="font-medium">Edge Functions</div>
              <div className="text-2xl font-bold text-blue-400">3</div>
            </div>
            <div>
              <div className="font-medium">Build Time</div>
              <div className="text-2xl font-bold text-yellow-400">~4s</div>
            </div>
            <div>
              <div className="font-medium">Bundle Size</div>
              <div className="text-2xl font-bold text-purple-400">150kB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}