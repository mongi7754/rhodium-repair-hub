import AppSidebar from "./AppSidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
