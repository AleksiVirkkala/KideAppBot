import { MainContainer } from '../helpers/Content';
import { AppBar } from './AppBar';

export interface AppShellProps {
	children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
	return <>{children}</>;
};

AppShell.AppBar = AppBar;
AppShell.MainContainer = MainContainer;
