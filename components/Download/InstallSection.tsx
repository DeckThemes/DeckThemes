import { ReactNode } from "react";

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
    <div className="relative mt-6 flex h-fit w-full flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-3xl flex-col gap-2 border-t border-borders-base2-light pt-6 dark:border-borders-base2-dark">
        {children}
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  return <div className="text-lg font-bold">{children}</div>;
};

const Content: React.FC<ContentProps> = ({ children }) => {
  return <div className="mt-6 flex flex-col items-center gap-6 font-medium">{children}</div>;
};

InstallSection.Header = Header;
InstallSection.Content = Content;

export default InstallSection;
