import { FC } from 'react';
import { Navbar } from './Navbar';
import { MainContainer } from '../helpers/Content/MainContainer';

interface Props {
  children: React.ReactNode;
}

export const Page: FC<Props> = ({ children }) => {
  return (
    <article>
      <Navbar />
      <MainContainer>{children}</MainContainer>
    </article>
  );
};
