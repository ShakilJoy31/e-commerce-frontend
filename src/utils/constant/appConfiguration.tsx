interface IConfigurationProps {
  appName: string;
  appCode: string;
  baseUrl: string;
  baseUrl2: string;
  databaseResetAPI: string;
  favicon: string;
  logo: string;
  URL: string;
  progressMessage: string;
  version: string;
  invoiceBanner: string;
}

const version = "V1.0.0";

//////////// BETA VERSION ////////////

// export const appConfiguration: IConfigurationProps = {
//   appName: "Kry International",
//   appCode: "__t_beta__",
//   baseUrl: "https://e-commerce-tech-elemet-bd.vercel.app/api/v1",
//   baseUrl2: "https://api.ecommerce.techelementbd.com/api/v1",
//   databaseResetAPI: "null",
//   URL: "http://localhost:5173",
//   favicon: "/devs.png",
//   invoiceBanner:"/invoice-bg.jpg",
//   logo: "/src/assets/longeng.png",
//   version,
//   progressMessage:
//     "Thank you for your interest! 🚀 We're currently working on implementing this feature. Stay tuned, as we'll be activating it very soon!",
// };

///////// PRODUCTION VERSION

 
//! Main
export const appConfiguration: IConfigurationProps = {
  appName: "Kry International",
  appCode: "__t_beta__",
  baseUrl: "https://e-commerce-tech-elemet-bd.vercel.app/api/v1",
  baseUrl2: "https://api.kryinternational.com/api/v1",
  // baseUrl: "https://e-commerce-tech-elemet-bd.vercel.app/api/v1",
  databaseResetAPI: "null",
  URL: "https://kryinternational.com",
  // URL: "https://ecommerce.techelementbd.com",
  favicon: "/devs.png",
  invoiceBanner: "/invoice-bg.jpg",
  logo: "/src/assets/longeng.png",
  version,
  progressMessage:
    "Thank you for your interest! 🚀 We're currently working on implementing this feature. Stay tuned, as we'll be activating it very soon!",
};


//! Development 

// export const appConfiguration: IConfigurationProps = {
//   appName: "Kry International",
//   appCode: "__t_beta__",
//   baseUrl: "http://localhost:2000/api/v1",
//   baseUrl2: "http://localhost:2000/api/v1", 
//   // baseUrl: "http://localhost:2000/api/v1",
//   databaseResetAPI: "null",
//   URL: "https://kryinternational.com",
//   // URL: "https://ecommerce.techelementbd.com",
//   favicon: "/devs.png",
//   invoiceBanner: "/invoice-bg.jpg",
//   logo: "/src/assets/longeng.png",
//   version,
//   progressMessage:
//     "Thank you for your interest! 🚀 We're currently working on implementing this feature. Stay tuned, as we'll be activating it very soon!",
// };

