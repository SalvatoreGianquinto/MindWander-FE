import MyFooter from "./MyFooter.jsx"
import NavigationBar from "./NavigatioBar.jsx"
import { Outlet } from "react-router-dom"

const LayoutWithNavbar = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <MyFooter />
    </>
  )
}

export default LayoutWithNavbar
