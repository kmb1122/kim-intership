import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { useParams } from "react-router-dom";

const Author = () => {
  const [items, setItems] = useState([]);
  const { authorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthorItems = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setItems(data);
      } catch (error) {
        console.error("Error fetching author items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorItems();
  }, [authorId]);

  const handleFollowToggle = () => {
  setItems((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
    };
  });

  setIsFollowing((prev) => !prev);
};

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">

                {loading ? (
                  /* Loading Skeleton */
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div
                          className="skeleton-box"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                          }}
                        ></div>

                        <div className="profile_name" style={{ marginTop: "20px" }}>
                          <div
                            className="skeleton-box"
                            style={{ width: "200px", height: "20px", marginBottom: "10px" }}
                          ></div>
                          <div
                            className="skeleton-box"
                            style={{ width: "150px", height: "16px", marginBottom: "10px" }}
                          ></div>
                          <div
                            className="skeleton-box"
                            style={{ width: "250px", height: "16px" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div
                          className="skeleton-box"
                          style={{ width: "120px", height: "20px", marginBottom: "10px" }}
                        ></div>
                        <div
                          className="skeleton-box"
                          style={{ width: "100px", height: "40px" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : 
                /* Real API Data */
                (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={items.authorImage} alt={items.name} />
                        <i className="fa fa-check"></i>

                        <div className="profile_name">
                          <h4>
                            {items.authorName}
                            <span className="profile_username">@{items.tag}</span>
                            <span id="wallet" className="profile_wallet">
                              {items.address}
                            </span>
                            <button id="btn_copy" title="Copy Text">
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">{items.followers} followers</div>
                        <button onClick={handleFollowToggle} className="btn-main">
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems items={items.nftCollection} authorImage={items.authorImage} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
