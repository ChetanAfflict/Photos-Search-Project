import './App.css';
import {useState,useEffect,useRef} from "react";
import {createApi} from 'unsplash-js';
import {debounce} from 'lodash';
import { BounceLoader } from 'react-spinners';


const unsplash=createApi({
  accessKey:'XR3ZuuwkCyw7VQa2xfGof1tOV3A-pQHQqetjcLb_eZs',
})


function App() {
  const [phrase,setPhrase]=useState('');
  const phraseRef=useRef(phrase);
  const [images,setImages]=useState([]);
  const imagesRef=useRef(images);
  const [fetching,setFetching]=useState(false);
  const fetchingRef=useRef(fetching);

  function getunsplashImages(query,currpage=1){
    setFetching(true);
    fetchingRef.current=true;
    return new Promise((resolve,reject)=>{
        unsplash.search.getPhotos({
          query,
          page: currpage,
          perPage:5,
        }).then(result=>{
          setFetching(false);
          fetchingRef.current=false;
          resolve(result.response.results.map(result => result.urls.regular));
        })
    });

  }
  
  useEffect(() => {
    phraseRef.current=phrase;
    if(phrase!== ''){
      debounce(()=>{
        setImages([]);
        getunsplashImages(phrase,1)
        .then(images => {
          setImages(images);
          imagesRef.current=images;
        });
      },1000)();
     

    }
    
  }, [phrase]);

  function handleScroll(e){
    const {scrollHeight,scrollTop,clientHeight}= e.target.scrollingElement;
    const isBottom= scrollHeight-scrollTop<=clientHeight;
    if(isBottom && !fetchingRef.current){
      getunsplashImages(phraseRef.current, imagesRef.current.length/5 + 1 )
      .then(newImages=>{
        imagesRef.current=[...imagesRef.current,...newImages];
        setImages(imagesRef.current);
      })
    }
  }

  useEffect(()=>{
    document.addEventListener('scroll',handleScroll,{passive:true});
    return ()=>document.removeEventListener('scroll',handleScroll);
  },[])

  return (
    <div>
      <input type="text" value={phrase} onChange={e=> setPhrase(e.target.value)}/>
      
     
      <div>
      {images.length>0 && images.map(url => (
        <img src={url}  />
      ))}
        {fetching && (
          <div style={{textAlign:'center'}}>
            <BounceLoader speedMultiplier={5} color={'#000000'}/>
          </div>

  
        )}
      </div>
    </div>
  );
}

export default App;
