import GuestGuard from "@/guard/Guestguard";

const Layout = ({ children }) => {
    return (
      <GuestGuard>
          {children}
      </GuestGuard>
    );
  };
  export default Layout;
  