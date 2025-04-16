import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Add your dashboard content here */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Welcome to your dashboard</h2>
            <p className="mt-2 text-sm text-gray-500">
              This is where you'll find an overview of your rental system.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 