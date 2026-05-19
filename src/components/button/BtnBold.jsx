import './Btn.css';

const BtnBold = ({ children, ...props }) => {
  return (
    <button className="btn-bold" {...props}>
      {children}
    </button>
  );
};

export default BtnBold; 