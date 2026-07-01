import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const HotCollections = () => {
  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">

            {/* LOADING SKELETON CAROUSEL */}
            {loading && (
            <OwlCarousel className="owl-theme" {...carouselOptions}>
              {new Array(4).fill(0).map((_, index) => (
                <div className="item" key={`loading-${index}`}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <div
                        className="skeleton-box"
                        style={{ width: "100%", height: "250px", borderRadius: "10px" }}
                      ></div>
                    </div>
                    <div className="nft_coll_pp">
                      <div
                        className="skeleton-box"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <div
                        className="skeleton-box"
                        style={{ width: "70%", height: "20px", marginBottom: "10px" }}
                      ></div>
                      <div
                        className="skeleton-box"
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
          {new Array(4).fill(0).map((_, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  <Link to="/item-details">
                    <img src={nftImage} className="lazy img-fluid" alt="" />
                  </Link>
                </div>
                <div className="nft_coll_pp">
                  <Link to="/author">
                    <img className="lazy pp-coll" src={AuthorImage} alt="" />
                  </Link>
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft_coll_info">
                  <Link to="/explore">
                    <h4>Pinky Ocean</h4>
                  </Link>
                  <span>ERC-192</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;