import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuthorItems = ({ items, authorImage }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  // Loading Skeleton
  if (!items || !Array.isArray(items)) {
    return (
      <div className="row">
        {new Array(8).fill(0).map((_, index) => (
          <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="nft__item">
              <div className="author_list_pp">
                <div className="skeleton-box" style={{ width: 50, height: 50, borderRadius: "50%" }}></div>
              </div>

              <div className="nft__item_wrap">
                <div className="skeleton-box" style={{ width: "100%", height: 300 }}></div>
              </div>

              <div className="nft__item_info">
                <div className="skeleton-box" style={{ width: "70%", height: 20 }}></div>
                <div className="skeleton-box" style={{ width: "40%", height: 18, marginTop: 10 }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Real Items
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.slice(0, visibleCount).map((item, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <img className="lazy" src={authorImage} alt={item.author} />
                  <i className="fa fa-check"></i>
                </div>

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

                  <div className="nft__item_price">{item.price} ETH</div>

                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {visibleCount < items.length && (
            <div className="col-md-12 text-center">
              <button onClick={handleLoadMore} id="loadmore" className="btn-main lead">
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;

