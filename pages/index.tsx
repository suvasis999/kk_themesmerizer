import React, { useState, useEffect,useRef} from "react";
import { GetServerSideProps, GetStaticProps } from "next";
import { Box} from "@chakra-ui/layout";
import { BASE_URL } from "../service/BaseURL";
import { Button, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,useDisclosure,FormErrorMessage,
  FormLabel,
  FormControl,
  Input,Grid, GridItem,Textarea ,AspectRatio,Spinner,Divider    } from '@chakra-ui/react'
import { useRouter } from "next/router";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Post, PostJsonResponse } from "../models/Post";
import Masonry from 'react-masonry-css';
import "./Home.module.css";
import styles from "../styles/Home.module.css";
import { AddIcon} from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { FetchData,PostData,FetchDataByid,FetchTeammsg} from '../service/MemoAPI';
import CarouselPage from "../components/Carousel";
import SingleCard from "../components/singleCard";
import TeamMessage from "../components/teamMessage";
import Header from "../components/header";
import ReCaptchaV2 from 'react-google-recaptcha';




const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  700: 2,
  500: 1
};




const IndexView = ({ data }: PostJsonResponse) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postDta, setpostDta] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [Spost, setSpost] = useState([]);
  const [files,setFiles] = useState<File | null>(null);
  const fileRef = useRef(null);
  const recaptchaRef = useRef(null)
  const [showMedia, setshowMedia] = useState(false);
  const [media, setmedia] = useState('');
  const [teamDta,setteamDta]=useState([]);
  const [disableSubmit,setDisableSubmit] = useState(true);
  const [showMore,setshowMore]=useState(false);
  const [start,setstart]=useState(0);
  const [lmt,setlmt]=useState(10);
  const [disSh,setdisSh]=useState(false);
  useEffect(() => {
    postData();
    teamMsgData();
    console.log(typeof(Spost));
    console.log(Spost);
    }, [Spost]);

 
  const postData=async()=>{
    const response = await FetchData(start,lmt);
    //const PostRecord = [...postDta, ...response.data.data];
    if(postDta.length>0){
      setpostDta(response.data.data); 
    }
    else{
      setpostDta(response.data.data);
    }
   
   // setpostDta([...postDta,response.data.data]); 
   //setpostDta(response.data.data); 
  }

  const teamMsgData=async()=>{
    const response = await FetchTeammsg();
    setteamDta(response.data.data);
}

 const loadmore=async()=>{
  const response = await FetchData(start+lmt,lmt);
  console.log(response.data.data.length);
 if(response.data.data.length==0){
  setdisSh(true);
  setstart(start);
 }
 else{
  setdisSh(false);
  setshowMore(true);
  setstart(start+lmt);
  
  let name2 = ([...postDta,response.data.data]);
  const b = [...postDta, ...response.data.data];
  setpostDta(b);
 console.log(response.data.data.length);
 setshowMore(false);

 }
 
   
 }


  const toPostView = async(id: number)=>{
    const response = await FetchDataByid(id);
    setSpost(response.data.data);
    setshowModal(true);
   }

   const toMediaView=(data)=>{
   setmedia(data);
    setshowMedia(true);
   }

 
  const closePostModal=()=>{
    setshowModal(false);
    setshowMedia(false);
  }
 
  const {
    handleSubmit,
    register,resetField,reset ,
    formState: { errors, isSubmitting  },
  } = useForm()

  const closeModal=()=>{
    reset();
     onClose();
  }
  const router = useRouter();
 // const toPostView = (id: number) =>console.log(id)/*router.push(`/posts/${id}`)*/;
  const posts = postDta.map((post) => (
    
    <PostCard
      key={post.id}
      title={post.attributes.title}
      content={post.attributes.message}
      postImage={post.attributes.cover.data==null?null:post.attributes.cover.data.attributes.url}
      publishedAt={post.attributes.createdAt}
      onClick={() => toPostView(post.id)}
      name={post.attributes.name}
      vdoLink={post.attributes.vdolink}
      playVdo={()=>toMediaView(post.attributes.vdolink)}
    />
  ));

  const teamMsg = teamDta.map((post) => (
    
    <TeamMessage
      key={post.id}
      message={post.attributes.message}
      postImage={post.attributes.coverimg.data==null?null:post.attributes.coverimg.data.attributes.url}
      
    />
  ));


  const onSubmit=async(values)=> {
   if(files==null){
    console.log('data is '+files);
    fetch(''+BASE_URL+'/posts', {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({'data':values})

        }).then((resp) => resp.json())
        .then((response) => {
          if (response) {
            console.log(JSON.stringify({'data':values}));
            
          }
        })
   }
   else{
    const formData = new FormData()
    formData.append('files', files);
    console.log(values);
     axios.post(''+BASE_URL+'/upload', formData)
    .then((response)=>{

      const imageId = response.data[0].id;
      formData.append('cover', imageId);
      formData.append('data', values);
      let postVal={
        "name": values.name,
          "email": values.email,
          "vdolink":  values.vdolink,
          "message": values.message,
          "cover": imageId,
          "title": values.title,
          "slug":  values.title
       
      };
     // console.log(postVal);
       fetch(''+BASE_URL+'/posts', {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({'data':postVal})

        }).then((resp) => resp.json())
        .then((response) => {
          if (response) {
            console.log(JSON.stringify({'data':postVal}));
            
          }
        })

     
    }).catch((error)=>{
        //handle error
    })
  }

 


     return new Promise<void>( (resolve) => {
     
      setTimeout(() => {
          reset();
          loadmore();
         resolve();
         onClose();
      }, 2000)
    })
  }
  const onChangeCaptch=(value)=>{
    setDisableSubmit(false);
    console.log("Captcha value:", value);
  }

  return (
      <>
     
     <div style={{margin:'0px 0px 30px 0px'}}>
      <Header openModal={onOpen}/>
     <div>
      <CarouselPage/>
     </div>
   
     <div style={{ 
    backgroundColor: '#314963',
    height: '80px',
    width: '80px',
    borderRadius: '100%',
    position: 'fixed',
    bottom: '21px',
    right: '25px',zIndex: 99}}> 
    <Box
  as='button'
  height='80px' width='80px' color='white' fontSize='40px'
   onClick={onOpen} style={{marginTop:'-6px'}}><AddIcon /></Box></div>
   
     
        <div
         style={{
        fontFamily:'cursive',marginBottom:"30px",marginTop:"0px",
        color: '#fff',
        textAlign:'center',
        fontSize: '30px',padding:'30px 5%'}}
      >
         {teamMsg}
       
        </div>
        <div style={{padding:'0px 10%'}}>
        <Divider orientation='horizontal' />
        </div>
        <div>
        <Box
         shadow="md"
       
        marginBottom="30px"
        marginTop="0px"
        padding={4}
        w="100%"
        mx="auto"
        style={{
        fontFamily:'RRegular',
        color: 'rgb(49 73 99)',
        textAlign:'center',
        fontSize: '30px',borderTop:'1px solid #dddddd54'}}
      >
        Tributes By Fans & Friends
        
        </Box>
        </div>
       
        <div>
        
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.my_masonry_grid}
            columnClassName={styles.my_masonry_grid_column} 
            >
              {posts}
          </Masonry>
        </div>
        <div style={{textAlign:'center'}}>
       
          <Button isLoading={showMore}
          variant="outline"
          style={{borderColor: "#cc9900",width:'12%',borderRadius:'0'}}
          _hover={{ bg: "#cc9900", borderColor: "#cc9900" }}
          disabled={disSh}
          onClick={loadmore}
        >
         Load More
         </Button>
        </div>
    </div>

    <Modal isOpen={isOpen} onClose={closeModal} size={'full'} >
        <ModalOverlay />
        <ModalContent style={{marginTop:'0px',margin: '30px 15%'}}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.message}>
                <FormLabel style={{fontSize:'14px',fontWeight: '400'}} htmlFor='Title'>Title</FormLabel>
                <Input
                  id='title'
                  placeholder='title'
                  _placeholder={{ fontSize:'14px', }}
                  style={{height: '30px',border: '1px solid #ddd'}}
                  {...register('title', )}
                />
                <FormErrorMessage>
                  {errors.msg && errors.msg.message}
                </FormErrorMessage>
              </FormControl>
          <Grid templateColumns='repeat(2, 1fr)' gap={6} style={{marginTop:'20px'}}>
          <GridItem w='100%' h='20' >
          <FormControl isInvalid={errors.name}>
                <FormLabel style={{fontSize:'14px',fontWeight: '400',}} htmlFor='name'>Name</FormLabel>
                <Input
                  id='name'
                  placeholder='name'
                  _placeholder={{ fontSize:'14px', }}
                  style={{height: '30px',border: '1px solid #ddd'}}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' },
                  })}
                />
               
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
          </GridItem>
          <GridItem w='100%' h='20' >
          <FormControl isInvalid={errors.email}>
                <FormLabel style={{fontSize:'14px',fontWeight: '400'}} htmlFor='email'>Email</FormLabel>
                <Input
                  id='email'
                  placeholder='email'
                  _placeholder={{ fontSize:'14px', }}
                  style={{height: '30px',border: '1px solid #ddd'}}
                  {...register('email', {
                    required: { value: true,message:'Email is required'},
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
          </GridItem>
          <GridItem w='100%' h='20' >
          <FormControl isInvalid={errors.files}>
                <FormLabel style={{fontSize:'14px',fontWeight: '400'}} htmlFor='files'>Image</FormLabel>
                <input  type="file" name="files"  ref={fileRef}
               id="media"  onChange={(e)=>setFiles(e.target.files[0])/*console.log(e.target.files)*/}
                style={{height: '32px',width:'100%', border: '1px solid #ddd'}}
                />
                
                <FormErrorMessage>
                  {errors.files && errors.files.message}
                </FormErrorMessage>
              </FormControl>
          </GridItem>
          <GridItem w='100%' h='20' >
          <FormControl isInvalid={errors.vdolink}>
                <FormLabel style={{fontSize:'14px',fontWeight: '400'}} htmlFor='vdolink'>
                  Youtube Link (Please add Video ID ex:<b>w37yQ5kAdIo</b></FormLabel>
                <Input
                  id='vdolink'
                  placeholder='Video Link'
                  _placeholder={{ fontSize:'14px', }}
                  {...register('vdolink', )}
                  style={{height: '30px',border: '1px solid #ddd'}}
                />
                <FormErrorMessage>
                  {errors.vdolink && errors.vdolink.message}
                </FormErrorMessage>
              </FormControl>
          </GridItem>
          <GridItem w='100%' h='0' ></GridItem>
        </Grid>
        <FormControl isInvalid={errors.message}>
                <FormLabel style={{fontSize:'14px',fontWeight: '400'}} htmlFor='message'>Message</FormLabel>
                <Textarea 
                  id='message'
                  placeholder='Message'
                  _placeholder={{ fontSize:'14px', }}
                  style={{height: '130px',border: '1px solid #ddd'}}
                  {...register('message', {
                    required: 'Message is required' })}
                  
                />
                <FormErrorMessage>
                  {errors.msg && errors.msg.message}
                </FormErrorMessage>
              </FormControl>
              <ReCaptchaV2 
              sitekey={'6Lejs20gAAAAACNocQ0cu_wc3dlJcXT208Do02Vn'} 
               onChange={onChangeCaptch}/>
               <Button mt={4} colorScheme='teal' isLoading={isSubmitting} 
               type='submit' style={{width:'100%'}} disabled={disableSubmit}>
                Submit
              </Button>
            </form>
          </ModalBody>

          
        </ModalContent>
      </Modal>


      <Modal isOpen={showModal} onClose={closePostModal} size={'full'} 
      
      >
      <ModalOverlay />
        <ModalContent style={{marginTop:'0px',margin: '30px'}}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <SingleCard postD={Spost}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closePostModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={showMedia} onClose={closePostModal}  
      
      >
      <ModalOverlay />
        <ModalContent style={{marginTop:'0px'}}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <AspectRatio maxW='560px' ratio={1}>
            <iframe
              src={'https://www.youtube.com/embed/'+media+''}
              allowFullScreen
            />
          </AspectRatio>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closePostModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      </>
    
    
  );
};

export default IndexView;
