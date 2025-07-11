"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_BOOKS, DELETE_BOOK } from "@/graphql/queries";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Bookform from "@/components/Bookform";
import { CiSearch } from "react-icons/ci";
import { GrSubtractCircle } from "react-icons/gr";
import { MdAdd } from "react-icons/md";



interface Book {
  uniqueId: string;
  title: string;
  author: string;
  genre: string;
}

export default function BookListClient({ initialData }: { initialData: any }) {
  const [hydratedData, setHydratedData] = useState(initialData);
  const { data, refetch } = useQuery(GET_ALL_BOOKS, {
    skip: !!initialData,
  });

  useEffect(() => {
    if (data?.allBooks) {
      setHydratedData(data);
    }
  }, [data]);

  const [deleteBook] = useMutation(DELETE_BOOK);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const rowsPerPage = 10;
  const books: Book[] = hydratedData?.allBooks ?? [];

 const handleDelete = async (uniqueId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;
  try {
    await deleteBook({ variables: { uniqueId } });
    window.location.reload(); 
  } catch (err) {
    console.error("Error deleting book:", err);
  }
};

  

  const handleRowClick = (book: Book) => router.push(`/book/${book.uniqueId}`);

  const handleSort = (field: keyof Book) => {
    setSortField(field);
    setSortOrder((prev) => (sortField === field && prev === "asc" ? "desc" : "asc"));
  };

  const renderSortIndicator = (field: string) => {
    if (field !== sortField) return "";
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const filtered = books.filter((book) =>
    [book.title, book.author, book.genre].some((f) =>
      f.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField as keyof Book];
    const bVal = b[sortField as keyof Book];
    return aVal < bVal ? (sortOrder === "asc" ? -1 : 1) : aVal > bVal ? (sortOrder === "asc" ? 1 : -1) : 0;
  });

  const currentBooks = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(sorted.length / rowsPerPage);

  return (
    <div>
      <h3 className="heading">Book Management</h3>
      <button onClick={() => setShowForm(true)} className="create">
     <MdAdd className="addicon" />
  Add Book
      </button>

      <div className="search-box">
        <CiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search books..."
          className="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="table">
        <table className="book-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort("title")}>Title{renderSortIndicator("title")}</th>
              <th onClick={() => handleSort("author")}>Author{renderSortIndicator("author")}</th>
              <th onClick={() => handleSort("genre")}>Genre{renderSortIndicator("genre")}</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book, index) => (
              <tr key={book.uniqueId} onClick={() => handleRowClick(book)}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td
                  className="delete-cell"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(book.uniqueId);
                  }}
                >
                  <GrSubtractCircle />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="pagination"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span style={{ margin: "0 15px", color: "white" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showForm && <Bookform onClose={() => setShowForm(false)} refetchBooks={refetch} />}
    </div>
  );
}
