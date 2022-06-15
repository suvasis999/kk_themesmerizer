import { Button } from "@chakra-ui/button";
import { Box, Heading, Text,Grid,GridItem } from "@chakra-ui/layout";
import { IMAGE_URL } from "../service/BaseURL";
import styles from "../styles/Home.module.css";
import { Image } from '@chakra-ui/react';

export type TeamMsgProps = {
    message?:any; 
    postImage?:any
};



const TeamMessage = (props: TeamMsgProps) => {
  return (
    <>
      
         {props.postImage==null?
         <div className={styles.content_wIMGSingle2}>
         
           <div   style={{color:'#000',fontSize:"14px",whiteSpace:"pre-line",
          fontFamily:'RRegular'}}>
           {props.message}
           </div>
         </div>
         :
         <div style={{position: 'relative'}}>
         
           <div className={styles.contentModal}>
           <Image
            borderRadius='full'
            boxSize='200px'
            src={IMAGE_URL+ props.postImage}
            alt='KK FOREVER'
            style={{float:'left',marginRight:'30px'}}
            />
           {/*<img src={IMAGE_URL+ props.postImage} 
         height='300px' width='400px' style={{float:'left',paddingRight:'40px'}}/>
         */}
          
            <span   style={{color:'#000',fontSize:"14px",whiteSpace:"pre-line",padding:'30px',
          fontFamily:'RRegular'}}>
            {props.message}</span>
          </div>
  </div>}
         
      
     
      
    </>
  );
};

export default TeamMessage;
