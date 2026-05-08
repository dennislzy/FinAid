import React from 'react';
interface AudioSummaryStyleProps {
    backgroundImage?: string;
    children: React.ReactNode;
    content:JSX.Element
}
const AudioSummaryStyle = (audioSummaryProps:AudioSummaryStyleProps) => {
    const { backgroundImage='/images/bg.jpg', children,content } = audioSummaryProps
  // 容器樣式
  const containerStyle:React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#34495E',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto',
  };

  // 背景樣式
  const backgroundStyle:React.CSSProperties = {
    width: '100%',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    color: '#333',
  };

  // 內容樣式
  const contentStyle:React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    left: '7%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#E7F4FF',
    padding: '10px',
    borderRadius: '4px',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}>
        <div style={contentStyle}>
            {content}
        </div>
      </div>
      {/* 右上角的icon */}
      <div 
        style={{position: 'absolute',top: '10%',right: '2%', zIndex: 10,}}>
        <img 
          src="/images/icon2.png" 
          alt="Icon" 
          style={{ width: '60%' }}
        />
      </div>
      {children}
    </div>
  );
};

export default AudioSummaryStyle;
