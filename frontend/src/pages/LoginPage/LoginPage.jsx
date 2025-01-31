import styles from "./loginpage.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Contexts/UserContext";
import { loginUser, registerUser } from "../../api/api";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useScreenSize from "../../customHooks/useScreenSize";
import {
  validateEmail,
  validatePassword,
  validateContact,
} from "../../errorHandler/inputError";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const navigate = useNavigate();
  const isTablet = useScreenSize(980);
  const { setIsLoggedIn, setUserData } = useUserContext();
  const [isJustRegistered, setIsJustRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserDataState] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (errors.username || errors.email || errors.contact) {
      toast.error("Error Registering ...", {
        position: "top-right",
        autoClose: 3000, // Closes toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataState({
      ...userData,
      [name]: value,
    });
  };

  const handleRegisterLink = () => {
    setIsLogin(!isLogin);
    setIsJustRegistered(false);
    setErrors({
      username: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: "",
    });
    setUserDataState({
      username: "",
      email: "",
      contact: "",
      password: "",
    });
    setConfirmPassword("");
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { username, email, contact, password } = userData;
    console.log(username, email, contact, password);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const contactError = validateContact(contact);
    const confirmPasswordError =
      password !== confirmPassword ? "Passwords do not match" : "";

    setErrors({
      username: !username ? "Username is required" : "",
      email: emailError?.error || "",
      contact: contactError?.error || "",
      password: passwordError?.error || "",
      confirmPassword: confirmPasswordError,
    });

    if (
      !username ||
      emailError?.error ||
      contactError?.error ||
      passwordError?.error ||
      confirmPasswordError
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(
        username,
        email,
        contact,
        password
      );
      console.log(response);
      setIsLoading(false);

      if (response.message === "Success") {
        setIsJustRegistered(true);
        toast.success("Registeration Successful!", {
          position: "top-right",
          autoClose: 3000, // Closes toast after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsLogin(true);
      } else if (response === "Username already exists") {
        setErrors({ ...errors, username: "Username already exists" });
      } else if (response === "Email already exists") {
        setErrors({ username: "", email: "Email already exists" });
      } else if (response === "Contact already exists") {
        setErrors({
          username: "",
          contact: "Contact already exists",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert(
        "An error occurred while registering. Please try again later."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = userData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError?.error || "",
      password: passwordError?.error || "",
    });

    if (emailError.error || passwordError.error) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password);
      console.log("Login",response);
      if (response.message === "Success") {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000, // Closes toast after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      setIsLoading(false);
      if (response.message === "Success") {
        const completeUserData = {
          ...response.user,
          userId: response.user._id,
        };
        setIsLoggedIn(true);
        setUserData(completeUserData);

        navigate("/");
      } else {
        if (response === "Invalid email") {
          setErrors({
            ...errors,
            email: "Invalid email",
            password: "",
          });
        } else if (response === "Invalid password") {
          setErrors({
            ...errors,
            email: "",
            password: "Invalid password",
          });
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(
        "An error occurred while logging in. Please try again later."
      );
    }
  };

  return (
    <section className={styles.loginPage}>
      <div className={styles.leftContainer}>
        {!isTablet && (
          <img
            className={styles.logo}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737555978/download_2_cmwand.png"
            alt="logo"
          />
        )}
        <img
          className={styles.leftBackground}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737555992/m_image_nplbjl.png"
          alt="leftBackground"
        />
      </div>
      <div className={styles.loginContainer}>
        {isTablet && (
          <img
            className={styles.logo}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737555978/download_2_cmwand.png"
            alt="logo"
          />
        )}
        <nav>
          <button
            onClick={() => setIsLogin(false)}
            className={`${styles.navLogin} ${
              isLogin ? "" : styles.active
            }`} // Add the active class if isLogin is falsestyles.navSignUp}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`${styles.navLogin} ${
              isLogin ? styles.active : ""
            }`}
          >
            Login
          </button>
        </nav>
        <h1 className={styles.heading}>
          {isLogin ? "Login" : "Join us Today!"}
        </h1>

        <div className={styles.loginForm}>
          <>
            {!isLogin && (
              <div
                className={`${styles.userNameForm} ${
                  errors.username ? styles.errorField : ""
                }`}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Name"
                  onChange={handleChange}
                />
                <div className={styles.error}>{errors.username}</div>
              </div>
            )}
            {!isLogin && (
              <div
                className={`${styles.contactForm} ${
                  errors.contact ? styles.errorField : ""
                }`}
              >
                <input
                  type="contact"
                  name="contact"
                  placeholder="Mobile no."
                  onChange={handleChange}
                />
                <div className={styles.error}>{errors.contact}</div>
              </div>
            )}

            {isLogin && <div className={styles.emptySpace}></div>}

            <div
              className={`${styles.emailForm} ${
                errors.email ? styles.errorField : ""
              }`}
            >
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email id"
              />
              <div className={styles.error}>{errors.email}</div>
            </div>
            <div className={styles.passwordForm}>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <div className={styles.error}>{errors.password}</div>
            </div>

            {!isLogin && (
              <div
                className={`${styles.passwordForm} ${
                  errors.confirmPassword ? styles.errorField : ""
                }`}
              >
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type="password"
                  name="password"
                  placeholder="xxxxxxxxx"
                />
                <div className={styles.error}>
                  {errors.confirmPassword}
                </div>
              </div>
            )}
            {isLogin ? (
              <button
                onClick={handleLogin}
                className={styles.loginButton}
              >
                {isLoading ? (
                  <ClipLoader color="white" size={25} />
                ) : (
                  "Log In"
                )}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className={styles.loginButton}
              >
                {isLoading ? (
                  <ClipLoader color="white" size={25} />
                ) : (
                  "Sign Up"
                )}
              </button>
            )}

            {!isLogin ? (
              <div className={styles.signUpText}>
                <p>Already have an account?</p>
                <a
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegisterLink();
                  }}
                  href=""
                >
                  Login
                </a>
              </div>
            ) : (
              <div className={styles.signUpText}>
                <p>Don’t have an account?</p>
                <a
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegisterLink();
                  }}
                  href=""
                >
                  SignUp
                </a>
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
