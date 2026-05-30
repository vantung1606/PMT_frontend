import './NotFound.css'
import BtnBold from '../../components/button/BtnBold';
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-icon">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/"><BtnBold style={{ background: '#ccc' }}>Go to home</BtnBold></Link>
      </div>
    </div>
  );
};

export default NotFound; 