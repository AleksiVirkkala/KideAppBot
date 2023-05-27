import { FC } from 'react';
import { AppBar } from './AppBar';
import { MainContainer } from '../helpers/Content/MainContainer';

interface Props {
	children: React.ReactNode;
}

export const Page: FC<Props> = ({ children }) => {
	return (
		<article>
			<AppBar navigationOptions={[]} />
			<MainContainer>{children}</MainContainer>
		</article>
	);
};
