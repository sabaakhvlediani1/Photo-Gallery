import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../Context";
import styles from "./History.module.css";
import axios from "axios";

const API = "https://api.unsplash.com/search/photos";

// ამ ფაილში infinite scroll_ისთვის გამოყენებული მაქვს განსხვავებული ლოგიკა. აგრეთვე context.tsx ფაილის
// საშუალებით მომაქვს ინფორმაცია მომხმარებლის მიერ შეყვანილ სიტყვებზე, რომელსაც ვინახავ totalWords_ში.
// ასევე ვიყენებ ლოკალსტორეჯს გვერდის და საძიებო სიტყვის შესანახად.

export default function History() {
  const { totalWords }: any = useContext(SearchContext);
  const [images, setImages] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchImages = async () => {
    const searchWord = localStorage.getItem('searchWord');
    const page = localStorage.getItem('page');
    if (!searchWord) {
      return;
    }
    try {
      setIsLoading(true);
      const apiUrl = `${API}?query=${searchWord}&per_page=20&page=${page}&client_id=${process.env.REACT_APP_KEY}&order_by=popular`;
      const { data } = await axios.get(apiUrl);
      setImages((prevImages) => [...prevImages, ...data.results]);
      localStorage.setItem('page', (parseInt(page) + 1).toString());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBtnClick = (word: string) => {
    localStorage.setItem('searchWord', word);
    localStorage.setItem('page', '1')
    fetchImages();
  };

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;

    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;

    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom && !isLoading) {
      fetchImages();
    }
  };

  useEffect(() => {
    if (totalWords.length === 0) {
      localStorage.clear();
    }
  }, [totalWords]);

  return (
    <>
      <section className={styles.container}>
        {totalWords.length > 0 ? (
          <h2>Searched Words</h2>
        ) : (
          <h2>No Searched Words</h2>
        )}
        <ul className={styles.wordList}>
          {totalWords.map((word: string) => (
            <li
              key={word}
              className={styles.wordItem}
              onClick={() => handleBtnClick(word)}
            >
              {word}
            </li>
          ))}
        </ul>
      </section>
      <section className="images-center">
        <article className="images-container">
          {images.map((image: any, index: number) => {
            return (
              <img key={index} src={image.urls.small} className="images" />
            );
          })}
        </article>/
      </section>
    </>
  );
}
