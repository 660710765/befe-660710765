import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

import {
  ViewGridIcon,
  ViewListIcon,
  PencilAltIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/outline';

const AllBookPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const booksPerPage = 12;
  const categories = [
    'all', 'fiction', 'non-fiction', 'science', 'history', 'art',
    'psychology', 'business', 'technology', 'cooking'
  ];

  const getApiUrl = () => process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/v1/books`);
        if (!res.ok) throw new Error('Failed to fetch books');
        const data = await res.json();
        setBooks(data);
        setFilteredBooks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // search
  const handleSearch = (term) => {
    const filtered = books.filter(b =>
      (b.title || '').toLowerCase().includes(term.toLowerCase()) ||
      (b.author || '').toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  // category
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(b =>
        (b.category || '').toLowerCase() === category.toLowerCase()
      );
      setFilteredBooks(filtered);
    }
    setCurrentPage(1);
  };

  // sort
  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...filteredBooks];
    switch (value) {
      case 'price-low':
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
      default:
        sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }
    setFilteredBooks(sorted);
  };

  // delete (optimistic)
  const handleDelete = async (bookId) => {
    const target = filteredBooks.find(b => b.id === bookId);
    if (!target) return;
    if (!window.confirm(`ลบหนังสือ "${target.title}" ใช่ไหม?`)) return;

    const prevBooks = books;
    const prevFiltered = filteredBooks;
    setBooks(books.filter(b => b.id !== bookId));
    setFilteredBooks(filteredBooks.filter(b => b.id !== bookId));

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/v1/books/${bookId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('ลบไม่สำเร็จ');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบหนังสือ');
      setBooks(prevBooks);
      setFilteredBooks(prevFiltered);
    }
  };

  // edit
  const handleEdit = (bookId) => navigate(`/books/${bookId}/edit`);

  // pagination
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginate = (n) => setCurrentPage(n);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-600 mt-10">เกิดข้อผิดพลาด: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">หนังสือทั้งหมด</h1>
            <p className="text-gray-600">ค้นพบหนังสือที่คุณชื่นชอบจากคอลเล็กชันของเรา</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button>

              <NavLink to="/store-manager/add-book">
              <PlusIcon className="w-5 h-5" />
              </NavLink>
              
              
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border
                ${viewMode === 'grid' ? 'bg-viridian-600 text-white border-viridian-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              title="Grid view"
            >
              <ViewGridIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border
                ${viewMode === 'list' ? 'bg-viridian-600 text-white border-viridian-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              title="List view"
            >
              <ViewListIcon className="w-5 h-5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-viridian-500 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-viridian-500 cursor-pointer"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="newest">ใหม่ล่าสุด</option>
              <option value="price-low">ราคาต่ำ-สูง</option>
              <option value="price-high">ราคาสูง-ต่ำ</option>
              <option value="popular">ยอดนิยม</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            พบหนังสือ {filteredBooks.length} เล่ม
            {selectedCategory !== 'all' && ` ในหมวด ${selectedCategory}`}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          currentBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่พบหนังสือที่ค้นหา</p>
            </div>
          )
        ) : (
          currentBooks.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{book.title}</div>
                        {book.isbn && <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{book.author}</td>
                      <td className="px-4 py-3 text-gray-700">{book.category || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {typeof book.price === 'number' ? book.price.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleEdit(book.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            title="แก้ไข"
                          >
                            <PencilAltIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            title="ลบ"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่พบหนังสือที่ค้นหา</p>
            </div>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                ก่อนหน้า
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                    ? 'bg-viridian-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                ถัดไป
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookPage;
