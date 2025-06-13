
import UploadFile from "./components/UploadFile"
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Upload Images on Bunny CDN ',
  description: 'you can upload multiple images or single images on bunny cdn.',
}

export default function Home() {
 


  return (
    <>
      <div className="mt-5 ">
  
  <UploadFile/>


      </div>


    </>
  );
}
