import { ReactNode } from 'react';

interface InstallSectionProps {
  children: ReactNode;
}

interface HeaderProps {
  children: ReactNode;
}

interface ContentProps {
  children: ReactNode;
}

interface InstallSectionType extends React.FC<InstallSectionProps> {
  Header: React.FC<HeaderProps>;
  Content: React.FC<ContentProps>;
}

const InstallSection: InstallSectionType = ({ children }) => {
  return (
    <div className="mt-6 relative flex h-fit w-full flex-col items-center gap-4 rounded-2xl border border-borders-base2-light bg-base-3-light p-6 dark:border-borders-base2-dark dark:bg-base-3-dark">
      <div className="flex flex-col gap-2 max-w-3xl w-full">
        {children}
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
  	<div className="font-bold text-lg">
		{children}
	</div>
  );
};

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div className="mt-6 flex flex-col gap-6 items-center font-medium">
		{children}
    </div>
  );
};

InstallSection.Header = Header;
InstallSection.Content = Content;

export default InstallSection;
