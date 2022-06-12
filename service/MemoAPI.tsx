import axios from "axios";
import { BASE_URL } from "./BaseURL";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  
};

// ---------------- Register & Login APIs -----------------
export const FetchData = async () => {
  let res = await axios.get(BASE_URL + `/posts?populate=*`);
  
   return res;
};

export const FetchDataByid = async (id) => {
  let res = await axios.get(BASE_URL + `/posts/`+id+`?populate=*`);
  
   return res;
};

export const FetchSlider = async () => {
  let res = await axios.get(BASE_URL + `/sliders?populate=*`);
  
   return res;
};


export const PostData = async (data) => {
  console.log('DATA IS '+JSON.stringify(data));
  /*let res = await axios.post(BASE_URL + `/posts`, data);
  return res;*/

  let result = {};
  const url = BASE_URL + `/posts`;
  const postData = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: data,
  })
    .then((resp) => resp.json())
    .then((response) => {
      if (response) {
        console.log(response);
        result = response;
      }
    });
  return result;
  
 

};
