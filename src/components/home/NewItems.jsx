import React, { useEffect, useState } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const carouselOptions = {
    loop: true,
    nav: true,
    dots: false,
    autoplay: false,
    smartSpeed: 450,
    margin: 24,
    responsive: {
      0: { 
        items: 1, 
        margin: 16 
      },
      580: { 
        items: 2, 
        margin: 20 
      },
      770: { 
        items: 3, 
        margin: 22 
      },
      1200: { 
        items: 4, 
        margin: 24 
      },
    },
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );

        const enriched = data.map((item) => ({
          ...item,
          timeLeft: item.expiryDate
            ? new Date(item.expiryDate).getTime() - Date.now()
            : null,
        }));

        setItems(enriched);
      } catch (error) {
        console.error("Error fetching new items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      document.querySelectorAll("[data-expiry]").forEach((el) => {
        const expiry = Number(el.getAttribute("data-expiry"));
        const ms = expiry - Date.now();

        if (ms <= 0) {
          el.textContent = "EXPIRED";
          return;
        }

        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        el.textContent = `${hours}h ${minutes}m ${seconds}s`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);


  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>
          <div className="col-lg-12">

            {/* LOADING SKELETON CAROUSEL */}
            {loading && (
              <OwlCarousel className="owl-theme" {...carouselOptions}>
                {new Array(4).fill(0).map((_, index) => (
                  <div className="item" key={`loading-${index}`}>
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <div className="skeleton-box"
                          style={{ width: 50, height: 50, borderRadius: "50%" }}
                        ></div>
                      </div>
                      <div className="nft__item_wrap">
                        <div className="skeleton-box"
                          style={{ width: "100%", height: 300 }}
                        ></div>
                      </div>
                      <div className="nft__item_info">
                        <div className="skeleton-box"
                          style={{ width: "70%", height: 20 }}
                        ></div>
                        <div className="skeleton-box"
                          style={{ width: "40%", height: 18, marginTop: 10 }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </OwlCarousel>
              )}

            {/* REAL API CAROUSEL */}
            {!loading && (
              <OwlCarousel className="owl-theme" {...carouselOptions}>
                {items.map((item, index) => (
                  <div className="item" key={index}>
                    <div className="nft__item">

                      <div className="author_list_pp">
                        <Link to={`/author/${item.authorId}`}>
                          <img className="lazy" src={item.authorImage} alt="" />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                     {item.expiryDate && (
                        <div
                          className="de_countdown"
                          data-expiry={new Date(item.expiryDate).getTime()}
                        >
                          {/* initial render */}
                          {(() => {
                            const ms = new Date(item.expiryDate).getTime() - Date.now();
                            if (ms <= 0) return "EXPIRED";

                            const totalSeconds = Math.floor(ms / 1000);
                            const hours = Math.floor(totalSeconds / 3600);
                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                            const seconds = totalSeconds % 60;

                            return `${hours}h ${minutes}m ${seconds}s`;
                          })()}
                        </div>
                      )}

                      <div className="nft__item_wrap">
                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.title}
                          />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>

                        <div className="nft__item_price">
                          {item.price} ETH
                        </div>

                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </OwlCarousel>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;

