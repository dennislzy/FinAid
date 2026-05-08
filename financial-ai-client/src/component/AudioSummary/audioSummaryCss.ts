import styled from "styled-components";

export const bottomStyle:React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    gap: '10px',
}

export const summarybuttonStyle = {
    height: "50px",
    borderRadius: '30px',
    padding: '10px 20px', 
    fontSize: '1rem', 
    fontWeight: 'bold', 
    backgroundColor: "#34495E",
    "&:hover": {
      backgroundColor: "#3b536b", // Hover 時的背景色
    }
}
export const summarybuttonStyle2 = {
    height: "50px",
    borderRadius: '30px',
    padding: '10px 20px', 
    fontSize: '1rem', 
    fontWeight: 'bold', 
    backgroundColor: "#388E3C",
      "&:hover": {
        backgroundColor: "#3e9c42", // Hover 時的背景色
      }
}

export const scrollStyle:React.CSSProperties = {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#f9f7f7',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',marginTop: '-450px',
    marginBottom: '50px',
    zIndex: 1, 
}

export const UploadFileStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  width: 60vw;
  height: 40vh;
  max-width: 900px;
  max-height: 350px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
