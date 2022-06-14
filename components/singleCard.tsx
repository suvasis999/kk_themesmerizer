import { Button } from "@chakra-ui/button";
import { Box, Heading, Text,Grid,GridItem } from "@chakra-ui/layout";
import { IMAGE_URL } from "../service/BaseURL";
import styles from "../styles/Home.module.css";
export type PostCardProps = {
  postD:any
};

const SingleCard = (props: PostCardProps) => {
  return (
    <>
      <Box
         borderRadius="md"
        marginBottom="30px"
        padding={0}
        w="100%"
        h='100%'
        mx="auto"
        style={{fontFamily: 'cursive',
        position: 'relative' }}
      >
         
        <div >
          <span style={{position:'absolute',zIndex:2,textAlign:'right',fontSize:"12px",
        color:'#666',fontStyle:'italic',right:'10px',top: '10px'}}>{new Date(props.postD.attributes.publishedAt).toLocaleDateString()}</span>
        
        </div>
         {props.postD.attributes.cover.data==null?
         <div className={styles.content_wIMGSingle}>
           <div style={{fontSize:"12px",
        color:'rgb(109 105 105)',fontStyle:'italic',right:'70px',bottom: '100px'}}>
          Tribute By : ({props.postD.attributes.name})</div>
        
         {props.postD.attributes.title ==''?'': <h1 style={{marginBottom:'10px',fontWeight:"bold",fontSize:"1em",
       whiteSpace:"pre-line"}}>{props.postD.attributes.title}</h1>}
           <div   style={{color:'#000',fontSize:"1em",whiteSpace:"pre-line"}}>
           {props.postD.attributes.message}
           </div>
         </div>
         :
         <div style={{position: 'relative'}}>
         
           <div className={styles.contentModal}>
           <img src={IMAGE_URL+ props.postD.attributes.cover.data.attributes.url} 
         height='300px' width='400px' style={{float:'left',paddingRight:'40px'}}/>
          <div style={{fontSize:"12px",
        color:'rgb(109 105 105)',fontStyle:'italic',right:'70px',bottom: '100px'}}>Tribute By : ({props.postD.attributes.name})</div>
        
          {props.postD.title ==''?'': <h1 style={{marginBottom:'10px',fontWeight:"bold",fontSize:"1em",
        whiteSpace:"pre-line"}}>{props.postD.title}</h1>}
            <span   style={{color:'#000',fontSize:"1em",whiteSpace:"pre-line"}}>
            {props.postD.attributes.message}</span>
          </div>
          </div>}
      
      </Box>
      
    </>
  );
};

export default SingleCard;
