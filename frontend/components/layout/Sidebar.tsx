'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TagIcon,
  DocumentTextIcon,
  PuzzlePieceIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Verhuur', href: '/rentals', icon: ClipboardDocumentListIcon },
  { name: 'Verhuurformulier', href: '/rentalform', icon: DocumentTextIcon },
  { name: 'Artikelen', href: '/items', icon: CubeIcon },
  { name: 'Klanten', href: '/customers', icon: UserGroupIcon },
  { name: 'Prijslijsten', href: '/admin/price-lists', icon: CurrencyEuroIcon },
  { name: 'Prijscodes', href: '/admin/price-codes', icon: TagIcon },
  { name: 'Prijsstaffels', href: '/admin/price-list-links', icon: CurrencyEuroIcon },
  { name: 'Artikelsoorten', href: '/admin/item-types', icon: CubeIcon },
  { name: 'Accommodatietypes', href: '/admin/accommodation-types', icon: BuildingOfficeIcon },
  { name: 'Bagagetijden', href: '/admin/baggage-times', icon: ClockIcon },
  { name: 'Boottijden', href: '/admin/boat-times', icon: ClockIcon },
  { name: 'Items Beheer', href: '/admin/items', icon: CubeIcon },
  { name: 'Statistieken', href: '/statistics', icon: ChartBarIcon },
  { name: 'Instellingen', href: '/settings', icon: Cog6ToothIcon },
];

const blocksNavigation = [
  { name: 'Klantgegevens', href: '/blocks/customer-details', icon: UserGroupIcon },
  { name: 'Vakantieadres', href: '/blocks/vacation-address', icon: HomeIcon },
  { name: 'Verhuurperiode', href: '/blocks/rental-period', icon: CalendarDaysIcon },
  { name: 'Verhuurde items', href: '/blocks/rental-items', icon: CubeIcon },
  { name: 'Extra services', href: '/blocks/extra-services', icon: PuzzlePieceIcon },
  { name: 'Betaalmethode', href: '/blocks/payment-method', icon: CreditCardIcon },
  { name: 'Prijsinformatie', href: '/blocks/price-information', icon: CurrencyEuroIcon },
  { name: 'Opmerkingen', href: '/blocks/comments', icon: ChatBubbleLeftRightIcon },
  { name: 'Finaliseren', href: '/blocks/finalize', icon: CheckCircleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-60 flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-semibold text-black">Rental System</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400 px-2">Bloks</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {blocksNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
} 