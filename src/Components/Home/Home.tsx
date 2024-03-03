import React, { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { SearchContext } from "../Context";
import { useContext } from "react";
import { CachedData, ImageDataType } from "./Home.types";

// ამ ფაილში გამოვიყენე infinite scroll_ისთვის useRef ჰუკი და ქეშირებისთვის useState სადაც ვინახავ 
// აწ უკვე დასერჩილ მონაცემებს. ასევე ამ ფეიჯზე გამომაქვს სურათები და სურათზე დაკლიკებისას ხსნის სურათის
// მოდალს სადაც api_დან მომაქვს ჩამოტვირთვების, ვიუების და ლაიქების რაოდენობები.

const API = "https://api.unsplash.com/search/photos";
const APIDetails = "https://api.unsplash.com/photos";

export default function Home() {
  const refHook = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<any>([]);
  const [searchWord, setSearchWord] = useState<string>("child");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addSearchWord }: any = useContext(SearchContext);
  const [selectedImage, setSelectedImage] = useState<ImageDataType>(null);
  const [page, setPage] = useState<number>(1);
  const [cachedData, setCachedData] = useState<CachedData>({});
  const observerRef = useRef(null);


  const fetchImages = async (pageNumber: number, word: string) => {
    if (cachedData[searchWord]) {
      setImages(cachedData[searchWord])
      return;
    };
    try {
      setIsLoading(true);
      const api = `${API}?query=${word}&page=${pageNumber}$per_page=20&client_id=${process.env.REACT_APP_KEY}&order_by=popular&stats=true`;
      const response = await axios.get(api);
      setImages([...images, ...response.data.results]);
      setCachedData({ ...cachedData, [word]: response.data.results });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page, searchWord);
  }, [page, searchWord]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage(page + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, page]);

  function handleSubmit(e: any) {
    e.preventDefault();
    const newSearchWord = refHook.current.value;
    setSearchWord(newSearchWord);
    setPage(1);
    setImages([]);
    if (newSearchWord !== "") {
      addSearchWord(newSearchWord);
    };
  };

  async function handleImageClick(image: any) {
    const detailsUrl = `${APIDetails}/${image.id}?client_id=${process.env.REACT_APP_KEY}&statistics`;
    const response = await axios.get(detailsUrl);
    const imageData: ImageDataType = {
      imageURL: response.data.urls.full,
      downloads: response.data.downloads,
      likes: response.data.likes,
      views: response.data.views,
    };
    setSelectedImage(imageData);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <h1 className="title">Search Images</h1>
      <form onSubmit={handleSubmit} className="form">
        <input ref={refHook} type="search" placeholder="Search Image" />
      </form>
      {
        <section className="images-center">
          <article className="images-container">
            {images.map((image: any, index: number) => {
              return (
                <img
                  key={`${image.id}-${index}`}
                  src={image.urls.small}
                  className="images"
                  onClick={() => handleImageClick(image)}
                />
              );
            })}
            {isLoading && <p>Loading...</p>}
          <div ref={observerRef} />
          {console.log(observerRef)}
          </article>
        </section>
      }
      {selectedImage && (
        <div className="modal">
          <div className="img-container">
            <img
              src={selectedImage.imageURL}
              alt="Full size image"
              className="modal-image"
            />
            <div className="modal-info">
              <p>Downloads: {selectedImage.downloads}</p>
              <p>Views: {selectedImage.views}</p>
              <p>Likes: {selectedImage.likes}</p>
            </div>
            <button onClick={closeModal} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
