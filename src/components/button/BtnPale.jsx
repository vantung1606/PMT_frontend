import './Btn.css';

const BtnPale = ({ children, ...props }) => {
  return (
    <button className="btn-pale" {...props}>
      {children}
    </button>
  );
};

export default BtnPale;