"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BOOK } from "../graphql/queries";
import { MdOutlineDataSaverOff } from "react-icons/md";

import "../app/styles/App.css";

interface BookformProps {
  onClose: () => void;
  refetchBooks: () => void;
}

interface Errors {
  title?: string;
  author?: string;
  publicationDate?: string;
  isbn?: string;
  genre?: string;
  rating?: string;
}

const Bookform: React.FC<BookformProps> = ({ onClose, refetchBooks }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState<number>(1);
  const [cover, setCover] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [addBook] = useMutation(ADD_BOOK);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap-grid.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    else if (title.length > 100) newErrors.title = "Title must be ≤ 100 characters.";
    if (!author.trim()) newErrors.author = "Author is required.";
    else if (author.length > 50) newErrors.author = "Author must be ≤ 50 characters.";
    if (!publicationDate) newErrors.publicationDate = "Publication date is required.";
    if (!isbn.trim()) newErrors.isbn = "ISBN is required.";
    else if (!/^\d{13}$/.test(isbn)) newErrors.isbn = "ISBN must be exactly 13 digits.";
    if (!genre) newErrors.genre = "Genre is required.";
    if (!rating || rating < 1 || rating > 5) newErrors.rating = "Rating must be between 1 and 5.";
    return newErrors;
  };

  const handleImageConvert = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCover(reader.result as string);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await addBook({
        variables: {
          title,
          author,
          publicationDate,
          isbn,
          genre,
          rating,
          coverImage: cover,
        },
      });

      refetchBooks();
      onClose();
    } catch (err) {
      console.error("GraphQL Error creating book:", err);
      alert("Failed to create book.");
    }
  };

  return (
    <div className={`bookform-backdrop ${visible ? "show" : ""}`}>
      <div className="bookformmodal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h3 className="heading2">Create New Book</h3>

        <div className="container mt-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              
              <div className="col-md-6 mb-4">
                <label className="inputlabel">Title</label>
                <input
                  type="text"
                  className="inputbox"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                />
                {errors.title && <div className="text-danger">{errors.title}</div>}
              </div>

             
              <div className="col-md-6 mb-4">
                <label className="inputlabel">Author</label>
                <input
                  type="text"
                  className="inputbox"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={50}
                  required
                />
                {errors.author && <div className="text-danger">{errors.author}</div>}
              </div>

             
              <div className="col-md-6 mb-4">
                <label className="inputlabel">Publication Date</label>
                <input
                  type="date"
                  className="inputbox"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  required
                />
                {errors.publicationDate && <div className="text-danger">{errors.publicationDate}</div>}
              </div>

            
              <div className="col-md-6 mb-4">
                <label className="inputlabel">ISBN</label>
                <input
                  type="text"
                  className="inputbox"
                  value={isbn}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setIsbn(val);
                  }}
                  maxLength={13}
                  required
                />
                {errors.isbn && <div className="text-danger">{errors.isbn}</div>}
              </div>

              <div className="col-md-6 mb-4">
                <label className="inputlabel">Genre</label>
                <select
                  className="inputbox"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-fiction">Non-fiction</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-fi">Sci-fi</option>
                  <option value="Self Help">Self Help</option>
                  <option value="Others">Others</option>
                </select>
                {errors.genre && <div className="text-danger">{errors.genre}</div>}
              </div>

           
              <div className="col-md-6 mb-4">
                <label className="inputlabel">Rating (1-5)</label>
                <input
                  type="number"
                  className="inputbox"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  min="1"
                  max="5"
                  required
                />
                {errors.rating && <div className="text-danger">{errors.rating}</div>}
              </div>

          
              <div className="col-md-6 mb-4">
                <label className="inputlabel">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="inputbox"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageConvert(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <div className="col-md-6 mb-4 d-flex align-items-end">
                <button type="submit" className="submitbtn"><MdOutlineDataSaverOff className="submit-icon" />
                  Submit Book
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Bookform;
