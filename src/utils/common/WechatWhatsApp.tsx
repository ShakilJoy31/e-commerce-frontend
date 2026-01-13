"use client";
//@ts-ignore
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";

const WeChatWhatsApp = () => {
  return (
    <WhatsAppWidget
      phoneNo="8801958044505"
      position="right"
      widgetWidth="250px"
      widgetWidthMobile="200px"
      autoOpen={false}
      autoOpenTimer={0}
      messageBox={true}
      messageBoxTxt="Hi Team, is there any related service available ?"
      iconSize="45"
      iconColor="white"
      iconBgColor="#2C3CCE"
      headerIcon=""
      headerIconColor="#2C3CCE"
      headerTxtColor="white"
      headerBgColor="#2C3CCE"
      headerTitle="Kry International"
      headerCaption="Online"
      bodyBgColor="#D0D0DD"
      chatPersonName="Support"
      chatMessage={
        <>
          Hi there 👋 <br />
          <br /> How can I help you?
        </>
      }
      footerBgColor="#bbb"
      placeholder="Type a message.."
      btnBgColor="#2C3CCE"
      btnTxt="Start Chat"
      btnTxtColor="white"
    />
  );
};

export default WeChatWhatsApp;
