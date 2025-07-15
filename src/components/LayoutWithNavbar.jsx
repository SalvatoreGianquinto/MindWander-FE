import NavigationBar from "./NavigatioBar.jsx"
import { Outlet } from "react-router-dom"

const LayoutWithNavbar = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  )
}

export default LayoutWithNavbar
