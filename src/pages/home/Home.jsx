import Header from '../../components/header/Header'
import '../home/Home.css'
import Footer from '../../components/footer/Footer';
import InforLayout from '../../layouts/inforLayout/InforLayout';
const Home = () => {
  return (
    <div className="container">
      {/* Header */}
      <Header />

      <InforLayout/>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home; 