import CircularProgress from '@mui/material/CircularProgress';
interface LoadingProps{
  isAudioText:boolean
}
const Loading = (loadingProps:LoadingProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {
        loadingProps.isAudioText && <> <p style={{ fontSize: '1.5rem', color: '#888', fontWeight: 'bold' }}>請稍後</p><p style={{ fontSize: '1rem', color: '#888', margin: '10px 0' }}>我們正在努力為您轉文字</p></>
      }
      <CircularProgress style={{ color: '#062ba6', margin: '20px' }} size={60} />
    </div>
  );
};

export default Loading;
