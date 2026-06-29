import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Fetch API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );

        setItems(data);        // original order
        setSortedItems(data);  // sorted view
      } catch (error) {
        console.error("Error fetching explore items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Live countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Countdown formatter
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

  // Sorting logic
  const handleSort = (value) => {
    let sorted = [...items];

    switch (value) {
      case "price_low_to_high":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "price_high_to_low":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "likes_high_to_low":
        sorted.sort((a, b) => b.likes - a.likes);
        break;

      default:
        sorted = [...items]; // reset to original API order
        break;
    }

    setSortedItems(sorted);
    setVisibleCount(8); // reset visible count on sort
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      {/* FILTER DROPDOWN */}
      <div>
        <select
          id="filter-items"
          defaultValue=""
          onChange={(e) => handleSort(e.target.value)}
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
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <div className="skeleton-author"></div>
                <i className="fa fa-check"></i>
              </div>

              <div className="de_countdown skeleton-code"></div>

              <div className="nft__item_wrap">
                <div className="skeleton-nft"></div>
              </div>

              <div className="nft__item_info">
                <div className="skeleton-title"></div>
                <div className="skeleton-code"></div>
              </div>
            </div>
          </div>
        ))}

      {/* REAL ITEMS */}
      {!loading &&
        sortedItems.slice(0, visibleCount).map((item, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <Link to="/author">
                  <img
                    className="lazy"
                    src={item.authorImage}
                    alt={item.author}
                  />
                  <i className="fa fa-check"></i>
                </Link>
              </div>

              {/* COUNTDOWN */}
              {item.expiryDate && (
                <div className="de_countdown">
                  {renderCountdown(item.expiryDate)}
                </div>
              )}

              <div className="nft__item_wrap">
                <div className="nft__item_extra">
                  <div className="nft__item_buttons">
                    <button>Buy Now</button>
                    <div className="nft__item_share">
                      <h4>Share</h4>
                      <a href="" target="_blank" rel="noreferrer">
                        <i className="fa fa-facebook fa-lg"></i>
                      </a>
                      <a href="" target="_blank" rel="noreferrer">
                        <i className="fa fa-twitter fa-lg"></i>
                      </a>
                      <a href="">
                        <i className="fa fa-envelope fa-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <Link to="/item-details">
                  <img
                    src={item.nftImage}
                    className="lazy nft__item_preview"
                    alt={item.title}
                  />
                </Link>
              </div>

              <div className="nft__item_info">
                <Link to="/item-details">
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
      {!loading && visibleCount < sortedItems.length && (
        <div className="col-md-12 text-center">
          <button
            onClick={handleLoadMore}
            id="loadmore"
            className="btn-main lead"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;