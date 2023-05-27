'use client';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const alignments = {
	left: 'left-0 origin-top-left',
	right: 'right-0 origin-top-right'
} as const;

interface MenuProps {
	label: string;
	children: React.ReactNode;
	align?: keyof typeof alignments;
}

export const Menu = ({ label, children, align = 'right' }: MenuProps) => {
	return (
		<HeadlessMenu as="div" className="relative inline-block text-left">
			<div>
				<HeadlessMenu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					{label}
					<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
				</HeadlessMenu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<HeadlessMenu.Items
					className={`${alignments[align]} absolute mt-2 w-56 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
				>
					{children}
				</HeadlessMenu.Items>
			</Transition>
		</HeadlessMenu>
	);
};
