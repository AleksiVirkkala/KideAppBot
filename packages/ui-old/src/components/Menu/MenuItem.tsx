'use client';

import { Menu as HeadlessMenu } from '@headlessui/react';

interface MenuItemProps {
  label: string;
  Icon?: React.ElementType;
  onClick?: () => void;
}

export const MenuItem = ({ label, Icon, onClick }: MenuItemProps) => {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
          onClick={onClick}
        >
          {Icon ? (
            active ? (
              <Icon className="mr-2 h-5 w-5 text-gray-900" aria-hidden="true" />
            ) : (
              <Icon className="mr-2 h-5 w-5 text-gray-700" aria-hidden="true" />
            )
          ) : null}
          {label}
        </button>
      )}
    </HeadlessMenu.Item>
  );
};
