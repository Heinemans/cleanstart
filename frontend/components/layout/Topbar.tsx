import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Topbar() {
  return (
    <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-blue-600 px-4 shadow-sm sm:gap-x-6 sm:px-6">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </div>
      </div>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Profile dropdown */}
        <div className="flex items-center gap-x-4">
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="text-sm font-semibold leading-6 text-white">John Doe</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
} 