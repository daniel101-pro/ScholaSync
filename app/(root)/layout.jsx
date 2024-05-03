import StreamVideoProvider from '@/providers/StreamClientProvider';

const RootLayout = ({ children }) => {
  return <main><StreamVideoProvider>{children}</StreamVideoProvider></main>;
};

export default RootLayout