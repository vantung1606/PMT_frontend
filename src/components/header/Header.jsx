import '../../components/header/Header.css'
import logo from '../../assets/img/BrandTaskHub.png'
import BtnPale from '../button/BtnPale'
import BtnBold from '../button/BtnBold'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <header className={`header ${!isVisible ? 'header-hidden' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="logo" className='logo-img'/>
          <p className='logo-text'>TASK HUB</p>
        </div>
        <div className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">Home<i className="fa-solid fa-chevron-down"></i></a>
              <a href="/about" className="nav-link">About<i className="fa-solid fa-chevron-down"></i></a>
              <a href="/services" className="nav-link">Services<i className="fa-solid fa-chevron-down"></i></a>
              <a href="/contact" className="nav-link">Contact<i className="fa-solid fa-chevron-down"></i></a>
            </li>
          </ul>
        </div>
        <div className="header-right">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span className="user-greeting">
                Xin chào, {user?.username}
              </span>
              <BtnPale 
                style={{ width: '125px' }}
                onClick={logout}
              >
                Đăng xuất
              </BtnPale>
            </div>
          ) : (
            <>
              <BtnPale 
                style={{ width: '125px' }}
                onClick={() => navigate('/login')}
              >
                Đăng Nhập
              </BtnPale>
              <BtnBold 
                style={{ width: '125px' }}
                onClick={() => navigate('/register')}
              >
                Đăng Ký
              </BtnBold>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 