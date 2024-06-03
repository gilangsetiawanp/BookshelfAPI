const { nanoid } = require('nanoid');
const books = require('./books');
// MENAMBAHKAN BUKU
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Pengelolaan buku gagal. Silakan masukkan judul buku.',
    });
    response.code(400);

    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Pengelolaan buku gagal. Jumlah halaman yang dibaca tidak boleh melebihi jumlah halaman dalam buku.',
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Tambahan buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Pendaftaran buku tidak berhasil',
  });
  response.code(500);
  return response;
};

// get all book
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// book by id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak dapat ditemukan.',
  });
  response.code(404);
  return response;
};

// edit buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const index = books.findIndex((book) => book.id === id);
  const updatedAt = new Date().toISOString();

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Pembaruan buku gagal. Harap masukkan nama bukunya.',
      });
      response.code(400);
      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Pembaruan buku gagal. Jumlah halaman yang dibaca tidak boleh melebihi jumlah halaman dalam buku.',
      });
      response.code(400);
      return response;
    }

    const finished = (pageCount === readPage);

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Pembaruan buku berhasil diselesaikan.',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Pembaruan buku gagal. ID tidak ditemukan',
  });
  response.code(404);

  return response;
};
// DELETE BUKU

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Penghapusan buku berhasil.',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Penghapusan buku tidak berhasil. ID tidak ditemukan.',
  });
  response.code(404);

  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
