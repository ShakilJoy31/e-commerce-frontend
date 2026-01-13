import logo from "../../assets/images/icon/favicon.png";

const HomeLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <img src={logo} alt="kry-home" className="w-20 h-20 animate-pulse" />
    </div>
  );
};

export default HomeLoader;
