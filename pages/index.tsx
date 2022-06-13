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
  Input,Grid, GridItem,Textarea ,AspectRatio,Spinner   } from '@chakra-ui/react'
import { useRouter } from "next/router";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Post, PostJsonResponse } from "../models/Post";
import Masonry from 'react-masonry-css';
import "./Home.module.css";
import styles from "../styles/Home.module.css";
import { AddIcon} from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { FetchData,PostData,FetchDataByid} from '../service/MemoAPI';
import CarouselPage from "../components/Carousel";
import SingleCard from "../components/singleCard";


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
  const [showMedia, setshowMedia] = useState(false);
  const [media, setmedia] = useState('');
 
   
  useEffect(() => {
    postData();
    console.log(Spost);
  console.log(typeof(Spost));
  console.log(Spost);
  }, [Spost]);

  const postData=async()=>{
    const response = await FetchData();
    setpostDta(response.data.data); 

  }

  const toPostView = async(id: number)=>{
    const response = await FetchDataByid(id);
    setSpost(response.data.data);
    setshowModal(true);
   }

   const toMediaView=(data)=>{
    console.log(data);
    setmedia(data);
    setshowMedia(true);
   }


  const Singleposts = (data) => {
    return(
    <SingleCard postD={data}/>
    )
  };

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
  const onSubmit=async(values)=> {
   if(files==null){
    console.log('data is '+files);
    fetch(BASE_URL, {
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
     axios.post(BASE_URL, formData)
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
       fetch(BASE_URL, {
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
          postData();
         resolve();
         onClose();
      }, 2000)
    })
  }


  return (
      <>
      
     <div style={{margin:'0px 0px 30px 0px'}}>
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
   
     <Box
         shadow="lg"
        borderRadius="md"
        marginBottom="30px"
        marginTop="0px"
        padding={4}
        w="100%"
        mx="auto"
        style={{ border:'1px solid rgb(221, 221, 221)',
        fontFamily:'cursive',
        backgroundColor: 'hsl(224deg 30% 75%)',
        color: '#fff',
        textAlign:'center',
        fontSize: '30px'}}
      >
        In Loving Memory of KK 
        
        </Box>
        
      <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.my_masonry_grid}
      columnClassName={styles.my_masonry_grid_column} 
    >
       {posts}
    </Masonry>
    </div>

    <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns='repeat(2, 1fr)' gap={6}>
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
                <FormLabel style={{fontSize:'14px',fontWeight: '400'}} htmlFor='vdolink'>Video Link</FormLabel>
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
                  style={{height: '30px',border: '1px solid #ddd'}}
                  {...register('message', {
                    required: 'Message is required' })}
                />
                <FormErrorMessage>
                  {errors.msg && errors.msg.message}
                </FormErrorMessage>
              </FormControl>
               <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                Submit
              </Button>
            </form>
          </ModalBody>

          
        </ModalContent>
      </Modal>


      <Modal isOpen={showModal} onClose={closePostModal} size={'full'} 
      
      >
      <ModalOverlay />
        <ModalContent style={{marginTop:'0px'}}>
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
              src={media}
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
