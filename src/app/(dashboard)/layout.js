import AuthGuard from "@/guard/Authguard";

const Layout = ({ children }) => {
  return (
    <AuthGuard>
        {children}
    </AuthGuard>
  );
};
export default Layout;
