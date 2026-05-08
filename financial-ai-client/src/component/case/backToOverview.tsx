import { backButton, submitButtonFontSize } from "@/styledComponents/formCss";
import { Button } from "@mui/material";
import Link from "next/link";

export default function BackToOverview () {
    return(
        <center>
            <Link href={`/`}>
                <Button          
                    variant="contained" 
                    size="large" 
                    sx={backButton}
                    id="back-to-overview"
                >
                    <b style={submitButtonFontSize}>回到總覽</b>
                </Button>
            </Link>
        </center>
    );
}