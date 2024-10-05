import NavigationSideBar from "@/components/navigation/navigation-sidebar"
import styles from './MainLayout.module.css'
const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full ">
      <div className={styles.navigationSidebar}>navigationSidebar
        <NavigationSideBar />
      </div>
      <main className="h-full md:pl-[72px]">
        {children}
      </main>
    </div>
  )
}

export default MainLayout