import tw from 'tailwind-styled-components';

interface DividerProps {
  vertical?: boolean;
}

export const Divider = tw.div<DividerProps>`
  bg-gray-200
  ${({ vertical }) => (vertical ? 'w-px' : 'h-px')}
`;
