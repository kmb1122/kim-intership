import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Fetch API (default + filtered)
  const fetchItems = async (filter = "") => {
    setLoading(true);

    const baseURL =
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

    const url = filter ? `${baseURL}?filter=${filter}` : baseURL;

    try {
      const { data } = await axios.get(url);
      setItems(data);
      setVisibleCount(8); 
    } catch (error) {
      console.error("Error fetching explore items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (value) => {
    fetchItems(value);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const renderCountdown = (expiryDate) => {
    if (!expiryDate) return null;

    const ms = new Date(expiryDate).getTime() - Date.now();
    if (ms <= 0) return "EXPIRED";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      {/* FILTER DROPDOWN */}
      <div>
        <select
          id="filter-items"
          defaultValue=""
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {/* LOADING SKELETON */}
      {loading &&
        new Array(8).fill(0).map((_, index) => (
          <div
            key={`loading-${index}`}
            className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
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


      {/* REAL ITEMS */}
      {!loading &&
        items.slice(0, visibleCount).map((item, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <Link to={`/author/${item.authorId}`}>
                  <img className="lazy" src={item.authorImage} alt={item.author} />
                  <i className="fa fa-check"></i>
                </Link>
              </div>

              {item.expiryDate && (
                <div className="de_countdown">{renderCountdown(item.expiryDate)}</div>
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

                <div className="nft__item_price">{item.price} ETH</div>

                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>{item.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* LOAD MORE BUTTON */}
      {!loading && visibleCount < items.length && (
        <div className="col-md-12 text-center">
          <button onClick={handleLoadMore} id="loadmore" className="btn-main lead">
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;