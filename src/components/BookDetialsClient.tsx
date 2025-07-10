"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_BOOK_BY_ID } from "@/graphql/queries";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import "@/app/styles/App.css";

export default function BookDetailsClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const params = useParams();
  const [hydratedData, setHydratedData] = useState(initialData);

  const { data, loading, error } = useQuery(GET_BOOK_BY_ID, {
    variables: { uniqueId: params.id },
    skip: !!initialData,
  });

  useEffect(() => {
    if (data?.bookByUniqueId) {
      setHydratedData(data);
    }
  }, [data]);

  const book = hydratedData?.bookByUniqueId;

  useEffect(() => {
    const cssLink = document.createElement("link");
    cssLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    cssLink.rel = "stylesheet";
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(cssLink);
      document.body.removeChild(script);
    };
  }, []);

  if (!book && loading) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;
  if (!book && error) return <p style={{ color: "red", textAlign: "center" }}>Error loading book.</p>;

  const handleBack = () => router.push("/");

  return (
    <div className="bookdetails-page">
      <span className="backbtn" onClick={handleBack}>
        <IoArrowBackCircleOutline />
      </span>

      <div className="bootsrap">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#details"
              type="button"
              role="tab"
            >
              Details
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="more-tab"
              data-bs-toggle="tab"
              data-bs-target="#more"
              type="button"
              role="tab"
            >
              More
            </button>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="details" role="tabpanel">
            <h3 className="bheading">{book.title}</h3>
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  <div className="subheading">
                    Author: <span className="subheadingdetail">{book.author}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="subheading">
                    Genre: <span className="subheadingdetail">{book.genre}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="subheading">
                    Publication Date: <span className="subheadingdetail">{book.publicationDate}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="subheading">
                    ISBN: <span className="subheadingdetail">{book.isbn}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="subheading">
                    Rating:
                    {Array(book.rating).fill(null).map((_, i) => (
                      <span key={i} className="subheadingdetail">
                        <IoIosStar />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-pane fade" id="more" role="tabpanel">
            <div className="moreheading">{book.title}</div>
            {book.coverImage && (
              <img className="image" src={book.coverImage} alt="Book Cover" />
            )}
            {book.pageCount && (
              <div className="subheading" style={{ width: "16%", margin: "auto" }}>
                No: of pages {book.pageCount}
              </div>
            )}
            <div className="synopsis">Synopsis</div>
            <p className="para">{book.description || "No description available."}</p>
            {book.previewLink && (
              <p style={{ marginTop: "20px", textAlign: "center" }}>
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning"
                >
                  See on Google Books
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
