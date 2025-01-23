import useAuth from "../../customHooks/useAuth";
import styles from "./dashboard.module.css";
const Dashboard = () => {
    useAuth();
  return (
    <section className = {styles.Dashboard}>
      <div className = {styles.MenuBar}>
        <img src="" alt="" />
      </div>
      <div className = {styles.mainSection}>
        <nav className = {styles.navBar}></nav>
          <div className = {styles.mainContent}>

          </div>
      </div>

    </section>
  )
}

export default Dashboard;