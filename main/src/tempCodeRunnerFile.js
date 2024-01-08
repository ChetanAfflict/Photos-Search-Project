import './App.css';
import {useState,useEffect} from "react";
import {createApi} from 'unsplash-js';
import {debounce} from 'lodash';

const unsplash=createApi({
  accessKey:'XR3ZuuwkCyw7VQa2xfGof1tOV3A-pQHQqetjcLb_eZs',
})

function App() {
  const [phrase,setPhrase]=useState('');
  const [images,setImages]=useState([]);

  function getunsplashImages(query,currpage=1){
    return new Promise((resolve,reject)=>{
        unsplash.search.getPhotos({
          query,
          page: currpage,
          perPage:5,
        }).then(result=>{
          resolve(result.response.results.map(result => result.urls.regular));
        })
    });

  }
  
  useEffect(() => {
    if(phrase!== ''){
      debounce(()=>{
        getunsplashImages(phrase,1)
        .then(images => setImages(images));
      },1000)();
     

    }
    
  }, [phrase]);


  return (
    <div>
      <input type="text" value={phrase} onChange={e=> setPhrase(e.target.value)}/>
      {images.length>0 && images.map(url => (
        <img src={url} />
      ))}
    </div>
  );
}

export default App;
