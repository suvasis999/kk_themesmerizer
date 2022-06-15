import { Button } from "@chakra-ui/button";
import { Box, Heading, Text,Grid,GridItem } from "@chakra-ui/layout";
import { IMAGE_URL } from "../service/BaseURL";
import styles from "../styles/Home.module.css";
export type PostCardProps = {
  title: any;
  publishedAt: any;
  onClick: VoidFunction;
  postImage:any;
  content:any;
  name:any;
  vdoLink?:any;
  playVdo?:VoidFunction
};

const PostCard = ({ title,name, publishedAt, onClick,playVdo,postImage,content,vdoLink }: PostCardProps) => {
  return (
    <>
      <Box
         shadow="lg"
        borderRadius="md"
        marginBottom="30px"
        
        padding={0}
        w="100%"
        mx="auto"
        style={{border: '1px solid #ddd',fontFamily: 'RRegular',
        position: 'relative',cursor:'pointer' }}
      >
        <div >
         
          {vdoLink=='' ?'':
          <img src='./play.png' width='30px' 
          style={{position:'absolute',zIndex:8,left:'10px',top:'10px'}}
          onClick={playVdo}
          />
         }
          <span style={{position:'absolute',zIndex:2,textAlign:'right',fontSize:"12px",
        color:'#666',fontStyle:'italic',right:'10px',top: '10px'}}>{new Date(publishedAt).toLocaleDateString('en-GB', {
          month: '2-digit',day: '2-digit',year: 'numeric'})}</span>
        <span style={{position:'absolute',zIndex:2,textAlign:'right',fontSize:"12px",
        color:'#fff',fontStyle:'italic',right:'10px',bottom: '10px'}}>{name}</span>
        
        </div>
         {postImage==null?
         
         <div style={{position: 'relative'}} onClick={onClick}>
           <img src='./default.jpg' height='300px' width='100%'/>
           <div className={styles.content}>
         {title ==''?'': <h1 style={{marginBottom:'10px',fontWeight:"bold",fontSize:"1em",
       whiteSpace:"pre-line"}}>{title}</h1>}
           <div   style={{color:'rgb(221 220 220)',fontSize:"1em",whiteSpace:"pre-line"}}>
           {content.length>50?content.substring(0, 50):content}
           <span  onClick={onClick} className={styles.linkColorBlack}>{content.length>50?'... Read More':''}</span>
          </div>
         </div></div>
         :
         <div style={{position: 'relative'}} onClick={onClick}>
         <img src={IMAGE_URL+ postImage} height='300px' width='100%'/>
           <div className={styles.content}>
          {title ==''?'': <h1 style={{marginBottom:'10px',fontWeight:"bold",fontSize:"1em",
        whiteSpace:"pre-line"}}>{title}</h1>}
            <div   style={{color:'rgb(221 220 220)',fontSize:"1em",whiteSpace:"pre-line"}}>
            {content.length>50?content.substring(0, 50):content}
            <span  onClick={onClick} className={styles.linkColor}>{content.length>50?'... Read More':''}</span>
           </div>
          </div>
          </div>}
      
      </Box>
    </>
  );
};

export default PostCard;
