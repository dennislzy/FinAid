interface AudioSummaryTitleProps {
    title:string,
    content:string
}
const AudioSummaryTitle=(audioSummaryProps:AudioSummaryTitleProps)=>{
    return (
        <>
         <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <h2 style={{ fontSize: '1.8rem', color: '#2C7BBF', fontWeight: 'bold', marginBottom: '0px' }}>
           {audioSummaryProps.title}
          </h2>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
            {audioSummaryProps.content}
          </p>
        </div>

        </>
    )
}
export default AudioSummaryTitle