import React, { useEffect, useState } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

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
        margin: 16,
      },
      580: {
        items: 2,
        margin: 20,
      },
      770: {
        items: 3,
        margin: 22,
      },
      1200: {
        items: 4,
        margin: 24,
      },
    },
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching hot collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>Hot Collections</h2>
            <div className="small-border bg-color-2"></div>
          </div>
          <div className="col-lg-12">

            {/* LOADING SKELETON CAROUSEL */}
            {loading && (
            <OwlCarousel className="owl-theme" {...carouselOptions}>
              {new Array(4).fill(0).map((_, index) => (
                <div className="item" key={`loading-${index}`}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <div className="skeleton-box" 
                      style={{ width: "100%", height: "250px", borderRadius: "10px" }}
                      ></div>
                    </div>
                    <div className="nft_coll_pp">
                      <div className="skeleton-box" 
                      style={{width: "50px", height: "50px", borderRadius: "50%"}}
                      ></div>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <div className="skeleton-box"
                        style={{ width: "70%", height: "20px", marginBottom: "10px" }}
                      ></div>
                      <div className="skeleton-box"
                        style={{ width: "40%", height: "18px" }}
                      ></div>
                    </div>

                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}

            {/* REAL API CARDS CAROUSEL */}
            {!loading && (
              <OwlCarousel className="owl-theme" {...carouselOptions}>
                {collections.map((item, index) => (
                  <div className="item" key={index}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img
                            src={item.nftImage}
                            className="lazy img-fluid"
                            alt={item.title}
                          />
                        </Link>
                      </div>

                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={item.authorImage}
                            alt={item.author}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>

                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{item.title}</h4>
                        </Link>
                        <span>ERC-{item.code}</span>
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

export default HotCollections;

